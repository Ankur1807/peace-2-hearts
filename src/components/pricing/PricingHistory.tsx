
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { PriceChange } from '@/utils/pricingTypes';

const PricingHistory = () => {
  const [history, setHistory] = useState<PriceChange[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPricingHistory();
  }, []);

  const fetchPricingHistory = async () => {
    try {
      setLoading(true);
      
      // Get price history
      const { data: historyData, error: historyError } = await supabase
        .from('pricing_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (historyError) throw historyError;
      
      // Enhance history data with entity names
      const enhancedHistory = await Promise.all((historyData || []).map(async (record: any) => {
        try {
          if (record.entity_type === 'service') {
            const { data: serviceData } = await supabase
              .from('service_pricing')
              .select('service_name')
              .eq('id', record.entity_id)
              .single();
              
            return {
              ...record,
              entity_name: serviceData?.service_name || 'Unknown Service'
            };
          } else if (record.entity_type === 'package') {
            const { data: packageData } = await supabase
              .from('package_pricing')
              .select('package_name')
              .eq('id', record.entity_id)
              .single();
              
            return {
              ...record,
              entity_name: packageData?.package_name || 'Unknown Package'
            };
          } else {
            return {
              ...record,
              entity_name: 'Unknown Entity'
            };
          }
        } catch (err) {
          return {
            ...record,
            entity_name: 'Unknown Entity'
          };
        }
      }));
      
      setHistory(enhancedHistory as PriceChange[]);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to fetch price history: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy, hh:mm a');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Change History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Entity Type</TableHead>
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
                        {record.entity_type}
                      </TableCell>
                      <TableCell>{record.entity_name}</TableCell>
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
