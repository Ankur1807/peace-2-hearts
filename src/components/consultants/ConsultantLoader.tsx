
import { Skeleton } from "@/components/ui/skeleton";

const ConsultantLoader = () => {
  return (
    <div className="w-full">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-8">
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-6 w-96 max-w-full" />
        </div>
        
        <div className="space-y-4 max-w-5xl mx-auto">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-10 w-36" />
          </div>
          
          <div className="border rounded-lg p-6 bg-white shadow-sm">
            <div className="space-y-6">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex flex-col md:flex-row md:items-center justify-between p-4 border-b last:border-b-0 gap-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-[180px]" />
                      <Skeleton className="h-4 w-[140px]" />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 md:gap-4">
                    <Skeleton className="h-9 w-[120px]" />
                    <Skeleton className="h-9 w-[120px]" />
                  </div>
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
