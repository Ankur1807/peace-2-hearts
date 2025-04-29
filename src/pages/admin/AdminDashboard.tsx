
import React from 'react';
import { Card } from '@/components/ui/card';

const AdminDashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-2">Total Bookings</h3>
          <p className="text-3xl font-bold">28</p>
          <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
        </Card>
        <Card className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold">₹54,200</p>
          <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
        </Card>
        <Card className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-2">Active Consultants</h3>
          <p className="text-3xl font-bold">12</p>
          <p className="text-sm text-gray-500 mt-1">Currently available</p>
        </Card>
      </div>
      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Recent Bookings</h3>
        <p className="text-gray-500">No recent bookings to display.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
