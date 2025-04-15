
import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, DollarSign, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    consultantCount: 0,
    bookingCount: 0,
    totalRevenue: 0,
    pendingBookings: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        
        // Get consultant count
        const { count: consultantCount, error: consultantError } = await supabase
          .from('consultants')
          .select('*', { count: 'exact', head: true });
        
        if (consultantError) throw consultantError;
        
        // Get booking count
        const { count: bookingCount, error: bookingError } = await supabase
          .from('consultations')
          .select('*', { count: 'exact', head: true });
          
        if (bookingError) throw bookingError;
        
        // Get pending bookings
        const { count: pendingCount, error: pendingError } = await supabase
          .from('consultations')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'scheduled');
          
        if (pendingError) throw pendingError;
        
        // Get total revenue (this is a simplified calculation)
        const { data: payments, error: paymentsError } = await supabase
          .from('payments')
          .select('amount')
          .eq('payment_status', 'completed');
          
        if (paymentsError) throw paymentsError;
        
        const totalRevenue = payments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;
        
        setStats({
          consultantCount: consultantCount || 0,
          bookingCount: bookingCount || 0,
          totalRevenue,
          pendingBookings: pendingCount || 0
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon, isLoading }: { title: string, value: number | string, icon: React.ReactNode, isLoading: boolean }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isLoading ? (
            <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            value
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AdminLayout title="Dashboard" description="Overview of Peace2Hearts platform stats and activities">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Consultants" 
          value={stats.consultantCount} 
          icon={<Users className="h-4 w-4 text-muted-foreground" />} 
          isLoading={isLoading}
        />
        <StatCard 
          title="Total Bookings" 
          value={stats.bookingCount} 
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />} 
          isLoading={isLoading}
        />
        <StatCard 
          title="Total Revenue" 
          value={`₹${stats.totalRevenue.toLocaleString()}`} 
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />} 
          isLoading={isLoading}
        />
        <StatCard 
          title="Pending Bookings" 
          value={stats.pendingBookings} 
          icon={<Clock className="h-4 w-4 text-muted-foreground" />} 
          isLoading={isLoading}
        />
      </div>
      
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Welcome to the Admin Portal</h2>
        <p className="text-gray-600">
          From here you can manage all aspects of the Peace2Hearts platform including consultants, 
          pricing, and bookings. Use the navigation menu on the left to access different sections.
        </p>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
