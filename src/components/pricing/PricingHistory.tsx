
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { PriceChange } from '@/utils/pricingTypes';
import { formatPrice } from '@/utils/pricing/fetchPricing';

const PricingHistory: React.FC = () => {
  const [priceChanges, setPriceChanges] = React.useState<PriceChange[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    // In the future, this will fetch actual price change history
    const mockLoad = async () => {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };
    
    mockLoad();
  }, []);

  const handleRefresh = () => {
    toast({
      title: "Coming Soon",
      description: "Price history will be available soon",
    });
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Price Change History</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-1" /> Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-800">
          <p>Price change history will show all modifications to service and package prices.</p>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Service/Package</TableHead>
              <TableHead>Old Price</TableHead>
              <TableHead>New Price</TableHead>
              <TableHead>Changed By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Loading price history...
                </TableCell>
              </TableRow>
            ) : priceChanges.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No price change history found.
                </TableCell>
              </TableRow>
            ) : (
              priceChanges.map((change) => (
                <TableRow key={change.id}>
                  <TableCell>{formatDate(change.created_at)}</TableCell>
                  <TableCell>{change.entity_name || 'Unknown'}</TableCell>
                  <TableCell>{formatPrice(change.old_price)}</TableCell>
                  <TableCell>{formatPrice(change.new_price)}</TableCell>
                  <TableCell>{change.changed_by || 'System'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PricingHistory;
