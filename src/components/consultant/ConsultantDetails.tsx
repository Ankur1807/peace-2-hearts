
import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConsultantProfile } from "@/types/ConsultantTypes";
import { formatSpecialization } from "./ConsultantProfileTemplate";

interface ConsultantDetailsProps {
  consultant: ConsultantProfile;
}

const ConsultantDetails: React.FC<ConsultantDetailsProps> = ({ consultant }) => {
  return (
    <div className="md:col-span-2">
      <h2 className="text-2xl font-semibold mb-4">About</h2>
      <div className="prose max-w-none mb-8">
        <p>{consultant.bio}</p>
      </div>
      
      <h2 className="text-2xl font-semibold mb-4">Services Offered</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {consultant.specialization === 'mental-health' ? (
          <>
            <Card className="p-4 bg-purple-50">Mental Health Counselling</Card>
            <Card className="p-4 bg-purple-50">Family Therapy</Card>
            <Card className="p-4 bg-purple-50">Couples Counselling</Card>
            <Card className="p-4 bg-purple-50">Premarital Counselling</Card>
          </>
        ) : (
          <>
            <Card className="p-4 bg-purple-50">Divorce Consultation</Card>
            <Card className="p-4 bg-purple-50">Child Custody Advice</Card>
            <Card className="p-4 bg-purple-50">Legal Documentation</Card>
            <Card className="p-4 bg-purple-50">Mediation Services</Card>
          </>
        )}
      </div>
      
      {!consultant.is_available && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-md mb-8">
          <p className="text-amber-800">
            This consultant is currently not accepting new appointments.
          </p>
        </div>
      )}
      
      <Link to={`/book-consultation?consultant=${consultant.id}`}>
        <Button size="lg" disabled={!consultant.is_available}>
          {consultant.is_available ? "Book a Consultation" : "Currently Unavailable"}
        </Button>
      </Link>
    </div>
  );
};

export default ConsultantDetails;
