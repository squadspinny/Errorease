import { Article } from '../types';

/**
 * ErrorEase Article Starter Template
 *
 * To create a new article:
 * 1. Duplicate this file into `src/articles/<your-article-slug>.ts` (do not prefix with underscore).
 * 2. Update the slug, title, category, content array, and FAQs.
 * 3. Save the file.
 *
 * The article will automatically appear on the homepage, category page, search, sitemap, and routing!
 */
export const article: Article = {
  id: 'my-new-article-slug',
  slug: 'my-new-article-slug',
  title: 'How to Fix Your Issue Title Here',
  seoTitle: 'How to Fix Your Issue Title Here – ErrorEase Step-by-Step Guide',
  metaDescription: 'Step-by-step guide to diagnose and resolve this issue with quick commands and expert advice.',
  excerpt: 'A comprehensive troubleshooting walkthrough for resolving this common technical error.',
  category: 'Windows',
  categorySlug: 'windows',
  tags: ['Windows', 'Troubleshooting', 'System Fix'],
  author: {
    name: 'ErrorEase Contributor',
    role: 'Technical Writer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80',
    bio: 'Software engineer and system diagnostics specialist.',
    isVerified: true,
  },
  publishedDate: 'September 22, 2026',
  updatedDate: 'September 22, 2026',
  readingTime: '5 min read',
  featured: false,
  featuredImage: {
    src: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=1200&h=675&q=80',
    alt: 'Troubleshooting illustration',
    caption: 'Follow these verified steps to repair your system.'
  },
  errorCode: '0x00000000',
  content: [
    {
      type: 'paragraph',
      text: 'Explain the issue here and what users typically experience when it occurs.'
    },
    {
      type: 'heading',
      level: 2,
      text: 'Method 1: Primary Solution Steps'
    },
    {
      type: 'steps',
      items: [
        'Press Win + R to open the Run dialog box.',
        'Type cmd and press Ctrl + Shift + Enter to run as Administrator.',
        'Execute the repair command detailed below.'
      ]
    },
    {
      type: 'code',
      language: 'cmd',
      code: 'sfc /scannow',
      description: 'Run in an elevated Command Prompt:'
    },
    {
      type: 'warning',
      text: 'Ensure you save all open work before initiating system repairs.'
    },
    {
      type: 'tip',
      text: 'Restart your machine after the scan finishes to apply changes.'
    }
  ],
  faqs: [
    {
      question: 'What is the most common reason for this error?',
      answer: 'This error is typically caused by corrupted configuration files or outdated background services.'
    }
  ],
  relatedArticles: []
};

export default article;
