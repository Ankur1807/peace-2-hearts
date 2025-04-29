
import React from 'react';
import PaymentMigrationPanel from '@/components/admin/PaymentMigrationPanel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AdminPaymentMigration: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Payment System Migration</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Migration Overview</CardTitle>
            <CardDescription>
              This tool helps safely migrate from the legacy payments table to the consolidated consultations table
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              The payment system has been consolidated to store all payment information directly in the consultations table.
              This migration tool will help you verify that all data has been properly migrated and then safely remove the legacy
              payments table when ready.
            </p>
            
            <div className="mt-4">
              <h3 className="font-medium text-lg">Migration Benefits:</h3>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
                <li>Simplified data model with payment information directly in consultations</li>
                <li>Reduced complexity in payment processing and verification</li>
                <li>Improved performance by eliminating joins between tables</li>
                <li>More reliable email notifications and payment recovery processes</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        
        <PaymentMigrationPanel />
        
        <Card>
          <CardHeader>
            <CardTitle>Technical Documentation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              The payment system now uses the following fields in the consultations table:
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Field</th>
                    <th className="text-left py-2 px-4">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 px-4 font-mono text-sm">payment_id</td>
                    <td className="py-2 px-4">Razorpay payment ID (e.g., pay_123456789)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4 font-mono text-sm">order_id</td>
                    <td className="py-2 px-4">Razorpay order ID (e.g., order_123456789)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4 font-mono text-sm">amount</td>
                    <td className="py-2 px-4">Payment amount in INR</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4 font-mono text-sm">payment_status</td>
                    <td className="py-2 px-4">Status of payment (completed, pending, failed)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4 font-mono text-sm">reference_id</td>
                    <td className="py-2 px-4">Unique reference ID for the consultation booking</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPaymentMigration;
