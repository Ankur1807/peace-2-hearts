
import React, { useState, useEffect } from 'react';
import { auditServicePricing } from '@/utils/audit/pricingAudit';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdminContext';
import { useToast } from '@/hooks/use-toast';

const PricingAudit: React.FC = () => {
  const [auditReport, setAuditReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin } = useAdmin();
  const { toast } = useToast();

  const runAudit = async () => {
    if (!isAdmin) {
      toast({
        title: 'Permission Denied',
        description: 'Only administrators can run the pricing audit.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      const report = await auditServicePricing();
      console.log('Audit report:', report);
      setAuditReport(report);
    } catch (err: any) {
      console.error('Error running audit:', err);
      setError(err.message || 'Failed to run pricing audit');
      toast({
        title: 'Audit Failed',
        description: 'There was an error running the pricing audit.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Status icon component
  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'match':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'mismatch':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'missing':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Service Pricing Audit</h2>
        <Button 
          onClick={runAudit} 
          disabled={isLoading}
          className="bg-peacefulBlue hover:bg-peacefulBlue/90"
        >
          {isLoading ? 'Running Audit...' : 'Run Audit'}
        </Button>
      </div>
      
      {error && (
        <div className="p-4 border border-red-300 bg-red-50 rounded-md text-red-800">
          {error}
        </div>
      )}
      
      {auditReport && (
        <div className="space-y-6">
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-gray-50 rounded-md">
                <div className="text-sm text-gray-500">Total Services</div>
                <div className="text-2xl font-semibold">{auditReport.summary.totalServices}</div>
              </div>
              <div className="p-3 bg-green-50 rounded-md">
                <div className="text-sm text-green-600">Matching</div>
                <div className="text-2xl font-semibold">{auditReport.summary.matchingPrices}</div>
              </div>
              <div className="p-3 bg-red-50 rounded-md">
                <div className="text-sm text-red-600">Mismatched</div>
                <div className="text-2xl font-semibold">{auditReport.summary.mismatchedPrices}</div>
              </div>
              <div className="p-3 bg-amber-50 rounded-md">
                <div className="text-sm text-amber-600">Missing</div>
                <div className="text-2xl font-semibold">{auditReport.summary.missingPrices}</div>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Audit completed: {new Date(auditReport.timestamp).toLocaleString()}
            </div>
          </Card>
          
          {/* Services Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Individual Services</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DB Service ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Price</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Effective Price</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issues</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {auditReport.services.map((service: any) => (
                    <tr key={service.serviceId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <StatusIcon status={service.status} />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{service.serviceId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.serviceName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.dbServiceId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {service.expectedPrice !== null ? `₹${service.expectedPrice}` : 'Not set'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {service.effectivePrice !== null ? `₹${service.effectivePrice}` : 'Not set'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                        {service.issues.join(', ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Packages Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Packages</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DB Package ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Price</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Effective Price</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issues</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {auditReport.packages.map((pkg: any) => (
                    <tr key={pkg.serviceId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <StatusIcon status={pkg.status} />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pkg.serviceId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pkg.serviceName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pkg.dbServiceId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {pkg.expectedPrice !== null ? `₹${pkg.expectedPrice}` : 'Not set'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {pkg.effectivePrice !== null ? `₹${pkg.effectivePrice}` : 'Not set'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                        {pkg.issues.join(', ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-md text-sm">
            <p className="font-medium mb-2">Notes:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>This audit compares prices directly from the Supabase database with those used by the application.</li>
              <li>Some services may use fallback pricing when database entries are missing.</li>
              <li>Test services (like 'test-service') can use hardcoded values (₹11) for development purposes.</li>
              <li>All values shown are read-only and do not modify any data.</li>
            </ul>
          </div>
        </div>
      )}
      
      {!auditReport && !isLoading && !error && (
        <Card className="p-6 text-center text-gray-500">
          <Info className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p>Click 'Run Audit' to check pricing configuration.</p>
          <p className="text-sm mt-2">This will not modify any data or make payment requests.</p>
        </Card>
      )}
    </div>
  );
};

export default PricingAudit;
