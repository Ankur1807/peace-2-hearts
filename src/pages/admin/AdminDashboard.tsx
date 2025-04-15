
import { SEO } from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Users, Calendar, CreditCard } from 'lucide-react';

const AdminDashboard = () => {
  // In a real implementation, these would be fetched from an API
  const stats = [
    { 
      title: "Total Consultants", 
      value: "24", 
      icon: <Users className="h-8 w-8 text-peacefulBlue" />,
      change: "+2 this month"
    },
    { 
      title: "Active Bookings", 
      value: "156", 
      icon: <Calendar className="h-8 w-8 text-green-600" />,
      change: "+23% from last month"
    },
    { 
      title: "Revenue", 
      value: "₹284,500", 
      icon: <CreditCard className="h-8 w-8 text-purple-600" />,
      change: "+12% from last month"
    },
  ];

  return (
    <>
      <SEO
        title="Admin Dashboard - Peace2Hearts"
        description="Admin dashboard for Peace2Hearts platform"
      />
      
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {stat.title}
                </CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                <Progress 
                  value={75 - index * 15} 
                  className="mt-3 h-2"
                />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Shows the most recent bookings across the platform. This section will be populated with real data when connected to the database.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Popular Services</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Displays the most popular services based on booking frequency. This section will be populated with real data when connected to the database.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
