import React, { useState, useMemo, useEffect } from 'react';
import { Post, ArticleContentItem } from '../types';
import { getRelatedArticles } from '../lib/articles';
import { TableOfContents, TocItem, slugifyHeading } from './TableOfContents';
import { 
  Calendar, 
  Share2, 
  Check, 
  Copy, 
  Zap, 
  ArrowLeft, 
  ChevronRight,
  Bookmark,
  AlertTriangle,
  Lightbulb,
  Info,
  CheckCircle2,
  HelpCircle,
  Clock,
  ExternalLink
} from 'lucide-react';

interface ArticleViewProps {
  post: Post;
  allPosts?: Post[];
  onBack: () => void;
  onSelectCategory: (categorySlug: string) => void;
  onSelectPost: (post: Post) => void;
  isSaved: boolean;
  onToggleSave: (postSlug: string) => void;
  onViewBookmarks?: () => void;
}

export const ArticleView: React.FC<ArticleViewProps> = ({
  post,
  allPosts = [],
  onBack,
  onSelectCategory,
  onSelectPost,
  isSaved,
  onToggleSave,
  onViewBookmarks,
}) => {
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Safe author resolution
  const author = typeof post.author === 'string'
    ? {
        name: post.author,
        role: 'Technical Contributor',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80',
        isVerified: true
      }
    : {
        name: post.author?.name || 'ErrorEase Team',
        role: post.author?.role || 'Technical Contributor',
        avatar: post.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80',
        isVerified: post.author?.isVerified ?? true
      };

  const featuredImgUrl = post.featuredImage?.src || post.imageUrl || 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&h=500&q=80';

  // Sidebar latest posts (excluding current post if possible, up to 6)
  const sidebarLatestPosts = (allPosts.length > 0 ? allPosts : [post])
    .filter((p) => p.id !== post.id && p.slug !== post.slug)
    .slice(0, 6);

  const displayedSidebarPosts = sidebarLatestPosts.length >= 4 
    ? sidebarLatestPosts 
    : (allPosts.length > 0 ? allPosts.filter(p => p.slug !== post.slug).slice(0, 6) : [post]);

  // Safe related articles
  const relatedArticles = getRelatedArticles(post, 3);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(id);
    setTimeout(() => setCopiedCodeIndex(null), 2500);
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleBookmarkClick = () => {
    const nextSavedState = !isSaved;
    onToggleSave(post.slug);
    setToastMessage(nextSavedState ? 'Article saved to bookmarks!' : 'Article removed from bookmarks');
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Automatically generate Table of Contents items and unique heading anchors
  const { tocItems, headingIdMap } = useMemo(() => {
    const items: TocItem[] = [];
    const idMap = new Map<number, string>();
    const idCounts: Record<string, number> = {};

    (post.content || []).forEach((item, index) => {
      if (item.type === 'heading' && (item.level === 2 || item.level === 3 || item.level === 4)) {
        const rawText = item.text || 'Section';
        const baseSlug = (item.id && item.id.trim()) ? item.id.trim() : slugifyHeading(rawText);
        idCounts[baseSlug] = (idCounts[baseSlug] || 0) + 1;
        const uniqueId = idCounts[baseSlug] === 1 ? baseSlug : `${baseSlug}-${idCounts[baseSlug]}`;

        idMap.set(index, uniqueId);
        items.push({
          id: uniqueId,
          text: rawText,
          level: item.level,
        });
      } else if (item.type === 'method' && item.title) {
        const rawText = item.title;
        const baseSlug = (item.id && item.id.trim()) ? item.id.trim() : slugifyHeading(rawText);
        idCounts[baseSlug] = (idCounts[baseSlug] || 0) + 1;
        const uniqueId = idCounts[baseSlug] === 1 ? baseSlug : `${baseSlug}-${idCounts[baseSlug]}`;

        idMap.set(index, uniqueId);
        items.push({
          id: uniqueId,
          text: rawText,
          level: 2,
        });
      }
    });

    return { tocItems: items, headingIdMap: idMap };
  }, [post.content]);

  // Support direct URL hash navigation when jumping to an anchor
  useEffect(() => {
    if (window.location.hash) {
      const targetId = window.location.hash.slice(1);
      const el = document.getElementById(targetId);
      if (el) {
        const timeout = setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
        return () => clearTimeout(timeout);
      }
    }
  }, [post.slug]);

  /**
   * Data-Driven Generic Section Renderer
   */
  const renderContentItem = (item: ArticleContentItem, idx: number) => {
    switch (item.type) {
      case 'heading': {
        const HeadingTag = item.level === 3 ? 'h3' : item.level === 4 ? 'h4' : 'h2';
        const headingId = headingIdMap.get(idx) || item.id || slugifyHeading(item.text);
        const classes =
          item.level === 3
            ? 'text-base sm:text-lg font-bold text-slate-900 pt-3 pb-1 tracking-tight scroll-mt-20 sm:scroll-mt-24'
            : item.level === 4
            ? 'text-sm sm:text-base font-bold text-slate-900 pt-2 pb-0.5 tracking-tight scroll-mt-20 sm:scroll-mt-24'
            : 'text-base sm:text-xl font-bold text-slate-900 pt-4 pb-1 tracking-tight scroll-mt-20 sm:scroll-mt-24';

        return (
          <HeadingTag key={idx} id={headingId} className={classes}>
            {item.text}
          </HeadingTag>
        );
      }

      case 'paragraph':
        return (
          <p key={idx} className="text-slate-800 leading-relaxed text-sm sm:text-[15px]">
            {item.text}
          </p>
        );

      case 'steps':
        return (
          <div key={idx} className="space-y-2.5 my-3">
            {item.title && (
              <h4 className="font-bold text-slate-900 text-sm sm:text-[15px] mb-1.5">{item.title}</h4>
            )}
            <ol className="space-y-2.5 text-slate-700 text-sm sm:text-[15px]">
              {item.items.map((step, sIdx) => (
                <li key={sIdx} className="flex items-start gap-2.5 leading-relaxed">
                  <span
                    style={{ borderRadius: '1px' }}
                    className="flex items-center justify-center w-5 h-5 bg-[#00a877]/10 text-[#00a877] font-bold text-xs shrink-0 mt-0.5 font-mono select-none"
                  >
                    {sIdx + 1}
                  </span>
                  <span className="flex-1">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        );

      case 'list': {
        const ListTag = item.ordered ? 'ol' : 'ul';
        const listClasses = item.ordered
          ? 'list-decimal list-inside space-y-1.5 text-slate-700 text-sm sm:text-[15px] my-2 pl-2'
          : 'list-disc list-inside space-y-1.5 text-slate-700 text-sm sm:text-[15px] my-2 pl-2';

        return (
          <ListTag key={idx} className={listClasses}>
            {item.items.map((li, lIdx) => (
              <li key={lIdx} className="leading-relaxed">
                {li}
              </li>
            ))}
          </ListTag>
        );
      }

      case 'image':
        return (
          <figure
            key={idx}
            style={{ borderRadius: '1px' }}
            className="my-4 overflow-hidden border border-slate-200/80 bg-slate-50"
          >
            <img
              src={item.src}
              alt={item.alt || item.caption || post.title}
              loading="lazy"
              className="w-full h-auto object-cover max-h-[500px]"
            />
            {item.caption && (
              <figcaption className="text-center text-xs text-slate-500 py-2 px-3 italic bg-white border-t border-slate-100">
                {item.caption}
              </figcaption>
            )}
          </figure>
        );

      case 'code': {
        const snippetKey = `code-${idx}`;
        return (
          <div
            key={idx}
            style={{ borderRadius: '1px' }}
            className="my-3 overflow-hidden border border-slate-800 bg-slate-950"
          >
            {item.description && (
              <div className="px-3.5 py-1.5 bg-slate-900 text-slate-400 text-xs flex items-center justify-between border-b border-slate-800">
                <span>{item.description}</span>
                {item.language && (
                  <span className="uppercase text-[10px] font-mono font-bold text-slate-400">
                    {item.language}
                  </span>
                )}
              </div>
            )}
            <div className="p-3 relative">
              <pre className="text-xs sm:text-sm text-emerald-400 font-mono overflow-x-auto whitespace-pre leading-relaxed pr-16">
                {item.code}
              </pre>
              <button
                onClick={() => handleCopy(item.code, snippetKey)}
                style={{ borderRadius: '1px' }}
                className="absolute top-2.5 right-2.5 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer border border-slate-700"
              >
                {copiedCodeIndex === snippetKey ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        );
      }

      case 'warning':
        return (
          <div
            key={idx}
            style={{ borderRadius: '1px' }}
            className="p-3 sm:p-3.5 bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-2.5 my-3"
          >
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              {item.title && <div className="font-bold mb-0.5">{item.title}</div>}
              <p className="leading-relaxed">{item.text}</p>
            </div>
          </div>
        );

      case 'info':
      case 'note':
        return (
          <div
            key={idx}
            style={{ borderRadius: '1px' }}
            className="p-3 sm:p-3.5 bg-sky-50 border border-sky-200 text-sky-950 text-xs sm:text-sm flex items-start gap-2.5 my-3"
          >
            <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <div>
              {item.title && <div className="font-bold mb-0.5">{item.title}</div>}
              <p className="leading-relaxed">{item.text}</p>
            </div>
          </div>
        );

      case 'tip':
        return (
          <div
            key={idx}
            style={{ borderRadius: '1px' }}
            className="p-3 sm:p-3.5 bg-emerald-50/80 border border-emerald-200/80 text-emerald-900 text-xs sm:text-sm flex items-start gap-2.5 my-3"
          >
            <Lightbulb className="w-4 h-4 text-[#00a877] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <span className="font-bold">{item.title || 'Analyst Note'}: </span>
              {item.text}
            </p>
          </div>
        );

      case 'success':
        return (
          <div
            key={idx}
            style={{ borderRadius: '1px' }}
            className="p-3 sm:p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs sm:text-sm flex items-start gap-2.5 my-3"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              {item.title && <div className="font-bold mb-0.5">{item.title}</div>}
              <p className="leading-relaxed">{item.text}</p>
            </div>
          </div>
        );

      case 'link':
        return (
          <div key={idx} className="my-2">
            <a
              href={item.url}
              target={item.isExternal ? '_blank' : undefined}
              rel={item.isExternal ? 'noopener noreferrer' : undefined}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#00a877] hover:underline"
            >
              <span>{item.text}</span>
              {item.isExternal ? <ExternalLink className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </a>
            {item.description && <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>}
          </div>
        );

      case 'faq':
        return (
          <div
            key={idx}
            style={{ borderRadius: '1px' }}
            className="p-3 sm:p-4 bg-slate-50 border border-slate-200 my-2.5"
          >
            <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2 mb-1">
              <HelpCircle className="w-4 h-4 text-[#00a877] shrink-0" />
              <span>{item.question}</span>
            </h4>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed pl-6">{item.answer}</p>
          </div>
        );

      case 'method': {
        const methodId = headingIdMap.get(idx) || item.id || slugifyHeading(item.title);
        return (
          <section key={idx} className="space-y-3 pt-2">
            <h2 id={methodId} className="text-base sm:text-xl font-bold text-slate-900 pt-2 tracking-tight scroll-mt-20 sm:scroll-mt-24">
              {item.title}
            </h2>

            {item.warningNotice && (
              <div
                style={{ borderRadius: '1px' }}
                className="p-3 sm:p-3.5 bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-2.5"
              >
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>{item.warningNotice}</p>
              </div>
            )}

            <div className="space-y-2.5 text-slate-700 text-sm sm:text-[15px]">
              {item.steps.map((step, sIdx) => (
                <p key={sIdx} className="leading-relaxed">
                  {step}
                </p>
              ))}
            </div>

            {item.codeSnippets?.map((snippet, snIdx) => {
              const snippetKey = `${item.id || idx}-${snIdx}`;
              return (
                <div
                  key={snIdx}
                  style={{ borderRadius: '1px' }}
                  className="my-3 overflow-hidden border border-slate-800 bg-slate-950"
                >
                  {snippet.description && (
                    <div className="px-3.5 py-1.5 bg-slate-900 text-slate-400 text-xs flex items-center justify-between border-b border-slate-800">
                      <span>{snippet.description}</span>
                      <span className="uppercase text-[10px] font-mono font-bold text-slate-400">
                        {snippet.language}
                      </span>
                    </div>
                  )}
                  <div className="p-3 relative">
                    <pre className="text-xs sm:text-sm text-emerald-400 font-mono overflow-x-auto whitespace-pre leading-relaxed pr-16">
                      {snippet.code}
                    </pre>
                    <button
                      onClick={() => handleCopy(snippet.code, snippetKey)}
                      style={{ borderRadius: '1px' }}
                      className="absolute top-2.5 right-2.5 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer border border-slate-700"
                    >
                      {copiedCodeIndex === snippetKey ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}

            {item.proTip && (
              <div
                style={{ borderRadius: '1px' }}
                className="p-3 sm:p-3.5 bg-emerald-50/80 border border-emerald-200/80 text-emerald-900 text-xs sm:text-sm flex items-start gap-2.5"
              >
                <Lightbulb className="w-4 h-4 text-[#00a877] shrink-0 mt-0.5" />
                <p>
                  <span className="font-bold">Analyst Note: </span>
                  {item.proTip}
                </p>
              </div>
            )}
          </section>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="w-full pb-16">
      {/* Breadcrumb Bar */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-4 flex-wrap" aria-label="Breadcrumb">
        <a 
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onBack();
          }}
          className="hover:text-[#00a877] transition-colors flex items-center gap-1 font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </a>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <a
          href={`/${post.categorySlug}`}
          onClick={(e) => {
            e.preventDefault();
            onSelectCategory(post.categorySlug);
          }}
          className="hover:text-[#00a877] transition-colors font-medium cursor-pointer"
        >
          {post.category}
        </a>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="text-slate-700 font-medium truncate max-w-xs sm:max-w-md">
          {post.title}
        </span>
      </nav>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        
        {/* Left Column (Main Article) */}
        <div className="lg:col-span-8 flex flex-col min-w-0">
          
          {/* Top Main Advertisement Slot */}
          <div 
            style={{ borderRadius: '1px' }}
            className="w-full bg-[#f1f2f4] py-3.5 sm:py-5 text-center mb-4 sm:mb-5 border border-slate-200/60"
          >
            <span className="text-[11px] sm:text-xs text-slate-500 font-mono tracking-widest select-none">
              ---Advertisement---
            </span>
          </div>

          {/* Article Container Card - 1px border-radius thin, mobile friendly */}
          <article 
            style={{ borderRadius: '1px' }}
            className="bg-white border border-slate-200 p-3 sm:p-6 md:p-8 shadow-2xs w-full overflow-hidden"
          >
            
            {/* Category Tag with Lightning Bolt */}
            <div className="flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-[#00a877] mb-2 sm:mb-2.5">
              <Zap className="w-3.5 h-3.5 fill-[#00a877] text-[#00a877]" />
              <button 
                onClick={() => onSelectCategory(post.categorySlug)}
                className="hover:underline cursor-pointer"
              >
                {post.category}
              </button>
            </div>

            {/* Article Headline */}
            <h1 className="text-lg sm:text-2xl md:text-[28px] font-black text-slate-900 leading-snug tracking-tight mb-3 sm:mb-4 break-words">
              {post.title}
            </h1>

            {/* Author and Date Meta Row with Share Button */}
            <div className="flex items-center justify-between gap-3 pb-3 flex-wrap border-b border-slate-100">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <img
                  src={author.avatar}
                  alt={author.name}
                  style={{ borderRadius: '1px' }}
                  className="w-9 h-9 sm:w-10 sm:h-10 object-cover border border-slate-200 shrink-0"
                />
                <div className="text-xs sm:text-[13px] leading-tight">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <span>By {author.name}</span>
                    {author.isVerified && (
                      <span 
                        style={{ borderRadius: '1px' }}
                        className="inline-flex items-center justify-center w-3.5 h-3.5 bg-[#1d9bf0] text-white shrink-0 shadow-2xs" 
                        title="Verified Author"
                      >
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <div className="text-slate-600 text-[11px] sm:text-xs font-medium mt-1 flex items-center gap-2">
                    <span>On: {post.publishedDate}</span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {post.readingTime || post.readTime || '5 min read'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Black Share Button */}
              <div className="relative ml-auto">
                <button
                  onClick={handleCopyShareLink}
                  style={{ borderRadius: '1px' }}
                  className="w-8 h-8 bg-black hover:bg-slate-800 text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                  title="Share Article"
                  aria-label="Share article"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                {copiedLink && (
                  <span 
                    style={{ borderRadius: '1px' }}
                    className="absolute right-0 top-10 whitespace-nowrap bg-slate-900 text-white text-[11px] font-medium px-2 py-1 shadow-md z-20 border border-slate-700"
                  >
                    Link copied!
                  </span>
                )}
              </div>
            </div>

            {/* Featured Image */}
            <div 
              style={{ borderRadius: '1px' }}
              className="w-full overflow-hidden my-3 sm:my-5 bg-slate-100 border border-slate-200/60"
            >
              <img
                src={featuredImgUrl}
                alt={post.featuredImage?.alt || post.title}
                style={{ borderRadius: '1px' }}
                className="w-full aspect-[16/10] sm:aspect-[16/9] object-cover"
              />
              {post.featuredImage?.caption && (
                <div className="text-center text-xs text-slate-500 py-1.5 px-3 italic bg-slate-50 border-t border-slate-200/60">
                  {post.featuredImage.caption}
                </div>
              )}
            </div>

            {/* Middle In-Article Advertisement Slot */}
            <div 
              style={{ borderRadius: '1px' }}
              className="w-full bg-[#f1f2f4] py-3.5 sm:py-4 text-center my-4 sm:my-6 border border-slate-200/60"
            >
              <span className="text-[11px] sm:text-xs text-slate-500 font-mono tracking-widest select-none">
                ---Advertisement---
              </span>
            </div>

            {/* Complete Data-Driven Article Content Body */}
            <div className="text-slate-800 leading-relaxed text-sm sm:text-base space-y-3 font-normal">
              {/* Table of Contents - Very first content element before the introduction/first paragraph */}
              {tocItems.length > 0 && (
                <TableOfContents items={tocItems} />
              )}

              {post.content && post.content.length > 0 ? (
                post.content.map((item, idx) => renderContentItem(item, idx))
              ) : (
                <p className="text-slate-800 leading-relaxed text-sm sm:text-[15px]">
                  {post.excerpt}
                </p>
              )}
            </div>

            {/* FAQs Section (if present) */}
            {post.faqs && post.faqs.length > 0 && (
              <section id="faqs-section" className="mt-8 pt-6 border-t border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="w-5 h-5 text-[#00a877]" />
                  <h3 id="faqs" className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight scroll-mt-20 sm:scroll-mt-24">
                    Frequently Asked Questions
                  </h3>
                </div>

                <div className="space-y-3">
                  {post.faqs.map((faq, fIdx) => {
                    const isOpen = openFaqIndex === fIdx;
                    return (
                      <div 
                        key={fIdx}
                        style={{ borderRadius: '1px' }}
                        className="border border-slate-200 overflow-hidden bg-slate-50/50"
                      >
                        <button
                          onClick={() => setOpenFaqIndex(isOpen ? null : fIdx)}
                          className="w-full text-left p-3.5 sm:p-4 flex items-center justify-between gap-3 font-bold text-slate-900 hover:text-[#00a877] transition-colors cursor-pointer"
                        >
                          <span className="text-sm sm:text-[15px]">{faq.question}</span>
                          <span className="text-slate-400 font-mono text-sm shrink-0">
                            {isOpen ? '−' : '+'}
                          </span>
                        </button>
                        {isOpen && (
                          <div className="px-3.5 pb-4 pt-1 sm:px-4 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-slate-200/60 bg-white">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Tags Row */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tags:</span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{ borderRadius: '1px' }}
                    className="text-xs px-2.5 py-1 bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Bottom Actions - Bookmark & View Saved */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBookmarkClick}
                  style={{ borderRadius: '1px' }}
                  className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold border transition-all cursor-pointer shadow-2xs active:scale-98 ${
                    isSaved
                      ? 'bg-emerald-50 border-emerald-300 text-[#00a877] hover:bg-emerald-100'
                      : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800 hover:border-slate-400'
                  }`}
                  title={isSaved ? 'Remove from bookmarks' : 'Bookmark this article'}
                >
                  <Bookmark className={`w-4 h-4 transition-transform duration-150 ${isSaved ? 'fill-[#00a877] text-[#00a877]' : 'text-slate-700'}`} />
                  <span>{isSaved ? 'Saved to Bookmarks' : 'Bookmark Article'}</span>
                </button>

                {toastMessage && (
                  <span 
                    style={{ borderRadius: '1px' }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium animate-in fade-in duration-150 shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{toastMessage}</span>
                  </span>
                )}
              </div>

              {onViewBookmarks && (
                <button
                  onClick={onViewBookmarks}
                  style={{ borderRadius: '1px' }}
                  className="text-xs font-semibold text-slate-600 hover:text-[#00a877] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>View Saved Articles</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </article>

          {/* Related Articles Section (Bottom of Left Column) */}
          {relatedArticles.length > 0 && (
            <section className="mt-8">
              <div 
                style={{ borderRadius: '1px' }}
                className="w-full bg-white border border-slate-200 p-4 sm:p-6 shadow-2xs"
              >
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#00a877] inline-block" style={{ borderRadius: '1px' }}></span>
                    <span>Related Troubleshooting Articles</span>
                  </h3>
                  <button
                    onClick={() => onSelectCategory(post.categorySlug)}
                    className="text-xs font-semibold text-[#00a877] hover:underline cursor-pointer"
                  >
                    View all in {post.category}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {relatedArticles.map((rel) => (
                    <article
                      key={rel.id}
                      onClick={() => {
                        onSelectPost(rel);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="group cursor-pointer flex flex-col"
                    >
                      <div 
                        style={{ borderRadius: '1px' }}
                        className="w-full aspect-[16/10] overflow-hidden bg-slate-100 border border-slate-100 mb-2"
                      >
                        <img
                          src={rel.featuredImage?.src || rel.imageUrl}
                          alt={rel.title}
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
                        />
                      </div>
                      <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 group-hover:text-[#00a877] transition-colors line-clamp-2 leading-snug">
                        <a
                          href={`/${rel.slug}`}
                          onClick={(e) => {
                            e.preventDefault();
                            onSelectPost(rel);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                        >
                          {rel.title}
                        </a>
                      </h4>
                      <span className="text-[11px] text-slate-500 mt-1">
                        {rel.publishedDate}
                      </span>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          )}

        </div>

        {/* Right Sidebar Column */}
        <aside className="lg:col-span-4 space-y-5 sm:space-y-6">
          
          {/* Top Sidebar Advertisement Slot */}
          <div 
            style={{ borderRadius: '1px' }}
            className="w-full bg-[#f1f2f4] min-h-[220px] sm:min-h-[260px] flex items-center justify-center text-center p-4 border border-slate-200/60"
          >
            <span className="text-[11px] sm:text-xs text-slate-400 font-mono tracking-widest select-none">
              ---Advertisement---
            </span>
          </div>

          {/* Latest Posts Widget Card */}
          <div 
            style={{ borderRadius: '1px' }}
            className="bg-white border border-slate-200 p-3.5 sm:p-5 shadow-2xs"
          >
            
            {/* Green Header Banner */}
            <div 
              style={{ borderRadius: '1px' }}
              className="w-full bg-[#00a877] text-white py-2 px-3 text-center font-bold text-sm sm:text-base tracking-wide mb-3 shadow-2xs"
            >
              Latest Posts
            </div>

            {/* Posts List */}
            <div className="divide-y divide-slate-100">
              {displayedSidebarPosts.map((latest) => (
                <article
                  key={latest.id}
                  onClick={() => {
                    onSelectPost(latest);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="py-3 first:pt-1 last:pb-1 flex items-center gap-3 group cursor-pointer"
                >
                  <img
                    src={latest.featuredImage?.src || latest.imageUrl}
                    alt={latest.title}
                    style={{ borderRadius: '1px' }}
                    className="w-20 h-14 sm:w-22 sm:h-15 object-cover shrink-0 bg-slate-100 group-hover:opacity-90 transition-opacity border border-slate-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-[#00a877] transition-colors mb-1">
                      <a
                        href={`/${latest.slug}`}
                        onClick={(e) => {
                          e.preventDefault();
                          onSelectPost(latest);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        {latest.title}
                      </a>
                    </h4>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{latest.publishedDate}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

          </div>

          {/* Bottom Sidebar Advertisement Slot */}
          <div 
            style={{ borderRadius: '1px' }}
            className="w-full bg-[#f1f2f4] min-h-[180px] sm:min-h-[200px] flex items-center justify-center text-center p-4 border border-slate-200/60"
          >
            <span className="text-[11px] sm:text-xs text-slate-400 font-mono tracking-widest select-none">
              ---Advertisement---
            </span>
          </div>

        </aside>

      </div>
    </div>
  );
};
