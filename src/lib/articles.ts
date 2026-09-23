import { Article, ArticleContentItem, Author, SolutionMethod } from '../types';

/**
 * Automatically discovers all article files inside `/src/articles/*.ts`.
 * Vite replaces `import.meta.glob` at build/transpile time.
 * When a file is added to `src/articles/`, it is automatically discovered.
 * When a file is deleted from `src/articles/`, it is automatically removed.
 */
const articleModules = import.meta.glob<{
  article?: Partial<Article>;
  default?: Partial<Article>;
}>('/src/articles/*.ts', { eager: true });

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80';

/**
 * Normalizes an article object to ensure complete type safety and backward-compatibility.
 */
function normalizeArticle(raw: Partial<Article>, fallbackSlug: string): Article {
  const slug = raw.slug || fallbackSlug;
  const title = raw.title || 'Untitled Article';
  const excerpt = raw.excerpt || '';
  const category = raw.category || 'General';
  const categorySlug = raw.categorySlug || category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const publishedDate = raw.publishedDate || 'September 22, 2026';
  const updatedDate = raw.updatedDate || publishedDate;
  const readTime = raw.readingTime || raw.readTime || '5 min read';
  const isFeatured = raw.featured ?? raw.isFeatured ?? false;

  const imageUrl =
    raw.featuredImage?.src ||
    raw.imageUrl ||
    'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&h=500&q=80';

  const authorObj: Author =
    typeof raw.author === 'string'
      ? {
          name: raw.author,
          role: 'Technical Contributor',
          avatar: DEFAULT_AVATAR,
          bio: 'Troubleshooting specialist at ErrorEase.',
          isVerified: true,
        }
      : {
          name: raw.author?.name || 'ErrorEase Team',
          role: raw.author?.role || 'Technical Contributor',
          avatar: raw.author?.avatar || DEFAULT_AVATAR,
          bio: raw.author?.bio || '',
          isVerified: raw.author?.isVerified ?? true,
        };

  // Ensure content array
  const rawContent: ArticleContentItem[] = Array.isArray(raw.content) ? raw.content : [];

  // If content is empty but legacy methods exist, convert methods to content items
  const content: ArticleContentItem[] = [...rawContent];
  if (content.length === 0 && raw.methods && raw.methods.length > 0) {
    if (excerpt) {
      content.push({ type: 'paragraph', text: excerpt });
    }
    raw.methods.forEach((m) => {
      content.push({ type: 'heading', level: 2, text: m.title });
      if (m.warningNotice) {
        content.push({ type: 'warning', text: m.warningNotice });
      }
      if (m.steps && m.steps.length > 0) {
        content.push({ type: 'steps', items: m.steps });
      }
      if (m.codeSnippets) {
        m.codeSnippets.forEach((cs) => {
          content.push({
            type: 'code',
            language: cs.language,
            code: cs.code,
            description: cs.description,
          });
        });
      }
      if (m.proTip) {
        content.push({ type: 'tip', text: m.proTip });
      }
    });
  }

  // Also synthesize legacy methods array for any older components if needed
  const methods: SolutionMethod[] = raw.methods || [];

  return {
    id: raw.id || slug,
    slug,
    title,
    seoTitle: raw.seoTitle || `${title} – ErrorEase`,
    metaDescription: raw.metaDescription || excerpt,
    canonicalUrl: raw.canonicalUrl || `/${slug}`,
    excerpt,
    category,
    categorySlug,
    categoryColor: raw.categoryColor || 'emerald',
    tags: Array.isArray(raw.tags) ? raw.tags : [category],
    author: authorObj,
    publishedDate,
    updatedDate,
    readingTime: readTime,
    readTime,
    featured: isFeatured,
    isFeatured,
    isHeroLead: raw.isHeroLead ?? false,
    isPopular: raw.isPopular ?? false,
    views: raw.views || 1240,
    commentsCount: raw.commentsCount || 0,
    imageUrl,
    featuredImage: {
      src: imageUrl,
      alt: raw.featuredImage?.alt || title,
      caption: raw.featuredImage?.caption,
    },
    errorCode: raw.errorCode,
    symptoms: raw.symptoms,
    rootCauses: raw.rootCauses,
    quickFixCommand: raw.quickFixCommand,
    content,
    faqs: Array.isArray(raw.faqs) ? raw.faqs : [],
    relatedArticles: Array.isArray(raw.relatedArticles) ? raw.relatedArticles : [],
    methods,
  };
}

/**
 * Discovers and parses all articles across the `/src/articles/` directory.
 */
function loadAllArticles(): Article[] {
  const articles: Article[] = [];

  for (const [path, module] of Object.entries(articleModules)) {
    // Extract slug from path: /src/articles/foo-bar.ts -> foo-bar
    const filename = path.split('/').pop() || '';
    if (filename.startsWith('_')) {
      continue; // Skip templates and drafts
    }
    const fallbackSlug = filename.replace(/\.(ts|tsx|js|jsx)$/, '');

    const rawArticle = module.article || module.default;
    if (rawArticle && typeof rawArticle === 'object') {
      articles.push(normalizeArticle(rawArticle, fallbackSlug));
    }
  }

  // Sort: featured first, then newest publishedDate
  return articles.sort((a, b) => {
    return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
  });
}

// Cached articles list
let cachedArticles: Article[] | null = null;

export function getAllArticles(): Article[] {
  if (!cachedArticles) {
    cachedArticles = loadAllArticles();
  }
  return cachedArticles;
}

