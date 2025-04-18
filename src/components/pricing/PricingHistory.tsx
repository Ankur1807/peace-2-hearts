
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { fetchPricingHistory } from '@/utils/pricing/pricingOperations';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface PriceHistoryItem {
  id: string;
  entity_id: string;
  item_name: string;
  item_type: string;
  old_price: number | null;
  new_price: number;
  changed_by: string | null;
  created_at: string;
}

const PricingHistory = () => {
  const [history, setHistory] = useState<PriceHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadHistory = async (showToast = false) => {
    try {
      setLoading(true);
      const historyData = await fetchPricingHistory();
      setHistory(historyData);
      
      if (showToast) {
        toast({
          title: 'History Refreshed',
          description: `Loaded ${historyData.length} price change records`,
        });
      }
    } catch (error: any) {
      console.error('Error loading price history:', error);
      toast({
        title: 'Error',
        description: `Failed to load price history: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy, hh:mm a');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Price Change History</CardTitle>
        <Button 
          variant="outline" 
          onClick={() => loadHistory(true)}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} /> 
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Old Price</TableHead>
                <TableHead>New Price</TableHead>
                <TableHead>Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Loading price history...
                  </TableCell>
                </TableRow>
              ) : history.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No price changes found
                  </TableCell>
                </TableRow>
              ) : (
                history.map((record) => {
                  const priceChange = record.old_price 
                    ? ((record.new_price - record.old_price) / record.old_price) * 100 
                    : 0;
                  
                  return (
                    <TableRow key={record.id}>
                      <TableCell>{formatDate(record.created_at)}</TableCell>
                      <TableCell className="capitalize">
                        {record.item_type}
                      </TableCell>
                      <TableCell>{record.item_name}</TableCell>
                      <TableCell>
                        {record.old_price !== null 
                          ? `₹${record.old_price.toLocaleString()}` 
                          : 'Initial Price'
                        }
                      </TableCell>
                      <TableCell>₹{record.new_price.toLocaleString()}</TableCell>
                      <TableCell>
                        {record.old_price !== null ? (
                          <span className={priceChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                          </span>
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingHistory;
