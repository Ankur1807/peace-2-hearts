
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';

interface PackagePricingHeaderProps {
  onRefresh: () => void;
  onSync: () => void;
  loading: boolean;
  updating: boolean;
  showSyncButton: boolean;
}

const PackagePricingHeader = ({
  onRefresh,
  onSync,
  loading,
  updating,
  showSyncButton
}: PackagePricingHeaderProps) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle>Package Pricing</CardTitle>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={loading || updating}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        
        {showSyncButton && (
          <Button
            variant="destructive"
            onClick={onSync}
            disabled={updating}
          >
            Sync Package Prices
          </Button>
        )}
      </div>
    </CardHeader>
  );
};

export default PackagePricingHeader;
