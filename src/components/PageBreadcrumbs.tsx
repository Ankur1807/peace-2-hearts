
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { BreadcrumbSchema } from './StructuredData';

interface BreadcrumbItem {
  label: string;
  path: string;
  current?: boolean;
}

interface PageBreadcrumbsProps {
  items: BreadcrumbItem[];
  includeHome?: boolean;
  schema?: boolean;
  className?: string;
}

// Define breadcrumb structure for main site sections
export const getSectionBreadcrumbs = (path: string): BreadcrumbItem[] => {
  const pathSegments = path.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];
  let currentPath = '';

  // Define route mappings for human-readable labels
  const routeLabels: Record<string, string> = {
    'about': 'About Us',
    'services': 'Services',
    'resources': 'Resources',
    'news': 'News',
    'contact': 'Contact',
    'consultants': 'Consultants',
    'book-consultation': 'Book Consultation',
    'terms': 'Terms & Conditions',
    'privacy-policy': 'Privacy Policy',
    'cancellation-refund': 'Cancellation & Refund',
    'shipping-delivery': 'Shipping & Delivery',
    'mental-health': 'Mental Health',
    'legal-support': 'Legal Support',
    'therapy': 'Therapy',
    'divorce': 'Divorce',
    'custody': 'Child Custody',
    'counselling': 'Counselling',
    'family-therapy': 'Family Therapy',
    'premarital-counselling': 'Premarital Counselling',
    'couples-counselling': 'Couples Counselling',
    'sexual-health-counselling': 'Sexual Health Counselling',
    'pre-marriage': 'Pre-Marriage Legal',
    'mediation': 'Mediation Services',
    'maintenance': 'Maintenance Consultation',
    'general': 'General Consultation'
  };

  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Determine if this is the current (last) segment
    const isCurrent = index === pathSegments.length - 1;
    
    breadcrumbs.push({
      label: routeLabels[segment] || segment,
      path: currentPath,
      current: isCurrent
    });
  });

  return breadcrumbs;
};

export const PageBreadcrumbs = ({ 
  items, 
  includeHome = true, 
  schema = true,
  className = ''
}: PageBreadcrumbsProps) => {
  // Convert breadcrumb items to schema format for structured data
  const schemaItems = [
    ...(includeHome ? [{ name: 'Home', url: 'https://peace2hearts.com' }] : []),
    ...items.map(item => ({
      name: item.label,
      url: `https://peace2hearts.com${item.path}`
    }))
  ];

  return (
    <>
      {schema && <BreadcrumbSchema items={schemaItems} />}
      <Breadcrumb className={`my-6 ${className}`}>
        <BreadcrumbList>
          {includeHome && (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          )}
          
          {items.map((item, index) => (
            <React.Fragment key={item.path}>
              {item.current ? (
                <BreadcrumbItem>
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                </BreadcrumbItem>
              ) : (
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={item.path}>{item.label}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              )}
              
              {index < items.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
};
