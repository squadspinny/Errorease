import React, { useState } from 'react';
import { getSitemapData, generateSitemapXml } from '../lib/articles';
import { Post } from '../types';
import { PageSlug } from './Footer';
import { ArrowLeft, Map, Copy, Check, FileText, Folder, Calendar } from 'lucide-react';

interface SitemapViewProps {
  onBackToHome: () => void;
  onSelectPost: (post: Post) => void;
  onSelectCategory: (categorySlug: string) => void;
  onNavigatePage?: (page: PageSlug) => void;
}

export const SitemapView: React.FC<SitemapViewProps> = ({
  onBackToHome,
  onSelectPost,
  onSelectCategory,
  onNavigatePage,
}) => {
  const [showXml, setShowXml] = useState(false);
  const [copiedXml, setCopiedXml] = useState(false);

  const sitemapData = getSitemapData();
  const xmlString = generateSitemapXml();

  const handleCopyXml = () => {
    navigator.clipboard.writeText(xmlString);
    setCopiedXml(true);
    setTimeout(() => setCopiedXml(false), 2500);
  };

  return (
    <div className="w-full pb-16">
      {/* Breadcrumb Bar */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
        <button
          onClick={onBackToHome}
          className="hover:text-[#00a877] transition-colors flex items-center gap-1 font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>
        <span className="text-slate-400">/</span>
        <span className="text-slate-700 font-medium">Sitemap</span>
      </nav>

      {/* Main Container */}
      <div 
        style={{ borderRadius: '1px' }}
        className="bg-white border border-slate-200 p-4 sm:p-8 shadow-2xs w-full"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00a877]/10 text-[#00a877] flex items-center justify-center" style={{ borderRadius: '1px' }}>
              <Map className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Website Sitemap
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                All discovered articles, categories, and reference pages on ErrorEase.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowXml(!showXml)}
              style={{ borderRadius: '1px' }}
              className="px-3.5 py-1.5 text-xs font-bold border border-slate-300 hover:border-slate-400 text-slate-700 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {showXml ? 'Hide XML' : 'View sitemap.xml'}
            </button>
            {showXml && (
              <button
                onClick={handleCopyXml}
                style={{ borderRadius: '1px' }}
                className="px-3.5 py-1.5 text-xs font-bold bg-[#00a877] hover:bg-[#009368] text-white transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {copiedXml ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedXml ? 'Copied XML' : 'Copy XML'}</span>
              </button>
            )}
          </div>
        </div>

        {showXml && (
          <div 
            style={{ borderRadius: '1px' }}
            className="mb-8 p-3 bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800"
          >
            <pre className="whitespace-pre leading-relaxed">{xmlString}</pre>
          </div>
        )}

        {/* Section 1: Categories */}
        <section className="mb-8">
          <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Folder className="w-4 h-4 text-[#00a877]" />
            <span>Categories ({sitemapData.categoryEntries.length})</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {sitemapData.categoryEntries.map((c) => {
              const slug = c.url.replace(/^\//, '');
              return (
                <button
                  key={c.url}
                  onClick={() => onSelectCategory(slug)}
                  style={{ borderRadius: '1px' }}
                  className="p-2.5 text-left bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition-colors text-xs font-semibold text-slate-800 hover:text-[#00a877] cursor-pointer"
                >
                  {c.title}
                </button>
              );
            })}
          </div>
        </section>

        {/* Section 2: Articles */}
        <section className="mb-8">
          <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#00a877]" />
            <span>All Published Articles ({sitemapData.articleEntries.length})</span>
          </h2>
          <div className="divide-y divide-slate-100 border border-slate-200" style={{ borderRadius: '1px' }}>
            {sitemapData.articleEntries.map((a) => {
              const slug = a.url.replace(/^\//, '');
              return (
                <div
                  key={a.url}
                  className="p-3 sm:p-3.5 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4 flex-wrap"
                >
                  <div className="min-w-0 flex-1">
                    <a
                      href={a.url}
                      onClick={(e) => {
                        e.preventDefault();
                        const all = (window as unknown as { __ERROREASE_ARTICLES__?: Post[] }).__ERROREASE_ARTICLES__ || [];
                        const found = all.find((p) => p.slug === slug);
                        if (found) onSelectPost(found);
                      }}
                      className="text-xs sm:text-sm font-bold text-slate-900 hover:text-[#00a877] transition-colors cursor-pointer"
                    >
                      {a.title}
                    </a>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                      <span className="text-[#00a877] font-semibold">{a.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {a.publishedDate}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Priority: {a.priority}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 3: Static Pages */}
        <section>
          <h2 className="text-base font-bold text-slate-900 mb-3">
            Company & Policy Pages
          </h2>
          <div className="flex flex-wrap gap-2 text-xs">
            {sitemapData.staticPages.map((p) => {
              const pageSlug = p.url.replace(/^\//, '') as PageSlug;
              return (
                <a
                  key={p.url}
                  href={p.url}
                  onClick={(e) => {
                    e.preventDefault();
                    if (onNavigatePage) {
                      onNavigatePage(pageSlug);
                    }
                  }}
                  style={{ borderRadius: '1px' }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
                >
                  {p.title}
                </a>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
