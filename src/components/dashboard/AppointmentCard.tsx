
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, Clock } from "lucide-react";

interface AppointmentProps {
  appointment: {
    id: string;
    date: Date;
    service: string;
    specialist: string;
    status: "upcoming" | "completed" | "cancelled";
  };
}

const AppointmentCard = ({ appointment }: AppointmentProps) => {
  return (
    <Card key={appointment.id}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-gray-500" />
              <span className="font-medium">{format(appointment.date, "MMMM d, yyyy")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-500" />
              <span>{format(appointment.date, "h:mm a")}</span>
            </div>
            <h3 className="text-lg font-semibold">{appointment.service}</h3>
            <p className="text-gray-600">with {appointment.specialist}</p>
          </div>
          <div className="flex flex-col items-end gap-2 mt-4 md:mt-0">
            <span className={`px-3 py-1 rounded-full text-sm ${
              appointment.status === "upcoming" 
                ? "bg-blue-100 text-blue-800" 
                : appointment.status === "completed" 
                ? "bg-green-100 text-green-800" 
                : "bg-gray-100 text-gray-800"
            }`}>
              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
            </span>
            {appointment.status === "upcoming" && (
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm">Reschedule</Button>
                <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">Cancel</Button>
              </div>
            )}
            {appointment.status === "completed" && (
              <Button variant="outline" size="sm" className="mt-2">Leave Feedback</Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;
