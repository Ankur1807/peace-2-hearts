
import React, { useState } from 'react';
import { testVerifyPaymentEdgeFunction } from '@/utils/testing/manualPaymentTest';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Toaster } from '@/components/ui/toaster';

const ManualPaymentTest = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  
  const runTest = async () => {
    setLogs([]);
    setIsRunning(true);
    
    // Capture console.log output
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
    
    // Run the test
    try {
      await testVerifyPaymentEdgeFunction();
    } catch (error) {
      console.error('Unhandled test error:', error);
    }
    
    // Restore original console functions
    console.log = originalLog;
    console.error = originalError;
    console.warn = originalWarn;
    
    setIsRunning(false);
  };
  
  return (
    <div className="container py-10 max-w-3xl">
      <Toaster />
      <h1 className="text-3xl font-bold mb-6">🧪 Manual Edge Function Test</h1>
      
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Payment Edge Function Integration Test</h2>
        <p className="text-gray-600 mb-4">
          This test will directly call the verify-payment edge function with test data and verify:
        </p>
        <ul className="list-disc list-inside mb-4 text-gray-600">
          <li>Payment verification functionality</li>
          <li>Consultation record creation in database</li>
          <li>Correct source attribution ("edge")</li>
          <li>Email sending confirmation</li>
          <li>Date/time handling</li>
        </ul>
        
        <Button 
          onClick={runTest} 
          variant="default" 
          className="w-full"
          disabled={isRunning}
        >
          {isRunning ? "Running Test..." : "Run Edge Function Test"}
        </Button>
      </Card>
      
      {logs.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Test Results:</h2>
          <ScrollArea className="h-[400px] w-full border rounded-md bg-gray-50 p-4">
            <pre className="text-sm font-mono whitespace-pre-wrap break-words">
              {logs.map((log, index) => (
                <div 
                  key={index} 
                  className={`py-1 ${
                    log.includes('ERROR:') 
                      ? 'text-red-600' 
                      : log.includes('WARNING:') 
                        ? 'text-amber-600' 
                        : log.includes('✅') 
                          ? 'text-green-600' 
                          : ''
                  }`}
                >
                  {log}
                </div>
              ))}
            </pre>
          </ScrollArea>
        </Card>
      )}
    </div>
  );
};

export default ManualPaymentTest;
