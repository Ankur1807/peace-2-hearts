
import { formatDate } from "@/utils/formatUtils";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { Booking } from "@/hooks/useBookings";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BookingsTableProps {
  bookings: Booking[];
  onStatusChange: (bookingId: string, newStatus: string) => void;
}

export const BookingsTable = ({ bookings, onStatusChange }: BookingsTableProps) => {
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
                <TableCell>{formatDate(new Date(booking.created_at))}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        Update Status <ChevronDown className="h-4 w-4" />
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
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No bookings found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
