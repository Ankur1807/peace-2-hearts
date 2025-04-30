
import React, { useState } from 'react';
import { runFullSimulation } from '@/utils/testing/simulateBooking';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const TestSimulation = () => {
  const [logs, setLogs] = useState<string[]>([]);
  
  const runSimulation = () => {
    setLogs([]);
    
    // Capture console.log output
    const originalLog = console.log;
    console.log = (...args) => {
      originalLog(...args);
      setLogs(prev => [...prev, args.join(' ')]);
    };
    
    // Run the simulation
    runFullSimulation();
    
    // Restore original console.log
    console.log = originalLog;
  };
  
  return (
    <div className="container py-10 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">🧪 Booking System Integrity Check</h1>
      
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Test Case: Mental Health → "Test Service"</h2>
        <dl className="grid grid-cols-2 gap-2 mb-4">
          <dt className="font-medium text-gray-600">Date:</dt>
          <dd>May 6, 2025</dd>
          
          <dt className="font-medium text-gray-600">Time:</dt>
          <dd>11:00 AM</dd>
          
          <dt className="font-medium text-gray-600">User:</dt>
          <dd>Ankur Bhardwaj</dd>
          
          <dt className="font-medium text-gray-600">Email:</dt>
          <dd>bhardwajankur6@gmail.com</dd>
          
          <dt className="font-medium text-gray-600">Phone:</dt>
          <dd>7428564364</dd>
          
          <dt className="font-medium text-gray-600">Reference ID:</dt>
          <dd>P2H-TEST-SIM-0001</dd>
        </dl>
        
        <Button 
          onClick={runSimulation} 
          variant="default" 
          className="w-full"
        >
          Run Full System Simulation
        </Button>
      </Card>
      
      {logs.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Simulation Results:</h2>
          <ScrollArea className="h-[400px] w-full border rounded-md bg-gray-50 p-4">
            <pre className="text-sm font-mono whitespace-pre-wrap break-words">
              {logs.map((log, index) => (
                <div key={index} className="py-1">
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

export default TestSimulation;
