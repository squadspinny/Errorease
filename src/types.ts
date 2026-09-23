export interface Author {
  name: string;
  role: string;
  avatar: string;
  bio?: string;
  isVerified?: boolean;
}

export interface CodeSnippet {
  language: string;
  code: string;
  description?: string;
}

export interface SolutionMethod {
  id: string;
  title: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  timeEstimate?: string;
  steps: string[];
  codeSnippets?: CodeSnippet[];
  warningNotice?: string;
  proTip?: string;
}

// ----------------------------------------------------
// Section / Content Block Types for Data-Driven Articles
// ----------------------------------------------------

export interface ArticleHeading {
  type: 'heading';
  level: 2 | 3 | 4;
  text: string;
  id?: string;
}

export interface ArticleParagraph {
  type: 'paragraph';
  text: string;
}

export interface ArticleSteps {
  type: 'steps';
  title?: string;
  items: string[];
}

export interface ArticleList {
  type: 'list';
  ordered?: boolean;
  items: string[];
}

export interface ArticleImage {
  type: 'image';
  src: string;
  alt: string;
  caption?: string;
}

export interface ArticleCode {
  type: 'code';
  language?: string;
  code: string;
  description?: string;
}

export interface ArticleNotice {
  type: 'warning' | 'info' | 'tip' | 'success' | 'note';
  text: string;
  title?: string;
}

export interface ArticleLink {
  type: 'link';
  text: string;
  url: string;
  isExternal?: boolean;
  description?: string;
}

export interface ArticleMethod {
  type: 'method';
  id?: string;
  title: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  timeEstimate?: string;
  steps: string[];
  warningNotice?: string;
  proTip?: string;
  codeSnippets?: CodeSnippet[];
}

export interface ArticleFAQ {
  type?: 'faq';
  question: string;
  answer: string;
}

export type ArticleContentItem =
  | ArticleHeading
  | ArticleParagraph
  | ArticleSteps
  | ArticleList
  | ArticleImage
  | ArticleCode
  | ArticleNotice
  | ArticleLink
  | ArticleMethod
  | ArticleFAQ;

export interface ArticleImageRef {
  src: string;
  alt?: string;
  caption?: string;
}

// ----------------------------------------------------
// Complete Article Interface (One-File-Per-Article CMS)
// ----------------------------------------------------

export interface Article {
  id: string;
  slug: string;
  title: string;
  seoTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  excerpt: string;
  category: string;
  categorySlug: string;
  categoryColor?: string;
  tags: string[];
  author: Author | string;
  publishedDate: string;
  updatedDate: string;
  readingTime?: string;
  readTime?: string;
  featured?: boolean;
  isFeatured?: boolean;
  isHeroLead?: boolean;
  isPopular?: boolean;
  views?: number;
  commentsCount?: number;
  featuredImage?: ArticleImageRef;
  imageUrl?: string;
  errorCode?: string;
  symptoms?: string[];
  rootCauses?: string[];
  quickFixCommand?: string;
  content: ArticleContentItem[];
  faqs?: ArticleFAQ[];
  relatedArticles?: string[];
  methods?: SolutionMethod[];
}

// Post is unified with Article for full backward compatibility
export type Post = Article;


