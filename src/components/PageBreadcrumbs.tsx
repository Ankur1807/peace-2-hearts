
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
}

export const PageBreadcrumbs = ({ items }: PageBreadcrumbsProps) => {
  // Add "Divorce Prevention" as a key part of the breadcrumb path for relevant service pages
  const enhancedItems = items.map(item => {
    if (item.path.includes('/services/') || item.path.includes('/resources/')) {
      return {
        ...item,
        label: item.label.includes('Prevention') ? item.label : 
               (item.current ? `${item.label} - Divorce Prevention` : item.label)
      };
    }
    return item;
  });
  
  // Convert breadcrumb items to schema format for structured data
  const schemaItems = enhancedItems.map(item => ({
    name: item.label,
    url: `https://peace2hearts.com${item.path}`
  }));

  return (
    <>
      <BreadcrumbSchema items={schemaItems} />
      <Breadcrumb className="my-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          
          {enhancedItems.map((item, index) => (
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
