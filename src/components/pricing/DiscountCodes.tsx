import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { DiscountCode, ServiceOption } from '@/utils/pricingTypes';

const DiscountCodes: React.FC = () => {
  const [discounts, setDiscounts] = React.useState<DiscountCode[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [services, setServices] = React.useState<ServiceOption[]>([]);
  const { toast } = useToast();

  React.useEffect(() => {
    // In the future, this will fetch actual discount codes
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
      description: "Discount code management will be available soon",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Discount Codes</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-1" /> Refresh
          </Button>
          <Button onClick={() => toast({
            title: "Coming Soon",
            description: "Discount code creation will be available soon"
          })}>
            Add Discount
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-800">
          <p>Discount code management is coming soon. You'll be able to create and manage discount codes for your services.</p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Loading discount codes...
                </TableCell>
              </TableRow>
            ) : discounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No discount codes found. Click "Add Discount" to create your first discount code.
                </TableCell>
              </TableRow>
            ) : (
              discounts.map((discount) => (
                <TableRow key={discount.id}>
                  {/* Discount code details would be rendered here */}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default DiscountCodes;
