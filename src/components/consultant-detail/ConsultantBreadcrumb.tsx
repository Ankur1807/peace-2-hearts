
import { Link } from "react-router-dom";

interface ConsultantBreadcrumbProps {
  consultantName: string | null;
}

export function ConsultantBreadcrumb({ consultantName }: ConsultantBreadcrumbProps) {
  return (
    <div className="text-sm breadcrumbs mb-6">
      <ul className="flex items-center space-x-2">
        <li><Link to="/" className="text-gray-500 hover:text-primary">Home</Link></li>
        <li className="text-gray-500">/</li>
        <li><Link to="/consultants" className="text-gray-500 hover:text-primary">Consultants</Link></li>
        <li className="text-gray-500">/</li>
        <li className="text-primary">{consultantName || "Consultant Profile"}</li>
      </ul>
    </div>
  );
}
