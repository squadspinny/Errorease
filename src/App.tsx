import React, { useState, useEffect, useMemo } from 'react';
import { 
  Header, 
  ArticleGridCard, 
  ArticleView, 
  SearchModal, 
  Footer,
  SitemapView,
  NotFoundView 
} from './components';
import { 
  AboutPage, 
  ContactPage, 
  DisclaimerPage, 
  PrivacyPolicyPage, 
  TermsPage 
} from './pages';
import { PageSlug } from './components/Footer';
import { getAllArticles, getArticleBySlug, getAllCategories } from './lib/articles';
import { updateHeadMetadata } from './lib/seo';
import { Post } from './types';
import { ChevronRight, X, Bookmark } from 'lucide-react';

export default function App() {
  // All articles discovered dynamically from src/articles/*.ts
  const allArticles = useMemo(() => getAllArticles(), []);

  // Expose on window for runtime access if needed
  useEffect(() => {
    (window as unknown as { __ERROREASE_ARTICLES__?: Post[] }).__ERROREASE_ARTICLES__ = allArticles;
  }, [allArticles]);

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<PageSlug | null>(null);
  const [notFoundSlug, setNotFoundSlug] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState<number>(9);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Saved slugs (Bookmarks)
  const [savedSlugs, setSavedSlugs] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('errorease_saved_slugs');
      return stored ? JSON.parse(stored) : ['home-1'];
    } catch {
      return ['home-1'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('errorease_saved_slugs', JSON.stringify(savedSlugs));
    } catch (e) {
      console.error(e);
    }
  }, [savedSlugs]);

  const STATIC_PAGES: PageSlug[] = ['about', 'contact', 'disclaimer', 'privacy', 'terms', 'sitemap'];

  const isKnownCategorySlug = (candidate: string): boolean => {
    const slug = candidate.toLowerCase();
    if (['windows', 'browsers', 'network-dns', 'network', 'programming', 'software', 'guides', 'bookmarks'].includes(slug)) {
      return true;
    }
    const allCats = getAllCategories();
    return allCats.some((c) => c.slug.toLowerCase() === slug);
  };

  /**
   * Parses current browser pathname and hash into application view state.
   * Simple slug resolution:
   * - Articles: /:slug (e.g. /dns-probe-finished-no-internet-repair)
   * - Categories: /:slug (e.g. /windows, /browsers)
   * - Static Pages: /:slug (e.g. /about, /contact, /sitemap)
   */
  const syncRouteFromUrl = () => {
    const pathname = window.location.pathname;
    const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();

    // Clean up pathname to extract candidate slug
    let rawPath = pathname.replace(/^\/+|\/+$/g, '').trim();

    // Support legacy /articles/:slug or /category/:slug by stripping prefix and replacing history state
    if (rawPath.startsWith('articles/')) {
      rawPath = rawPath.replace(/^articles\//, '');
      try {
        window.history.replaceState({}, '', `/${rawPath}`);
      } catch {
        // ignore
      }
    } else if (rawPath.startsWith('category/')) {
      rawPath = rawPath.replace(/^category\//, '');
      try {
        window.history.replaceState({}, '', `/${rawPath}`);
      } catch {
        // ignore
      }
    }

    const slug = (rawPath || hash).toLowerCase();

    // 1. Homepage (empty slug)
    if (!slug) {
      setSelectedPost(null);
      setActiveCategory(null);
      setActivePage(null);
      setNotFoundSlug(null);
      return;
    }

    // 2. Static Pages (/about, /contact, /disclaimer, /privacy, /terms, /sitemap)
    if (STATIC_PAGES.includes(slug as PageSlug)) {
      setActivePage(slug as PageSlug);
      setSelectedPost(null);
      setActiveCategory(null);
      setNotFoundSlug(null);
      return;
    }

    // 3. Articles (e.g. /dns-probe-finished-no-internet-repair)
    const foundArticle = getArticleBySlug(slug);
    if (foundArticle) {
      setSelectedPost(foundArticle);
      setActivePage(null);
      setActiveCategory(null);
      setNotFoundSlug(null);
      return;
    }

    // 4. Categories (e.g. /windows, /browsers, /network-dns)
    if (isKnownCategorySlug(slug)) {
      const normalizedCategory = slug === 'network' ? 'network-dns' : slug;
      setActiveCategory(normalizedCategory);
      setSelectedPost(null);
      setActivePage(null);
      setNotFoundSlug(null);
      return;
    }

    // 5. Unknown slug: show 404
    setSelectedPost(null);
    setActivePage(null);
    setActiveCategory(null);
    setNotFoundSlug(slug);
  };

  // Listen to popstate (browser back/forward) and hashchange
  useEffect(() => {
    syncRouteFromUrl();
    window.addEventListener('popstate', syncRouteFromUrl);
    window.addEventListener('hashchange', syncRouteFromUrl);
    return () => {
      window.removeEventListener('popstate', syncRouteFromUrl);
      window.removeEventListener('hashchange', syncRouteFromUrl);
    };
  }, [allArticles]);

  // Dynamic Comprehensive Technical SEO Metadata & Structured Data updater
  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://errorease.com';

    if (notFoundSlug) {
      updateHeadMetadata({
        title: 'Page Not Found (404) – ErrorEase',
        description: 'The troubleshooting guide or page you are looking for does not exist or has been relocated.',
        canonicalUrl: `${origin}/404`,
        robots: 'noindex, follow',
      });
      return;
    }

    if (selectedPost) {
      const canonicalUrl = `${origin}/${selectedPost.slug}`;
      const title = selectedPost.seoTitle || `${selectedPost.title} – ErrorEase`;
      const description = selectedPost.metaDescription || selectedPost.excerpt;
      const imageUrl = selectedPost.featuredImage?.src || selectedPost.imageUrl;
      const authorName = typeof selectedPost.author === 'string' ? selectedPost.author : selectedPost.author?.name || 'Pradeep Bijarniya';

      // 1. TechArticle Schema
      const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        'headline': selectedPost.title,
        'description': description,
        'image': imageUrl ? [imageUrl] : undefined,
        'datePublished': selectedPost.publishedDate,
        'dateModified': selectedPost.updatedDate || selectedPost.publishedDate,
        'author': {
          '@type': 'Person',
          'name': authorName,
          'url': `${origin}/about`,
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'ErrorEase',
          'logo': {
            '@type': 'ImageObject',
            'url': `${origin}/errorease-logo.png`,
          },
        },
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': canonicalUrl,
        },
      };

      // 2. BreadcrumbList Schema
      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': `${origin}/`,
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': selectedPost.category,
            'item': `${origin}/${selectedPost.categorySlug}`,
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': selectedPost.title,
            'item': canonicalUrl,
          },
        ],
      };

      const schemas: object[] = [articleSchema, breadcrumbSchema];

      // 3. FAQPage Schema (if article has faqs)
      if (selectedPost.faqs && selectedPost.faqs.length > 0) {
        schemas.push({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          'mainEntity': selectedPost.faqs.map((faq) => ({
            '@type': 'Question',
            'name': faq.question,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': faq.answer,
            },
          })),
        });
      }

      updateHeadMetadata({
        title,
        description,
        canonicalUrl,
        ogType: 'article',
        imageUrl,
        publishedTime: selectedPost.publishedDate,
        modifiedTime: selectedPost.updatedDate || selectedPost.publishedDate,
        authorName,
        section: selectedPost.category,
        jsonLd: schemas,
      });
      return;
    }

    if (activeCategory) {
      if (activeCategory === 'bookmarks') {
        updateHeadMetadata({
          title: 'Saved Bookmarks – ErrorEase',
          description: 'Your saved offline and quick-reference troubleshooting articles on ErrorEase.',
          canonicalUrl: `${origin}/bookmarks`,
          robots: 'noindex, follow',
        });
        return;
      }

      const catTitle = getCategoryTitle(activeCategory);
      const canonicalUrl = `${origin}/${activeCategory}`;
      const title = `${catTitle} Solutions & Guides – ErrorEase`;
      const description = `Browse all verified step-by-step troubleshooting guides and fixes for ${catTitle} errors on ErrorEase.`;

      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': `${origin}/`,
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': catTitle,
            'item': canonicalUrl,
          },
        ],
      };

      const collectionSchema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        'name': `${catTitle} Troubleshooting Guides`,
        'description': description,
        'url': canonicalUrl,
      };

      updateHeadMetadata({
        title,
        description,
        canonicalUrl,
        jsonLd: [collectionSchema, breadcrumbSchema],
      });
      return;
    }

    if (activePage) {
      const pageTitles: Record<string, string> = {
        about: 'About Us – ErrorEase',
        contact: 'Contact Support – ErrorEase',
        disclaimer: 'Disclaimer – ErrorEase',
        privacy: 'Privacy Policy – ErrorEase',
        terms: 'Terms of Service – ErrorEase',
        sitemap: 'Sitemap & Index – ErrorEase',
      };
      const pageDescs: Record<string, string> = {
        about: 'Learn about ErrorEase, our mission to deliver fast, verified tech troubleshooting guides, and our editorial standards.',
        contact: 'Get in touch with the ErrorEase technical editorial desk for error fix suggestions, errata reporting, or technical support.',
        disclaimer: 'Read the official ErrorEase editorial disclaimer regarding technical tutorials, software modifications, and system diagnostics.',
        privacy: 'Review the ErrorEase privacy policy regarding data protection, telemetry compliance, and user rights.',
        terms: 'Review terms and conditions governing the usage and syndication of ErrorEase technical guides.',
        sitemap: 'Browse the complete index of technical troubleshooting guides, error codes, and category directories on ErrorEase.',
      };
      const canonicalUrl = `${origin}/${activePage}`;
      const title = pageTitles[activePage] || 'ErrorEase';
      const description = pageDescs[activePage] || 'Troubleshooting and error solutions on ErrorEase.';

      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': `${origin}/`,
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': title.replace(' – ErrorEase', ''),
            'item': canonicalUrl,
          },
        ],
      };

      updateHeadMetadata({
        title,
        description,
        canonicalUrl,
        jsonLd: [breadcrumbSchema],
      });
      return;
    }

    // Homepage
    const canonicalUrl = `${origin}/`;
    const title = 'Errorease – Troubleshooting Made Easy';
    const description = 'Facing a tech error? Find simple step-by-step solutions for Windows, browsers, network, DNS, and programming problems at ErrorEase.';

    const websiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'ErrorEase',
      'url': canonicalUrl,
      'description': description,
      'potentialAction': {
        '@type': 'SearchAction',
        'target': `${origin}/?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    };

    const orgSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': 'ErrorEase',
      'url': canonicalUrl,
      'logo': `${origin}/errorease-logo.png`,
    };

    updateHeadMetadata({
      title,
      description,
      canonicalUrl,
      jsonLd: [websiteSchema, orgSchema],
    });
  }, [selectedPost, activeCategory, activePage, notFoundSlug]);

  // Global Keyboard shortcuts (Ctrl+K or Cmd+K for search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleSave = (slug: string) => {
    setSavedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleSelectPost = (post: Post) => {
    setSelectedPost(post);
    setActivePage(null);
    setActiveCategory(null);
    setNotFoundSlug(null);
    
    // Update browser URL to simple /:slug (e.g. /dns-probe-finished-no-internet-repair)
    try {
      window.history.pushState({}, '', `/${post.slug}`);
    } catch {
      window.location.hash = post.slug;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (categorySlug: string | null) => {
    setActiveCategory(categorySlug);
    setSelectedPost(null);
    setActivePage(null);
    setNotFoundSlug(null);
    setVisibleCount(9);

    if (categorySlug) {
      try {
        window.history.pushState({}, '', `/${categorySlug}`);
      } catch {
        window.location.hash = categorySlug;
      }
    } else {
      try {
        window.history.pushState({}, '', '/');
      } catch {
        window.location.hash = '';
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetHome = () => {
    setSelectedPost(null);
    setActiveCategory(null);
    setActivePage(null);
    setNotFoundSlug(null);
    setVisibleCount(9);

    try {
      window.history.pushState({}, '', '/');
    } catch {
      window.location.hash = '';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigatePage = (page: PageSlug) => {
    setActivePage(page);
    setSelectedPost(null);
    setActiveCategory(null);
    setNotFoundSlug(null);

    try {
      window.history.pushState({}, '', `/${page}`);
    } catch {
      window.location.hash = page;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 6);
      setIsLoadingMore(false);
    }, 250);
  };

  const getCategoryTitle = (slug: string | null) => {
    if (!slug) return '';
    switch (slug) {
      case 'bookmarks': return 'Saved Bookmarks';
      case 'windows': return 'Windows';
      case 'browsers': return 'Browsers';
      case 'network-dns':
      case 'network': return 'Network & DNS';
      case 'programming': return 'Programming';
      case 'software': return 'Software';
      case 'guides': return 'Guides';
      default: {
        const found = getAllCategories().find((c) => c.slug === slug);
        return found ? found.label : slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      }
    }
  };

  // Filter posts
  const filteredPosts = useMemo(() => {
    if (activeCategory === 'bookmarks') {
      return allArticles.filter((post) => savedSlugs.includes(post.slug));
    }
    if (!activeCategory) return allArticles;

    if (activeCategory === 'windows') {
      return allArticles.filter(
        (p) => p.categorySlug === 'windows' || p.category.toLowerCase().includes('windows')
      );
    }
    if (activeCategory === 'browsers') {
      return allArticles.filter(
        (p) => p.categorySlug === 'browsers' || p.category.toLowerCase().includes('browser')
      );
    }
    if (activeCategory === 'network-dns' || activeCategory === 'network') {
      return allArticles.filter(
        (p) =>
          p.categorySlug === 'network-dns' ||
          p.categorySlug === 'network' ||
          p.category.toLowerCase().includes('network') ||
          p.category.toLowerCase().includes('dns')
      );
    }
    if (activeCategory === 'programming') {
      return allArticles.filter(
        (p) => p.categorySlug === 'programming' || p.category.toLowerCase().includes('programming')
      );
    }
    if (activeCategory === 'software') {
      return allArticles.filter(
        (p) => p.categorySlug === 'software' || p.category.toLowerCase().includes('software')
      );
    }
    if (activeCategory === 'guides') {
      return allArticles.filter(
        (p) =>
          p.categorySlug === 'guides' ||
          p.tags?.some((t) => t.toLowerCase().includes('guide')) ||
          p.title.toLowerCase().startsWith('how to') ||
          p.title.toLowerCase().includes('guide')
      );
    }

    return allArticles.filter((p) => p.categorySlug === activeCategory || p.category.toLowerCase() === activeCategory.toLowerCase());
  }, [allArticles, activeCategory, savedSlugs]);

  const displayedPosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col text-slate-800 antialiased selection:bg-[#00a877]/20 selection:text-[#00a877]">
      
      {/* Header */}
      <Header
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        onOpenSearch={() => setSearchOpen(true)}
        onResetHome={handleResetHome}
        savedCount={savedSlugs.length}
        onOpenBookmarks={() => {
          setSelectedPost(null);
          setActivePage(null);
          setNotFoundSlug(null);
          setActiveCategory('bookmarks');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full pb-16">
        
        {/* 404 Not Found Page */}
        {notFoundSlug ? (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
            <NotFoundView
              onBackToHome={handleResetHome}
              onOpenSearch={() => setSearchOpen(true)}
              attemptedSlug={notFoundSlug}
            />
          </div>
        ) : activePage ? (
          /* Static Pages & Sitemap */
          <div className="max-w-6xl mx-auto px-[4px] sm:px-6 pt-3 sm:pt-5">
            {activePage === 'about' && (
              <AboutPage 
                onBackToHome={handleResetHome}
                onContactClick={() => handleNavigatePage('contact')}
                allPosts={allArticles}
                onSelectPost={handleSelectPost}
              />
            )}
            {activePage === 'contact' && (
              <ContactPage 
                onBackToHome={handleResetHome}
                allPosts={allArticles}
                onSelectPost={handleSelectPost}
              />
            )}
            {activePage === 'disclaimer' && (
              <DisclaimerPage 
                onBackToHome={handleResetHome}
                allPosts={allArticles}
                onSelectPost={handleSelectPost}
              />
            )}
            {activePage === 'privacy' && (
              <PrivacyPolicyPage 
                onBackToHome={handleResetHome}
                allPosts={allArticles}
                onSelectPost={handleSelectPost}
              />
            )}
            {activePage === 'terms' && (
              <TermsPage 
                onBackToHome={handleResetHome}
                allPosts={allArticles}
                onSelectPost={handleSelectPost}
              />
            )}
            {activePage === 'sitemap' && (
              <SitemapView
                onBackToHome={handleResetHome}
                onSelectPost={handleSelectPost}
                onSelectCategory={handleSelectCategory}
                onNavigatePage={handleNavigatePage}
              />
            )}
          </div>
        ) : selectedPost ? (
          /* Single Article Reader View */
          <div className="max-w-6xl mx-auto px-[4px] sm:px-6 pt-3 sm:pt-5">
            <ArticleView
              post={selectedPost}
              allPosts={allArticles}
              onBack={handleResetHome}
              onSelectCategory={handleSelectCategory}
              onSelectPost={handleSelectPost}
              isSaved={savedSlugs.includes(selectedPost.slug)}
              onToggleSave={handleToggleSave}
              onViewBookmarks={() => {
                setSelectedPost(null);
                setActiveCategory('bookmarks');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        ) : (
          /* Homepage View */
          <>
            {/* Articles Section - Direct Grid without Latest Article heading */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 sm:pt-8">
              
              {/* Semantic Accessible Page Heading for SEO */}
              <h1 className="sr-only">
                {activeCategory 
                  ? `${getCategoryTitle(activeCategory)} Troubleshooting Guides & Solutions – ErrorEase` 
                  : 'ErrorEase – Verified Technical Error Solutions & Troubleshooting Guides'}
              </h1>

              {/* Category Active Filter notification (if active) */}
              {activeCategory && (
                <div 
                  style={{ borderRadius: '1px' }}
                  className="mb-6 flex items-center justify-between bg-white px-4 py-3 border border-slate-200 shadow-2xs"
                >
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700">
                    <span className="text-slate-400">Filtering by:</span>
                    <span className="px-2 py-0.5 bg-[#00a877]/10 text-[#00a877] font-bold uppercase text-[11px]" style={{ borderRadius: '1px' }}>
                      {getCategoryTitle(activeCategory)}
                    </span>
                    <span className="text-slate-400 text-xs">({filteredPosts.length} articles)</span>
                  </div>
                  <button
                    onClick={() => handleSelectCategory(null)}
                    style={{ borderRadius: '1px' }}
                    className="p-1 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                    title="Clear filter"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Empty state for bookmarks or category */}
              {displayedPosts.length === 0 ? (
                <div 
                  style={{ borderRadius: '1px' }}
                  className="text-center py-16 bg-white border border-slate-200 p-8 my-4"
                >
                  {activeCategory === 'bookmarks' ? (
                    <>
                      <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <h3 className="text-base font-bold text-slate-800 mb-1">No saved articles yet</h3>
                      <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mb-4">
                        Click the bookmark icon on any article card to save it for quick reference here.
                      </p>
                      <button
                        onClick={() => handleSelectCategory(null)}
                        style={{ borderRadius: '1px' }}
                        className="px-4 py-2 bg-[#00a877] text-white text-xs font-bold transition-opacity hover:opacity-90 cursor-pointer"
                      >
                        Explore Articles
                      </button>
                    </>
                  ) : (
                    <>
                      <h3 className="text-base font-bold text-slate-800 mb-1">No articles found in this category</h3>
                      <p className="text-xs sm:text-sm text-slate-500 mb-4">
                        Try exploring another category or clearing the current filter.
                      </p>
                      <button
                        onClick={() => handleSelectCategory(null)}
                        style={{ borderRadius: '1px' }}
                        className="px-4 py-2 bg-[#00a877] text-white text-xs font-bold transition-opacity hover:opacity-90 cursor-pointer"
                      >
                        Show All Articles
                      </button>
                    </>
                  )}
                </div>
              ) : (
                /* Responsive Article Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                  {displayedPosts.map((post) => (
                    <ArticleGridCard
                      key={post.id}
                      post={post}
                      onSelectPost={handleSelectPost}
                    />
                  ))}
                </div>
              )}

              {/* Load More Button */}
              {hasMore && (
                <div className="mt-12 text-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    style={{ borderRadius: '1px' }}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-[#00a877] hover:bg-[#009368] text-white text-xs sm:text-sm font-bold tracking-wide uppercase shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-98 disabled:opacity-50"
                  >
                    {isLoadingMore ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Loading...
                      </span>
                    ) : (
                      <>
                        <span>Load More Articles</span>
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </section>
          </>
        )}

      </main>

      {/* Footer */}
      <Footer
        onNavigatePage={handleNavigatePage}
        onResetHome={handleResetHome}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        posts={allArticles}
        onSelectPost={handleSelectPost}
      />

    </div>
  );
}
