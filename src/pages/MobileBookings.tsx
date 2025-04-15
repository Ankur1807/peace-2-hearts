import { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useBookings } from '@/hooks/useBookings';
import { useAdmin } from "@/hooks/useAdminContext";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell } from "lucide-react";
import { SEO } from '@/components/SEO';
import { BookingStatusBadge } from '@/components/admin/BookingStatusBadge';
import { formatDate } from '@/utils/formatUtils';
import { Booking } from '@/hooks/useBookings';
import { supabase } from "@/integrations/supabase/client";

const MobileBookings = () => {
  const { bookings, loading } = useBookings();
  const { toast } = useToast();
  const { isAdmin } = useAdmin();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Request browser notification permission only for admin users
  useEffect(() => {
    const requestNotificationPermission = async () => {
      try {
        if (!isAdmin) {
          return; // Don't request permissions for non-admin users
        }

        if ('Notification' in window) {
          const permission = await Notification.requestPermission();
          setNotificationsEnabled(permission === 'granted');
        }
      } catch (error) {
        console.error('Error requesting notification permission:', error);
      }
    };

    requestNotificationPermission();
  }, [isAdmin]);

  // Subscribe to new bookings for admin users only
  useEffect(() => {
    if (!isAdmin) return; // Don't subscribe if not admin

    const channel = supabase
      .channel('booking-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'consultations'
        },
        (payload) => {
          // Show browser notification
          if (notificationsEnabled) {
            new Notification('New Booking!', {
              body: `${payload.new.client_name} has booked a ${payload.new.consultation_type} consultation`,
              icon: '/favicon.ico'
            });
          }

          // Show toast notification
          toast({
            title: 'New Booking!',
            description: `${payload.new.client_name} has booked a ${payload.new.consultation_type} consultation`,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast, notificationsEnabled, isAdmin]);

  return (
    <>
      <SEO 
        title="Bookings - Peace2Hearts"
        description="View and manage your Peace2Hearts bookings"
      />

      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Bookings</h1>
            <div className="flex items-center gap-2">
              <Bell className={notificationsEnabled ? "text-green-500" : "text-gray-400"} />
              <span className="text-sm text-gray-600">
                {notificationsEnabled ? "Notifications enabled" : "Notifications disabled"}
              </span>
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-120px)]">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <p>Loading bookings...</p>
              </div>
            ) : bookings.length === 0 ? (
              <Card className="p-6 text-center text-gray-500">
                No bookings found
              </Card>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking: Booking) => (
                  <Card key={booking.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{booking.client_name}</h3>
                      <BookingStatusBadge status={booking.status} />
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      {booking.consultation_type}
                    </p>
                    <div className="text-sm text-gray-500">
                      {booking.date ? formatDate(new Date(booking.date)) : 'Date TBD'}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </>
  );
};

export default MobileBookings;
