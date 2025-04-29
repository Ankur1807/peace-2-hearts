
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { verifyAndSyncPayment } from '@/utils/payment/services/paymentVerificationService';
import { recoverEmailByReferenceId } from '@/utils/email/manualEmailRecovery';

const PaymentMigrationPanel = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({});
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [failedTransactions, setFailedTransactions] = useState<any[]>([]);
  const { toast } = useToast();

  // Load failed transactions on mount
  useEffect(() => {
    loadFailedTransactions();
  }, []);

  const loadFailedTransactions = async () => {
    setIsLoading(true);
    try {
      // Get consultations with payment_id but email_sent is false
      const { data: emailFailures, error: emailError } = await supabase
        .from('consultations')
        .select('*')
        .eq('email_sent', false)
        .not('payment_id', 'is', null)
        .order('created_at', { ascending: false })
        .limit(20);

      if (emailError) throw emailError;

      // Get consultations with status 'payment_received_needs_details'
      const { data: incompleteRecords, error: incompleteError } = await supabase
        .from('consultations')
        .select('*')
        .eq('status', 'payment_received_needs_details')
        .order('created_at', { ascending: false })
        .limit(20);

      if (incompleteError) throw incompleteError;

      // Combine and deduplicate results
      const combinedResults = [...(emailFailures || []), ...(incompleteRecords || [])];
      const uniqueIds = new Set();
      const uniqueResults = combinedResults.filter(item => {
        if (uniqueIds.has(item.id)) return false;
        uniqueIds.add(item.id);
        return true;
      });

      setFailedTransactions(uniqueResults);
    } catch (error) {
      console.error("Error loading failed transactions:", error);
      toast({
        title: "Error",
        description: "Failed to load transactions that need recovery",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      // Search by reference ID, payment ID, or client details
      const query = searchQuery.trim();
      
      const { data, error } = await supabase
        .from('consultations')
        .select('*')
        .or(`reference_id.ilike.%${query}%,payment_id.ilike.%${query}%,client_name.ilike.%${query}%,client_email.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      setSearchResults(data || []);
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search Failed",
        description: "Could not search for transactions",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecovery = async (consultation: any) => {
    setIsProcessing(prev => ({ ...prev, [consultation.id]: true }));
    
    try {
      let success = false;
      
      // If we have a payment ID, try to verify it first
      if (consultation.payment_id) {
        // Verify payment
        const paymentVerified = await verifyAndSyncPayment(consultation.payment_id);
        
        if (paymentVerified) {
          // Send email using the recovery function
          success = await recoverEmailByReferenceId(consultation.reference_id);
          
          if (success) {
            toast({
              title: "Recovery Successful",
              description: "Transaction verified and email sent"
            });
            
            // Refresh the lists
            loadFailedTransactions();
            if (searchResults.length > 0) handleSearch();
          } else {
            toast({
              title: "Partial Recovery",
              description: "Payment verified but email sending failed",
              variant: "destructive"
            });
          }
        } else {
          toast({
            title: "Recovery Failed",
            description: "Could not verify payment with payment processor",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Recovery Failed",
          description: "No payment ID available for verification",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Recovery error:", error);
      toast({
        title: "Recovery Error",
        description: "An unexpected error occurred during recovery",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(prev => ({ ...prev, [consultation.id]: false }));
    }
  };

  const renderTransactionTable = (transactions: any[], title: string, emptyMessage: string) => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{transactions.length} transactions found</CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Payment ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.reference_id}</TableCell>
                  <TableCell>{new Date(transaction.created_at).toLocaleString()}</TableCell>
                  <TableCell>
                    {transaction.client_name}
                    <br />
                    <span className="text-xs text-muted-foreground">{transaction.client_email}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs">{transaction.payment_id || "No payment ID"}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={transaction.email_sent ? "default" : "destructive"}>
                      {transaction.status}
                    </Badge>
                    <br />
                    <Badge variant={transaction.payment_status === 'completed' ? "outline" : "secondary"} className="mt-1">
                      {transaction.payment_status || "No payment status"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRecovery(transaction)}
                      disabled={isProcessing[transaction.id]}
                    >
                      {isProcessing[transaction.id] ? (
                        <>
                          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                          Recovering...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-1 h-4 w-4" />
                          Recover
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            {isLoading ? (
              <div className="flex justify-center items-center flex-col">
                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                <p>Loading transactions...</p>
              </div>
            ) : (
              emptyMessage
            )}
          </div>
        )}
      </CardContent>
      {transactions.length > 0 && (
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={loadFailedTransactions} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-1" />}
            Refresh
          </Button>
        </CardFooter>
      )}
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Recovery Dashboard</CardTitle>
          <CardDescription>
            Search for transactions or recover failed ones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Search by reference ID, payment ID or client name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && renderTransactionTable(
        searchResults,
        "Search Results",
        "No transactions found matching your search criteria."
      )}

      {/* Failed Transactions */}
      {renderTransactionTable(
        failedTransactions,
        "Transactions Needing Recovery",
        "No transactions need recovery at this time."
      )}

      <Card>
        <CardHeader>
          <CardTitle>Manual Recovery</CardTitle>
          <CardDescription>
            For advanced recovery operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-md">
              <p className="text-sm mb-2 font-medium">Manual Transaction Recovery</p>
              <p className="text-xs mb-4 text-muted-foreground">
                You can recover transactions by running the following command in your browser console:
              </p>
              <pre className="bg-background p-2 rounded text-xs overflow-x-auto">
                window.recoverEmailByReferenceId("YOUR-REFERENCE-ID")
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentMigrationPanel;
