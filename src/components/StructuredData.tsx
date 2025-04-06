
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface OrganizationSchemaProps {
  url?: string;
  logo?: string;
  sameAs?: string[];
}

export const OrganizationSchema = ({
  url = "https://peace2hearts.com",
  logo = "/lovable-uploads/6a7e5248-cc34-4298-b6e9-3cfe585ec7d1.png",
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
      telephone: "+91 7428564364",
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

interface WebsiteSchemaProps {
  url?: string;
}

export const WebsiteSchema = ({ url = "https://peace2hearts.com" }: WebsiteSchemaProps) => {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Peace2Hearts",
    url: url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
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

interface FAQSchemaProps {
  questions: {
    question: string;
    answer: string;
  }[];
}

export const FAQSchema = ({ questions }: FAQSchemaProps) => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map(q => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer
      }
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
    </Helmet>
  );
};
