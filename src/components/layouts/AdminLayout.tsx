
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-peacefulBlue text-white shadow-md">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Peace2Hearts Admin</h1>
          <nav>
            <Button variant="ghost" className="text-white hover:text-white hover:bg-peacefulBlue/90" asChild>
              <Link to="/">Back to Site</Link>
            </Button>
          </nav>
        </div>
      </header>
      
      <div className="flex-1 bg-gray-50">
        {children}
      </div>
      
      <footer className="bg-gray-100 border-t">
        <div className="container mx-auto py-4 px-4 text-center text-sm text-gray-600">
          Peace2Hearts Admin Portal &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default AdminLayout;
