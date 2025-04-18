
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DiscountCodes = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Discount Codes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
          <p>Discount management functionality will be available in a future update.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DiscountCodes;
