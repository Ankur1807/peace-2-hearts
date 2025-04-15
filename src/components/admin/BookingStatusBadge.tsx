
import { Badge } from "@/components/ui/badge";

interface BookingStatusBadgeProps {
  status: string;
}

export const BookingStatusBadge = ({ status }: BookingStatusBadgeProps) => {
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return "bg-blue-100 text-blue-800";
      case 'completed':
        return "bg-green-100 text-green-800";
      case 'cancelled':
        return "bg-red-100 text-red-800";
      case 'pending':
        return "bg-yellow-100 text-yellow-800";
      case 'confirmed':
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Badge className={getStatusBadgeColor(status)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};
