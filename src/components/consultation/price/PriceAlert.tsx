
import React from 'react';
import { AlertCircle } from 'lucide-react';

const PriceAlert = () => {
  return (
    <div className="mb-3 flex items-center gap-2 bg-amber-50 p-3 rounded-md border border-amber-200">
      <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
      <p className="text-sm text-amber-600">
        Price information is currently unavailable.
      </p>
    </div>
  );
};

export default PriceAlert;
