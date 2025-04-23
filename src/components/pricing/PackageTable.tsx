
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ServicePrice } from '@/utils/pricing/types';
import PackageEditForm from './PackageEditForm';
import PackageStatusToggle from './PackageStatusToggle';

interface PackageTableProps {
  packages: ServicePrice[];
  loading: boolean;
  updating?: boolean;
  onEditPrice: (id: string, price: number) => Promise<void>;
  onToggleStatus: (id: string, currentStatus: boolean) => Promise<void>;
}

const PackageTable: React.FC<PackageTableProps> = ({
  packages,
  loading,
  updating = false,
  onEditPrice,
  onToggleStatus,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Package Name</TableHead>
          <TableHead>Package ID</TableHead>
          <TableHead>Services</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8">
              Loading packages...
            </TableCell>
          </TableRow>
        ) : packages.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8">
              No packages found.
            </TableCell>
          </TableRow>
        ) : (
          packages.map((pkg) => (
            <TableRow key={pkg.id}>
              <TableCell className="font-medium">{pkg.service_name}</TableCell>
              <TableCell>{pkg.service_id}</TableCell>
              <TableCell>
                {pkg.services?.map((service) => (
                  <span key={service} className="inline-block bg-slate-100 px-2 py-1 rounded text-xs mr-1 mb-1">
                    {service}
                  </span>
                ))}
              </TableCell>
              <TableCell>
                <PackageEditForm
                  pkg={pkg}
                  onSave={(price) => onEditPrice(pkg.id, price)}
                  disabled={updating}
                />
              </TableCell>
              <TableCell>
                <PackageStatusToggle
                  isActive={pkg.is_active}
                  onChange={() => onToggleStatus(pkg.id, pkg.is_active)}
                  disabled={updating}
                />
              </TableCell>
              <TableCell>
                <span className="text-xs text-gray-500">
                  Updated: {new Date(pkg.updated_at).toLocaleString()}
                </span>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default PackageTable;
