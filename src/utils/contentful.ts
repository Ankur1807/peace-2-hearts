
import { createClient } from 'contentful';

// This should be replaced with your actual Contentful space ID and access token
// For security, these should ideally be stored in Supabase secrets
const CONTENTFUL_SPACE_ID = 'your_space_id';
const CONTENTFUL_ACCESS_TOKEN = 'your_access_token';

export const contentfulClient = createClient({
  space: CONTENTFUL_SPACE_ID,
  accessToken: CONTENTFUL_ACCESS_TOKEN,
});

export type ContentfulBlogPost = {
  sys: {
    id: string;
    createdAt: string;
  };
  fields: {
    title: string;
    slug: string;
    excerpt: string;
    content: any; // Rich text content
    category: string;
    author: string;
    featuredImage: any;
    publishDate: string;
    isFeatured?: boolean;
  };
};

export type ContentfulNewsArticle = {
  sys: {
    id: string;
    createdAt: string;
  };
  fields: {
    title: string;
    slug: string;
    excerpt: string;
    content: any; // Rich text content
    category: string;
    author: string;
    featuredImage: any;
    publishDate: string;
    isFeatured?: boolean;
  };
};

export const fetchBlogPosts = async (): Promise<ContentfulBlogPost[]> => {
  try {
    const response = await contentfulClient.getEntries({
      content_type: 'blogPost',
      order: '-fields.publishDate',
    });
    return response.items as unknown as ContentfulBlogPost[];
  } catch (error) {
    console.error('Error fetching blog posts from Contentful:', error);
    return [];
  }
};

export const fetchNewsArticles = async (): Promise<ContentfulNewsArticle[]> => {
  try {
    const response = await contentfulClient.getEntries({
      content_type: 'newsArticle',
      order: '-fields.publishDate',
    });
    return response.items as unknown as ContentfulNewsArticle[];
  } catch (error) {
    console.error('Error fetching news articles from Contentful:', error);
    return [];
  }
};

export const fetchBlogPostBySlug = async (slug: string): Promise<ContentfulBlogPost | null> => {
  try {
    const response = await contentfulClient.getEntries({
      content_type: 'blogPost',
      'fields.slug': slug,
    });
    
    if (response.items.length > 0) {
      return response.items[0] as unknown as ContentfulBlogPost;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching blog post with slug "${slug}":`, error);
    return null;
  }
};

export const fetchNewsArticleBySlug = async (slug: string): Promise<ContentfulNewsArticle | null> => {
  try {
    const response = await contentfulClient.getEntries({
      content_type: 'newsArticle',
      'fields.slug': slug,
    });
    
    if (response.items.length > 0) {
      return response.items[0] as unknown as ContentfulNewsArticle;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching news article with slug "${slug}":`, error);
    return null;
  }
};
