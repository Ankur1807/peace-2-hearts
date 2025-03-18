
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const ConsultantNotFound: React.FC = () => {
  return (
    <>
      <Navigation />
      <main className="py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-semibold mb-4">Consultant Not Found</h1>
          <p>The consultant profile you're looking for could not be found or is not available.</p>
          <Link to="/book-consultation">
            <Button className="mt-8">View Available Consultants</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ConsultantNotFound;
