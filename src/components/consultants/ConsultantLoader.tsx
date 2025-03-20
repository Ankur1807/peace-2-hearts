
import { Skeleton } from "@/components/ui/skeleton";

const ConsultantLoader = () => {
  return (
    <div className="w-full">
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
                <div key={index} className="flex items-center justify-between p-2 flex-wrap gap-2">
                  <Skeleton className="h-10 w-[120px]" />
                  <Skeleton className="h-10 w-[120px]" />
                  <Skeleton className="h-10 w-[120px]" />
                  <Skeleton className="h-10 w-[120px]" />
                  <Skeleton className="h-10 w-[60px]" />
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
