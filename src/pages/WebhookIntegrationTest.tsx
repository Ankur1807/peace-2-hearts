import React, { useState } from 'react';
import { testWebhookIntegration, testSchemaCompatibility } from '@/utils/testing/webhookIntegrationTest';
import { testVerifyPaymentEdgeFunction } from '@/utils/testing/edgeFunctionTest';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Toaster } from '@/components/ui/toaster';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Play, RefreshCw } from 'lucide-react';

const WebhookIntegrationTest = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runWebhookTests = async () => {
    setIsRunning(true);
    setError(null);
    setLogs([]);

    // Capture console output
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args) => {
      originalLog(...args);
      setLogs(prev => [...prev, args.join(' ')]);
    };

    console.error = (...args) => {
      originalError(...args);
      setLogs(prev => [...prev, `ERROR: ${args.join(' ')}`]);
    };

    console.warn = (...args) => {
      originalWarn(...args);
      setLogs(prev => [...prev, `WARNING: ${args.join(' ')}`]);
    };

    try {
      // First check schema compatibility
      await testSchemaCompatibility();
      
      // Then run the webhook integration tests
      await testWebhookIntegration();
      
    } catch (error) {
      console.error('Unhandled test error:', error);
      setError(error instanceof Error ? error.message : String(error));
    }

    // Restore original console functions
    console.log = originalLog;
    console.error = originalError;
    console.warn = originalWarn;

    setIsRunning(false);
  };

  const runLegacyTests = async () => {
    setIsRunning(true);
    setError(null);
    setLogs([]);

    // Capture console output
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args) => {
      originalLog(...args);
      setLogs(prev => [...prev, args.join(' ')]);
    };

    console.error = (...args) => {
      originalError(...args);
      setLogs(prev => [...prev, `ERROR: ${args.join(' ')}`]);
    };

    console.warn = (...args) => {
      originalWarn(...args);
      setLogs(prev => [...prev, `WARNING: ${args.join(' ')}`]);
    };

    try {
      await testVerifyPaymentEdgeFunction();
    } catch (error) {
      console.error('Unhandled legacy test error:', error);
      setError(error instanceof Error ? error.message : String(error));
    }

    // Restore original console functions
    console.log = originalLog;
    console.error = originalError;
    console.warn = originalWarn;

    setIsRunning(false);
  };

  const clearLogs = () => {
    setLogs([]);
    setError(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Webhook Integration Test Suite</h1>
        
        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                New Webhook Integration Tests
              </CardTitle>
              <CardDescription>
                Test the new webhook-first Razorpay integration including payment-status and reconcile-payment endpoints
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={runWebhookTests}
                disabled={isRunning}
                className="w-full"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Running Tests...
                  </>
                ) : (
                  'Run Webhook Integration Tests'
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Legacy Verification Tests
              </CardTitle>
              <CardDescription>
                Test the legacy verify-payment endpoint for backward compatibility
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={runLegacyTests}
                disabled={isRunning}
                variant="outline"
                className="w-full"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Running Legacy Tests...
                  </>
                ) : (
                  'Run Legacy Verification Tests'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Test Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Test Logs</CardTitle>
            <Button 
              onClick={clearLogs}
              variant="outline"
              size="sm"
            >
              Clear Logs
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96 w-full rounded-md border p-4">
              {logs.length === 0 ? (
                <p className="text-muted-foreground">No logs yet. Run a test to see results.</p>
              ) : (
                <div className="space-y-1">
                  {logs.map((log, index) => (
                    <div 
                      key={index} 
                      className={`text-sm font-mono ${
                        log.startsWith('ERROR:') ? 'text-red-600' :
                        log.startsWith('WARNING:') ? 'text-yellow-600' :
                        log.startsWith('✅') ? 'text-green-600' :
                        log.startsWith('❌') ? 'text-red-600' :
                        log.startsWith('🧪') || log.startsWith('🚀') ? 'text-blue-600 font-semibold' :
                        'text-foreground'
                      }`}
                    >
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">Expected Test Results</h2>
          <div className="grid gap-4 text-sm">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">✅ Expected Successes</h3>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Payment Status: Returns "not_found" for non-existent orders</li>
                <li>• Reconcile Health: Returns service status</li>
                <li>• Manual Verification: Fails gracefully for test orders</li>
                <li>• Database: Remains clean after failed test payments</li>
              </ul>
            </div>
            <div className="p-4 bg-destructive/10 rounded-lg">
              <h3 className="font-medium mb-2 text-destructive">❌ Known Issues to Check</h3>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Schema mismatch: consultations table uses payment_id vs rzp_payment_id</li>
                <li>• Webhook signature validation (can't test without real webhook)</li>
                <li>• Email sending (depends on configuration)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default WebhookIntegrationTest;