
import React from 'react';
import { ServicePrice } from '@/utils/pricingTypes';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ServiceEditRow from './ServiceEditRow';

interface ServiceListProps {
  services: ServicePrice[];
  loading: boolean;
  onEdit: (id: string, currentPrice: number) => void;
  onSave: (id: string) => void;
  onCancel: () => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
  editMode: string | null;
  editedPrice: string;
  setEditedPrice: (price: string) => void;
}

const ServiceList = ({
  services,
  loading,
  onEdit,
  onSave,
  onCancel,
  onToggleStatus,
  onDelete,
  editMode,
  editedPrice,
  setEditedPrice,
}: ServiceListProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Service Name</TableHead>
            <TableHead>Service ID</TableHead>
            <TableHead>Price (₹)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Loading services...
              </TableCell>
            </TableRow>
          ) : services.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No services found. Click "Add Service" to create services.
              </TableCell>
            </TableRow>
          ) : (
            services.map((service) => (
              <ServiceEditRow
                key={service.id}
                service={service}
                editMode={editMode}
                editedPrice={editedPrice}
                setEditedPrice={setEditedPrice}
                onEdit={onEdit}
                onSave={onSave}
                onCancel={onCancel}
                onToggleStatus={onToggleStatus}
                onDelete={onDelete}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ServiceList;
