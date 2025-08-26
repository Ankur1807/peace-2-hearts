import React, { useState } from 'react';
import { runEndToEndBookingTest, EndToEndBookingTest as TestSuite } from '@/utils/testing/endToEndBookingTest';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, RefreshCw, Play, AlertTriangle, Info } from 'lucide-react';

interface TestResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

const EndToEndBookingTestPage = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<{ [key: string]: TestResult } | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [testData, setTestData] = useState<any>(null);

  const runTests = async () => {
    setIsRunning(true);
    setTestResults(null);
    setLogs([]);
    setTestData(null);

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
      const testSuite = new TestSuite();
      setTestData(testSuite.getTestData());
      const results = await testSuite.runCompleteTestSuite();
      setTestResults(results);
    } catch (error) {
      console.error('Unhandled test error:', error);
      setTestResults({
        error: {
          success: false,
          message: 'Test suite failed with exception',
          error: error instanceof Error ? error.message : String(error)
        }
      });
    }

    // Restore original console functions
    console.log = originalLog;
    console.error = originalError;
    console.warn = originalWarn;

    setIsRunning(false);
  };

  const getTestDescription = (testKey: string): string => {
    const descriptions: { [key: string]: string } = {
      schema: 'Verify database schema compatibility with webhook expectations',
      payment_status: 'Test payment-status endpoint functionality',
      webhook_processing: 'Simulate webhook payment processing logic',
      email_trigger: 'Test booking confirmation email trigger logic',
      backward_compatibility: 'Verify old verify-payment API still works',
      failed_payment: 'Test failed payment handling (no emails sent)',
      cleanup: 'Clean up test data from database'
    };
    return descriptions[testKey] || 'Unknown test';
  };

  const getTestIcon = (result: TestResult) => {
    if (result.success) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    } else {
      return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getPassedCount = () => {
    if (!testResults) return 0;
    return Object.values(testResults).filter(r => r.success).length;
  };

  const getTotalCount = () => {
    if (!testResults) return 0;
    return Object.keys(testResults).length;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">End-to-End Booking Test Suite</h1>
        
        {/* Test Control Panel */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Comprehensive Booking System Test
            </CardTitle>
            <CardDescription>
              This test suite validates the entire booking flow after the webhook hotfix: 
              schema compatibility, payment processing, consultation creation, email triggers, and backward compatibility.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={runTests}
              disabled={isRunning}
              className="w-full"
              size="lg"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Running Complete Test Suite...
                </>
              ) : (
                'Run End-to-End Tests'
              )}
            </Button>

            {/* Test Data Display */}
            {testData && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Test Data Generated</AlertTitle>
                <AlertDescription>
                  <div className="mt-2 text-sm font-mono">
                    <div>Payment ID: {testData.paymentId}</div>
                    <div>Order ID: {testData.orderId}</div>
                    <div>Amount: ₹{testData.amount}</div>
                    <div>Test Email: {testData.email}</div>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Test Results Summary */}
        {testResults && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Test Results Summary
                <Badge variant={getPassedCount() === getTotalCount() ? "default" : "destructive"}>
                  {getPassedCount()}/{getTotalCount()} Passed
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {Object.entries(testResults).map(([testKey, result]) => (
                  <div 
                    key={testKey}
                    className={`p-4 rounded-lg border ${
                      result.success 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getTestIcon(result)}
                        <div>
                          <h3 className="font-medium capitalize">
                            {testKey.replace('_', ' ')} Test
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {getTestDescription(testKey)}
                          </p>
                        </div>
                      </div>
                      <Badge variant={result.success ? "default" : "destructive"}>
                        {result.success ? "PASS" : "FAIL"}
                      </Badge>
                    </div>
                    
                    <div className="mt-2">
                      <p className={`text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                        {result.message}
                      </p>
                      
                      {result.error && (
                        <p className="text-sm text-red-600 mt-1 font-mono">
                          Error: {result.error}
                        </p>
                      )}
                      
                      {result.data && (
                        <details className="mt-2">
                          <summary className="text-sm cursor-pointer text-blue-600 hover:text-blue-800">
                            View Test Data
                          </summary>
                          <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Logs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Detailed Test Logs</CardTitle>
            <Button 
              onClick={() => setLogs([])}
              variant="outline"
              size="sm"
            >
              Clear Logs
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96 w-full rounded-md border p-4">
              {logs.length === 0 ? (
                <p className="text-muted-foreground">No logs yet. Run the test suite to see detailed logs.</p>
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
                        log.startsWith('📧') || log.startsWith('📊') || log.startsWith('📋') ? 'text-purple-600' :
                        log.startsWith('🧹') ? 'text-gray-600' :
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

        {/* Test Coverage Information */}
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">Test Coverage</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium mb-2 text-blue-800">✅ What We Test</h3>
              <ul className="space-y-1 text-blue-700">
                <li>• Database schema compatibility (payment_id vs rzp_payment_id)</li>
                <li>• Payment record creation and status handling</li>
                <li>• Consultation record creation with correct columns</li>
                <li>• Email trigger logic and duplicate prevention</li>
                <li>• Payment status endpoint functionality</li>
                <li>• Backward compatibility with old API</li>
                <li>• Failed payment handling (no email sent)</li>
              </ul>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-medium mb-2 text-yellow-800">⚠️ What We Can't Test</h3>
              <ul className="space-y-1 text-yellow-700">
                <li>• Real Razorpay webhook signature validation</li>
                <li>• Actual email sending (requires RESEND_API_KEY)</li>
                <li>• Real payment processing with Razorpay</li>
                <li>• Frontend booking form integration</li>
                <li>• Thank-you page rendering with real data</li>
              </ul>
            </div>
          </div>
          
          {testResults && getPassedCount() === getTotalCount() && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>All Tests Passed!</AlertTitle>
              <AlertDescription>
                The webhook hotfix is working correctly. The system can now:
                <ul className="mt-2 space-y-1">
                  <li>• Create payment records in the payments table</li>
                  <li>• Create/update consultation records using payment_id and order_id</li>
                  <li>• Trigger booking confirmation emails exactly once</li>
                  <li>• Handle failed payments without sending emails</li>
                  <li>• Maintain backward compatibility with existing frontend code</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default EndToEndBookingTestPage;