
import React from 'react';

const AdminBookings: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Bookings Management</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <p className="text-gray-500">No bookings data available.</p>
      </div>
    </div>
  );
};

export default AdminBookings;
