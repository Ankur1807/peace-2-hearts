
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface SubService {
  id: string;
  title: string;
  description: string;
  path: string;
}

interface SubServicesListProps {
  subServices: SubService[];
}

const SubServicesList = ({ subServices }: SubServicesListProps) => {
  return (
    <div className="mt-8 space-y-4">
      <h3 className="text-xl font-lora font-semibold text-gray-800 mb-4">Our Offerings</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {subServices.map((service) => (
          <Link 
            key={service.id}
            to={service.path}
            className="block p-4 border rounded-lg hover:border-peacefulBlue hover:bg-peacefulBlue/5 transition-colors"
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-gray-800">{service.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{service.description}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-peacefulBlue" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SubServicesList;
