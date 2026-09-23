export interface SeoConfig {
  title: string;
  description: string;
  canonicalUrl: string;
  robots?: string;
  ogType?: 'website' | 'article';
  imageUrl?: string;
  publishedTime?: string;
  modifiedTime?: string;
  authorName?: string;
  section?: string;
  jsonLd?: object[];
}

function setMetaTag(nameOrProperty: 'name' | 'property', attrValue: string, content: string | undefined) {
  let element = document.querySelector(`meta[${nameOrProperty}="${attrValue}"]`);
  if (!content) {
    if (element) {
      element.remove();
    }
    return;
  }
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(nameOrProperty, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function setCanonicalTag(url: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

function setJsonLd(schemas: object[] | undefined) {
  const SCRIPT_ID = 'errorease-structured-data';
  let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
  
  if (!schemas || schemas.length === 0) {
    if (script) {
      script.remove();
    }
    return;
  }

  if (!script) {
    script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  // If multiple schemas, wrap in @graph
  const payload = schemas.length === 1 
    ? schemas[0] 
    : {
        '@context': 'https://schema.org',
        '@graph': schemas,
      };

  script.textContent = JSON.stringify(payload, null, 2);
}

/**
 * Dynamically updates all technical SEO tags in document.head:
 * - Page Title
 * - Meta Description
 * - Canonical URL (prevents duplicate tags)
 * - Meta Robots (index, noindex)
 * - OpenGraph (og:title, og:description, og:url, og:type, og:image, og:site_name)
 * - Twitter Cards (twitter:title, twitter:description, twitter:image, twitter:card)
 * - Article Meta (published_time, modified_time, author, section)
 * - Schema.org JSON-LD (Article, Breadcrumbs, FAQ, WebSite, Organization)
 */
export function updateHeadMetadata(config: SeoConfig): void {
  if (typeof document === 'undefined') return;

  // 1. Title
  document.title = config.title;

  // 2. Meta Description
  setMetaTag('name', 'description', config.description);

  // 3. Robots
  const robots = config.robots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
  setMetaTag('name', 'robots', robots);

  // 4. Canonical Tag (Single, absolute, clean URL)
  setCanonicalTag(config.canonicalUrl);

  // 5. OpenGraph
  setMetaTag('property', 'og:site_name', 'ErrorEase');
  setMetaTag('property', 'og:type', config.ogType || 'website');
  setMetaTag('property', 'og:title', config.title);
  setMetaTag('property', 'og:description', config.description);
  setMetaTag('property', 'og:url', config.canonicalUrl);
  if (config.imageUrl) {
    setMetaTag('property', 'og:image', config.imageUrl);
  }

  // 6. Twitter
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', config.title);
  setMetaTag('name', 'twitter:description', config.description);
  if (config.imageUrl) {
    setMetaTag('name', 'twitter:image', config.imageUrl);
  }

  // 7. Article specific OpenGraph metadata
  if (config.ogType === 'article') {
    setMetaTag('property', 'article:published_time', config.publishedTime);
    setMetaTag('property', 'article:modified_time', config.modifiedTime || config.publishedTime);
    setMetaTag('property', 'article:author', config.authorName);
    setMetaTag('property', 'article:section', config.section);
  } else {
    setMetaTag('property', 'article:published_time', undefined);
    setMetaTag('property', 'article:modified_time', undefined);
    setMetaTag('property', 'article:author', undefined);
    setMetaTag('property', 'article:section', undefined);
  }

  // 8. Schema.org JSON-LD
  setJsonLd(config.jsonLd);
}
