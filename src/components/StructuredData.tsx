import React from 'react';
import { Helmet } from 'react-helmet-async';

interface OrganizationSchemaProps {
  url?: string;
  logo?: string;
  sameAs?: string[];
}

export const OrganizationSchema = ({
  url = "https://peace2hearts.com",
  logo = "/lovable-uploads/aa1e4069-d5ee-4dda-9699-74f185ae43bf.png",
  sameAs = []
}: OrganizationSchemaProps) => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Peace2Hearts",
    url: url,
    logo: `${url}${logo}`,
    description: "Peace2Hearts provides mental health and legal support for individuals navigating relationship challenges.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Delhi",
      addressRegion: "Delhi",
      addressCountry: "India"
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+917428564364",
      contactType: "customer service",
      email: "support@peace2hearts.com"
    },
    sameAs: sameAs,
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
    </Helmet>
  );
};

interface ServiceSchemaProps {
  serviceType: string;
  serviceDescription: string;
  url: string;
}

export const ServiceSchema = ({ serviceType, serviceDescription, url }: ServiceSchemaProps) => {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: serviceType,
    provider: {
      "@type": "Organization",
      name: "Peace2Hearts"
    },
    description: serviceDescription,
    url: url
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(serviceSchema)}
      </script>
    </Helmet>
  );
};

interface BreadcrumbSchemaProps {
  items: {
    name: string;
    url: string;
  }[];
}

export const BreadcrumbSchema = ({ items }: BreadcrumbSchemaProps) => {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
};
