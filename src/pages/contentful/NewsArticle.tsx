
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { PageBreadcrumbs, getSectionBreadcrumbs } from '@/components/PageBreadcrumbs';
import RichTextRenderer from '@/components/contentful/RichTextRenderer';
import { fetchNewsArticleBySlug } from '@/utils/contentful';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

const NewsArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const [breadcrumbs, setBreadcrumbs] = useState<{ label: string; path: string; current?: boolean }[]>([]);
  
  const { data: article, isLoading, error } = useQuery({
    queryKey: ['newsArticle', slug],
    queryFn: () => fetchNewsArticleBySlug(slug || ''),
    enabled: !!slug,
  });

  useEffect(() => {
    // Set up breadcrumbs
    const baseBreadcrumbs = getSectionBreadcrumbs('/news');
    if (slug) {
      setBreadcrumbs([
        ...baseBreadcrumbs,
        { label: article?.fields.title || 'News', path: `/news/${slug}`, current: true }
      ]);
    } else {
      setBreadcrumbs(baseBreadcrumbs);
    }
  }, [slug, article]);

  if (isLoading) {
    return (
      <>
        <Navigation />
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-10"></div>
              <div className="h-48 bg-gray-200 rounded mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  if (error || !article) {
    return (
      <>
        <Navigation />
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">News Article Not Found</h1>
            <p className="mb-6">Sorry, we couldn't find the news article you're looking for.</p>
            <Button asChild>
              <Link to="/news">Back to News</Link>
            </Button>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  const { title, publishDate, author, category, content } = article.fields;
  const formattedDate = publishDate ? format(new Date(publishDate), 'MMMM dd, yyyy') : '';

  return (
    <>
      <SEO 
        title={title}
        description={article.fields.excerpt}
        canonicalUrl={`/news/${slug}`}
        ogType="article"
        keywords={`peace2hearts, ${category}, news, relationships, marriage, divorce`}
        breadcrumbs={breadcrumbs.map(item => ({ name: item.label, url: `https://peace2hearts.com${item.path}` }))}
      />
      
      <Navigation />
      
      <div className="bg-softGray py-4">
        <div className="container mx-auto px-4">
          <PageBreadcrumbs items={breadcrumbs} />
        </div>
      </div>
      
      <article className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Button asChild variant="ghost" className="mb-6 gap-2">
              <Link to="/news">
                <ArrowLeft className="h-4 w-4" />
                Back to News
              </Link>
            </Button>
            
            <div className="mb-8">
              <span className="text-sm font-medium bg-peacefulBlue/10 text-peacefulBlue rounded-full py-1 px-3 mb-4 inline-block">
                {category}
              </span>
              <h1 className="text-3xl md:text-4xl font-lora font-bold text-gray-800 mb-4">{title}</h1>
              
              <div className="flex flex-wrap gap-4 text-gray-600 text-sm">
                {formattedDate && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{formattedDate}</span>
                  </div>
                )}
                {author && (
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span>{author}</span>
                  </div>
                )}
              </div>
            </div>
            
            {article.fields.featuredImage && (
              <div className="mb-8">
                <img 
                  src={article.fields.featuredImage.fields.file.url} 
                  alt={article.fields.featuredImage.fields.description || title} 
                  className="w-full h-auto rounded-lg"
                />
              </div>
            )}
            
            <div className="prose prose-lg max-w-none">
              <RichTextRenderer content={content} />
            </div>
            
            <div className="border-t border-gray-200 mt-12 pt-8">
              <h3 className="text-xl font-semibold mb-4">Need help with your relationship?</h3>
              <p className="text-gray-600 mb-6">
                Our professional counselors and legal experts are here to provide the support you need.
              </p>
              <Button asChild className="bg-peacefulBlue hover:bg-peacefulBlue/90">
                <Link to="/book-consultation">Book a Consultation</Link>
              </Button>
            </div>
          </div>
        </div>
      </article>
      
      <Footer />
    </>
  );
};

export default NewsArticle;
