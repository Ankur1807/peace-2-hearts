
import React from "react";
import AdminAuth from "@/components/consultants/AdminAuth";

interface AuthWrapperProps {
  isAuthenticated: boolean;
  onAuthenticated: () => void;
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ 
  isAuthenticated, 
  onAuthenticated, 
  children 
}) => {
  if (!isAuthenticated) {
    return (
      <div className="p-4">
        <AdminAuth onAuthenticated={onAuthenticated} />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthWrapper;
