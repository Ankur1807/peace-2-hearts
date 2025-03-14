
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  keywords?: string;
  language?: string;
  author?: string;
  structuredData?: Record<string, any>;
}

export const SEO = ({
  title,
  description,
  canonicalUrl,
  ogImage = "/og-image.png",
  ogType = "website",
  keywords = "divorce prevention, relationship counseling, couples therapy, legal support, marriage guidance",
  language = "en",
  author = "Peace2Hearts",
  structuredData,
}: SEOProps) => {
  const siteTitle = "Peace2Hearts";
  const fullTitle = `${title} | ${siteTitle}`;
  const baseUrl = "https://peace2hearts.com";
  const fullCanonicalUrl = canonicalUrl ? `${baseUrl}${canonicalUrl}` : undefined;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={language} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      {keywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}
      
      {/* Canonical URL */}
      {fullCanonicalUrl && <link rel="canonical" href={fullCanonicalUrl} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={siteTitle} />
      {ogImage && <meta property="og:image" content={`${baseUrl}${ogImage}`} />}
      {fullCanonicalUrl && <meta property="og:url" content={fullCanonicalUrl} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={`${baseUrl}${ogImage}`} />}

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};
