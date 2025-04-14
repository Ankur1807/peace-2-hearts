
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PackagePrice } from '@/utils/pricingTypes';
import PackageEditForm from './PackageEditForm';
import PackageStatusToggle from './PackageStatusToggle';

interface PackageTableProps {
  packages: PackagePrice[];
  loading: boolean;
  onEditPrice: (id: string, price: number) => Promise<void>;
  onToggleStatus: (id: string, currentStatus: boolean) => Promise<void>;
}

const PackageTable: React.FC<PackageTableProps> = ({
  packages,
  loading,
  onEditPrice,
  onToggleStatus,
}) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Package Name</TableHead>
            <TableHead>Package ID</TableHead>
            <TableHead>Included Services</TableHead>
            <TableHead>Price (₹)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Loading packages...
              </TableCell>
            </TableRow>
          ) : packages.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No packages found
              </TableCell>
            </TableRow>
          ) : (
            packages.map((pkg) => (
              <TableRow key={pkg.id}>
                <TableCell className="font-medium">{pkg.package_name}</TableCell>
                <TableCell>{pkg.package_id}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {pkg.services.map((service, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 rounded-md text-xs"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <PackageEditForm
                    pkg={pkg}
                    onSave={(price) => onEditPrice(pkg.id, price)}
                  />
                </TableCell>
                <TableCell>
                  <PackageStatusToggle
                    isActive={pkg.is_active}
                    onToggle={() => onToggleStatus(pkg.id, pkg.is_active)}
                  />
                </TableCell>
                <TableCell>
                  {/* Status already handled by PackageStatusToggle */}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PackageTable;
