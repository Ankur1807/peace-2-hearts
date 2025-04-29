
import { formatDate } from "@/utils/formatUtils";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { Booking } from "@/hooks/useBookings";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, Mail, Check, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BookingsTableProps {
  bookings: Booking[];
  onStatusChange: (bookingId: string, newStatus: string) => void;
  onResendEmail?: (bookingId: string) => Promise<boolean>;
}

export const BookingsTable = ({ bookings, onStatusChange, onResendEmail }: BookingsTableProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reference ID</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Booked On</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">{booking.reference_id || "N/A"}</TableCell>
                <TableCell>
                  <div>
                    <div>{booking.client_name || "Unknown"}</div>
                    <div className="text-sm text-gray-500">{booking.client_email}</div>
                  </div>
                </TableCell>
                <TableCell>{booking.consultation_type}</TableCell>
                <TableCell>{booking.date ? formatDate(new Date(booking.date)) : "N/A"}</TableCell>
                <TableCell>
                  <BookingStatusBadge status={booking.status} />
                </TableCell>
                <TableCell>
                  {booking.email_sent ? (
                    <span className="flex items-center text-green-600">
                      <Check className="h-4 w-4 mr-1" /> Sent
                    </span>
                  ) : (
                    <span className="flex items-center text-red-600">
                      <X className="h-4 w-4 mr-1" /> Not Sent
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div>
                    {booking.payment_id ? (
                      <span className="text-xs text-gray-500">{booking.payment_id.substring(0, 10)}...</span>
                    ) : (
                      "N/A"
                    )}
                    {booking.payment_status && (
                      <div className="text-xs font-medium">
                        {booking.payment_status}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{formatDate(new Date(booking.created_at))}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {onResendEmail && !booking.email_sent && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1"
                        onClick={() => onResendEmail(booking.id)}
                      >
                        <Mail className="h-4 w-4" />
                        <span className="hidden sm:inline">Resend</span>
                      </Button>
                    )}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                          Status <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => onStatusChange(booking.id, "scheduled")}>
                          Scheduled
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onStatusChange(booking.id, "confirmed")}>
                          Confirmed
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onStatusChange(booking.id, "pending")}>
                          Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onStatusChange(booking.id, "completed")}>
                          Completed
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onStatusChange(booking.id, "cancelled")}>
                          Cancelled
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
                No bookings found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
