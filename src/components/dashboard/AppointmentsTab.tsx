
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AppointmentCard from "./AppointmentCard";

interface AppointmentsTabProps {
  appointments: Array<{
    id: string;
    date: Date;
    service: string;
    specialist: string;
    status: "upcoming" | "completed" | "cancelled";
  }>;
}

const AppointmentsTab = ({ appointments }: AppointmentsTabProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Appointments</h2>
        <Button 
          className="bg-peacefulBlue hover:bg-peacefulBlue/90" 
          onClick={() => navigate("/book-consultation")}
        >
          Book New Consultation
        </Button>
      </div>

      {appointments.length > 0 ? (
        <div className="grid gap-4">
          {appointments
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500 mb-4">You don't have any appointments yet.</p>
            <Button 
              className="bg-peacefulBlue hover:bg-peacefulBlue/90" 
              onClick={() => navigate("/book-consultation")}
            >
              Book Your First Consultation
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AppointmentsTab;
