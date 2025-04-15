
import { SEO } from '@/components/SEO';
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBookings } from "@/hooks/useBookings";
import { BookingsFilter } from "@/components/admin/BookingsFilter";
import { BookingsTable } from "@/components/admin/BookingsTable";

const AdminBookings = () => {
  const { bookings, loading, updateBookingStatus } = useBookings();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const getFilteredBookings = () => {
    return bookings.filter(booking => {
      const statusMatch = statusFilter === "all" ? true : booking.status === statusFilter;
      
      const searchLower = searchQuery.toLowerCase();
      const searchMatch = searchQuery
        ? booking.client_name?.toLowerCase().includes(searchLower) ||
          booking.client_email?.toLowerCase().includes(searchLower) ||
          booking.reference_id?.toLowerCase().includes(searchLower)
        : true;
      
      return statusMatch && searchMatch;
    });
  };

  const filteredBookings = getFilteredBookings();

  return (
    <>
      <SEO
        title="Booking History - Peace2Hearts Admin"
        description="View and manage booking history for Peace2Hearts platform"
      />
      
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Booking History</h1>
        
        <Card className="overflow-hidden">
          <CardHeader className="bg-gray-50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>All Bookings</CardTitle>
              
              <BookingsFilter 
                statusFilter={statusFilter}
                searchQuery={searchQuery}
                onStatusChange={setStatusFilter}
                onSearchChange={setSearchQuery}
              />
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-peacefulBlue"></div>
              </div>
            ) : (
              <BookingsTable 
                bookings={filteredBookings} 
                onStatusChange={updateBookingStatus} 
              />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AdminBookings;
