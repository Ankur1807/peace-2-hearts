
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const ConsultantSkeleton: React.FC = () => {
  return (
    <>
      <Navigation />
      <main className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <Skeleton className="h-64 w-full rounded-lg" />
              <Skeleton className="h-8 w-3/4 mt-4" />
              <Skeleton className="h-6 w-1/2 mt-2" />
              <Skeleton className="h-6 w-2/3 mt-2" />
            </div>
            <div className="md:col-span-2">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-full mt-4" />
              <Skeleton className="h-6 w-full mt-2" />
              <Skeleton className="h-6 w-full mt-2" />
              <Skeleton className="h-10 w-40 mt-6" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ConsultantSkeleton;
