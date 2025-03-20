
import { Skeleton } from "@/components/ui/skeleton";

const ConsultantLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="container mx-auto px-4">
        <Skeleton className="h-12 w-64 mb-8 mx-auto" />
        
        <div className="space-y-4 max-w-5xl mx-auto">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-10 w-36" />
          </div>
          
          <div className="border rounded-lg p-6">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between">
                  <Skeleton className="h-10 w-1/4" />
                  <Skeleton className="h-10 w-1/5" />
                  <Skeleton className="h-10 w-1/6" />
                  <Skeleton className="h-10 w-1/4" />
                  <Skeleton className="h-10 w-1/6" />
                  <Skeleton className="h-6 w-10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultantLoader;
