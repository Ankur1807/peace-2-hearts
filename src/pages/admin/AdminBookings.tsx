
import React, { useState } from 'react';
import { BookingsTable } from '@/components/admin/BookingsTable';
import { BookingsFilter } from '@/components/admin/BookingsFilter';
import { useBookings } from '@/hooks/useBookings';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'react-hot-toast';

const AdminBookings: React.FC = () => {
  const { bookings, loading, updateBookingStatus, fetchBookings, resendConfirmationEmail } = useBookings();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const filteredBookings = bookings.filter(booking => {
    // Status filtering
    if (statusFilter !== 'all' && booking.status !== statusFilter) {
      return false;
    }
    
    // Search filtering (case insensitive)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        (booking.client_name && booking.client_name.toLowerCase().includes(query)) ||
        (booking.client_email && booking.client_email.toLowerCase().includes(query)) ||
        (booking.reference_id && booking.reference_id.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  // Handle manual refresh of bookings
  const handleRefresh = () => {
    fetchBookings();
    toast.success("Bookings refreshed");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Bookings Management</h1>
        
        <button 
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Refresh Bookings
        </button>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <BookingsFilter 
            statusFilter={statusFilter}
            searchQuery={searchQuery}
            onStatusChange={setStatusFilter}
            onSearchChange={setSearchQuery}
          />
          
          {loading ? (
            <div className="mt-4 space-y-4">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="w-full h-16" />
              ))}
            </div>
          ) : (
            <div className="mt-4">
              <BookingsTable 
                bookings={filteredBookings} 
                onStatusChange={updateBookingStatus}
                onResendEmail={resendConfirmationEmail}
              />
              
              <div className="text-sm text-muted-foreground mt-4">
                Showing {filteredBookings.length} of {bookings.length} bookings
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBookings;