export function getArticleBySlug(slug: string): Article | undefined {
  if (!slug) return undefined;
  const cleanSlug = slug.trim().toLowerCase();
  return getAllArticles().find((a) => a.slug.toLowerCase() === cleanSlug);
}

export function getArticlesByCategory(categorySlug: string): Article[] {
  if (!categorySlug) return getAllArticles();
  const clean = categorySlug.trim().toLowerCase();
  return getAllArticles().filter(
    (a) =>
      a.categorySlug.toLowerCase() === clean ||
      a.category.toLowerCase() === clean ||
      (clean === 'network-dns' && (a.categorySlug === 'network' || a.categorySlug === 'network-dns'))
  );
}

export function searchArticles(query: string): Article[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return getAllArticles().filter((post) => {
    const inTitle = post.title.toLowerCase().includes(q);
    const inExcerpt = post.excerpt.toLowerCase().includes(q);
    const inCategory = post.category.toLowerCase().includes(q);
    const inTags = post.tags?.some((t) => t.toLowerCase().includes(q));
    const inErrorCode = post.errorCode?.toLowerCase().includes(q);

    // Search inside content items
    const inContent = post.content.some((item) => {
      if ('text' in item && typeof item.text === 'string') {
        return item.text.toLowerCase().includes(q);
      }
      if ('items' in item && Array.isArray(item.items)) {
        return item.items.some((step) => step.toLowerCase().includes(q));
      }
      if ('question' in item && typeof item.question === 'string') {
        return item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q);
      }
      if ('code' in item && typeof item.code === 'string') {
        return item.code.toLowerCase().includes(q);
      }
      return false;
    });

    return inTitle || inExcerpt || inCategory || inTags || inErrorCode || inContent;
  });
}

export function getRelatedArticles(article: Article, limit = 3): Article[] {
  const all = getAllArticles();
  const result: Article[] = [];
  const addedSlugs = new Set<string>([article.slug]);

  // 1. Resolve explicit relatedArticles references if valid
  if (article.relatedArticles && article.relatedArticles.length > 0) {
    for (const refSlug of article.relatedArticles) {
      if (result.length >= limit) break;
      const found = all.find((a) => a.slug === refSlug || a.id === refSlug);
      if (found && !addedSlugs.has(found.slug)) {
        result.push(found);
        addedSlugs.add(found.slug);
      }
    }
  }

  // 2. Supplement with articles in same category
  if (result.length < limit) {
    for (const other of all) {
      if (result.length >= limit) break;
      if (
        !addedSlugs.has(other.slug) &&
        (other.categorySlug === article.categorySlug || other.category === article.category)
      ) {
        result.push(other);
        addedSlugs.add(other.slug);
      }
    }
  }

  // 3. Fallback to latest posts
  if (result.length < limit) {
    for (const other of all) {
      if (result.length >= limit) break;
      if (!addedSlugs.has(other.slug)) {
        result.push(other);
        addedSlugs.add(other.slug);
      }
    }
  }

  return result;
}

export function getAllCategories(): { label: string; slug: string; count: number }[] {
  const articles = getAllArticles();
  const map = new Map<string, { label: string; slug: string; count: number }>();

  articles.forEach((a) => {
    const slug = a.categorySlug || 'general';
    const existing = map.get(slug);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(slug, {
        label: a.category || slug,
        slug,
        count: 1,
      });
    }
  });

  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

export function getSitemapData() {
  const articles = getAllArticles();
  const categories = getAllCategories();

  const staticPages = [
    { url: '/', title: 'Home', changefreq: 'daily', priority: '1.0' },
    { url: '/about', title: 'About ErrorEase', changefreq: 'monthly', priority: '0.6' },
    { url: '/contact', title: 'Contact Support', changefreq: 'monthly', priority: '0.6' },
    { url: '/privacy', title: 'Privacy Policy', changefreq: 'monthly', priority: '0.5' },
    { url: '/terms', title: 'Terms of Service', changefreq: 'monthly', priority: '0.5' },
    { url: '/disclaimer', title: 'Disclaimer', changefreq: 'monthly', priority: '0.5' },
    { url: '/sitemap', title: 'Sitemap', changefreq: 'weekly', priority: '0.7' },
  ];

  const categoryEntries = categories.map((c) => ({
    url: `/${c.slug}`,
    title: c.label,
    changefreq: 'weekly',
    priority: '0.8',
  }));

  const articleEntries = articles.map((a) => ({
    url: `/${a.slug}`,
    title: a.title,
    publishedDate: a.publishedDate,
    updatedDate: a.updatedDate,
    category: a.category,
    changefreq: 'weekly',
    priority: a.featured ? '0.9' : '0.8',
  }));

  return {
    staticPages,
    categoryEntries,
    articleEntries,
  };
}

export function generateSitemapXml(domain = 'https://errorease.com'): string {
  const data = getSitemapData();
  const now = new Date().toISOString().split('T')[0];

  const urls: string[] = [];

  data.staticPages.forEach((p) => {
    urls.push(`  <url>
    <loc>${domain}${p.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`);
  });

  data.categoryEntries.forEach((c) => {
    urls.push(`  <url>
    <loc>${domain}${c.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${c.changefreq}</changefreq>
    <priority>${c.priority}</priority>
  </url>`);
  });

  data.articleEntries.forEach((a) => {
    urls.push(`  <url>
    <loc>${domain}${a.url}</loc>
    <lastmod>${a.updatedDate || now}</lastmod>
    <changefreq>${a.changefreq}</changefreq>
    <priority>${a.priority}</priority>
  </url>`);
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;
}
