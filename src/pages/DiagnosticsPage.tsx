
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SEO } from '@/components/SEO';
import { runSystemDiagnostics } from '@/utils/diagnostics/systemHealthCheck';
import { fetchServicePricing, fetchPackagePricing } from '@/utils/pricing/fetchPricing';

const DiagnosticsPage: React.FC = () => {
  const [pricing, setPricing] = useState<Map<string, number>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosticsRun, setDiagnosticsRun] = useState(false);

  // Test services to run diagnostics with
  const testServices = [
    'mental-health-counselling', 
    'divorce',
    'divorce-prevention'
  ];
  
  useEffect(() => {
    // Auto-run diagnostics on mount
    runDiagnostics();
  }, []);

  const loadPricing = async () => {
    setIsLoading(true);
    try {
      // Fetch both service and package pricing
      const [servicePricing, packagePricing] = await Promise.all([
        fetchServicePricing([], true),
        fetchPackagePricing(['divorce-prevention', 'pre-marriage-clarity'], true)
      ]);
      
      // Combine into a single pricing map
      const combinedPricing = new Map([
        ...servicePricing,
        ...packagePricing
      ]);
      
      setPricing(combinedPricing);
      return combinedPricing;
    } catch (err) {
      console.error('Error loading pricing:', err);
      return new Map();
    } finally {
      setIsLoading(false);
    }
  };

  const runDiagnostics = async () => {
    setDiagnosticsRun(false);
    
    // Load fresh pricing data
    const pricingData = await loadPricing();
    console.log('Loaded pricing data for diagnostics:', Object.fromEntries(pricingData));
    
    // Run the diagnostics
    runSystemDiagnostics(
      pricingData,
      testServices,
      2500 // Sample total price
    );
    
    setDiagnosticsRun(true);
  };

  return (
    <>
      <SEO 
        title="System Diagnostics"
        description="System health diagnostics for Peace2Hearts"
      />
      <Navigation />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-6">System Diagnostics</h1>
        
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Pricing & Service Diagnostic</h2>
          <p className="mb-4 text-gray-600">
            Run diagnostics to check pricing consistency, service ID mapping, booking flow health, 
            payment integration, routing, and component sanity.
          </p>
          
          <div className="flex items-center gap-4">
            <Button 
              onClick={runDiagnostics}
              disabled={isLoading}
            >
              {isLoading ? 'Running...' : 'Run Diagnostics'}
            </Button>
            
            {diagnosticsRun && (
              <p className="text-green-600">
                Diagnostics complete! Check the console for detailed results.
              </p>
            )}
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">How to Use</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Click "Run Diagnostics" to start the checks</li>
            <li>Open your browser's developer console (F12 or Cmd+Option+I)</li>
            <li>Check the console logs for detailed results of each diagnostic</li>
            <li>Look for ⚠️ warning indicators that highlight potential issues</li>
          </ol>
        </Card>
      </main>
      <Footer />
    </>
  );
};

export default DiagnosticsPage;
