import React, { useState } from 'react';
import { quickWebhookTest } from '@/utils/testing/quickWebhookTest';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, RefreshCw, Play } from 'lucide-react';

const QuickWebhookTest = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const runTest = async () => {
    setIsRunning(true);
    setTestResult(null);
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
      const result = await quickWebhookTest();
      setTestResult(result);
    } catch (error) {
      console.error('Unhandled test error:', error);
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : String(error)
      });
    }

    // Restore original console functions
    console.log = originalLog;
    console.error = originalError;
    console.warn = originalWarn;

    setIsRunning(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Quick Webhook Hotfix Test</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Webhook Schema Compatibility Test
            </CardTitle>
            <CardDescription>
              This test verifies that the webhook hotfix correctly uses payment_id and order_id columns 
              in the consultations table instead of the incorrect rzp_payment_id and rzp_order_id.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={runTest}
              disabled={isRunning}
              className="w-full mb-4"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Running Test...
                </>
              ) : (
                'Run Quick Test'
              )}
            </Button>

            {testResult && (
              <Alert variant={testResult.success ? "default" : "destructive"}>
                {testResult.success ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                <AlertTitle>
                  {testResult.success ? 'Test Passed!' : 'Test Failed'}
                </AlertTitle>
                <AlertDescription>
                  {testResult.success ? testResult.message : testResult.error}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96 w-full rounded-md border p-4">
              {logs.length === 0 ? (
                <p className="text-muted-foreground">No logs yet. Run the test to see results.</p>
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
                        log.startsWith('🧪') || log.startsWith('🚀') || log.startsWith('🎉') ? 'text-blue-600 font-semibold' :
                        log.startsWith('📋') || log.startsWith('📊') ? 'text-purple-600' :
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
          <h2 className="text-xl font-semibold">What This Test Verifies</h2>
          <div className="grid gap-4 text-sm">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">Schema Compatibility</h3>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Consultation table accepts payment_id and order_id columns</li>
                <li>• Records can be created with the correct column names</li>
                <li>• Records can be found by payment_id for webhook processing</li>
                <li>• Records can be found by order_id for order-based lookups</li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium mb-2 text-green-800">Hotfix Validation</h3>
              <ul className="space-y-1 text-green-700">
                <li>• Confirms webhook code will work with existing database schema</li>
                <li>• Validates that consultations will be created/updated correctly</li>
                <li>• Ensures email triggers will have required consultation records</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickWebhookTest;