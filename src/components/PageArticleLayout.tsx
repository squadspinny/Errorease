import React, { useState } from 'react';
import { Post } from '../types';
import { 
  Calendar, 
  Share2, 
  Check, 
  Zap, 
  ArrowLeft, 
  ChevronRight 
} from 'lucide-react';

export interface PageArticleLayoutProps {
  pageTitle: string;
  categoryTag?: string;
  featuredImage?: string;
  publishedDate?: string;
  onBackToHome: () => void;
  allPosts: Post[];
  onSelectPost: (post: Post) => void;
  children: React.ReactNode;
}

export const PageArticleLayout: React.FC<PageArticleLayoutProps> = ({
  pageTitle,
  categoryTag = 'Editorial Desk',
  featuredImage,
  publishedDate = 'September 2026',
  onBackToHome,
  allPosts,
  onSelectPost,
  children,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  const displayedSidebarPosts = allPosts.slice(0, 6);

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="w-full pb-16">
      {/* Breadcrumb Bar */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-4 flex-wrap">
        <button 
          onClick={onBackToHome}
          className="hover:text-[#00a877] transition-colors flex items-center gap-1 font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="text-slate-700 font-medium truncate max-w-xs sm:max-w-md">
          {pageTitle}
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

          {/* Article Container Card - 1px border-radius, same as post */}
          <article 
            style={{ borderRadius: '1px' }}
            className="bg-white border border-slate-200 p-3 sm:p-6 md:p-8 shadow-2xs w-full overflow-hidden"
          >
            
            {/* Category Tag with Lightning Bolt */}
            <div className="flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-[#00a877] mb-2 sm:mb-2.5">
              <Zap className="w-3.5 h-3.5 fill-[#00a877] text-[#00a877]" />
              <span>{categoryTag}</span>
            </div>

            {/* Article Headline */}
            <h1 className="text-lg sm:text-2xl md:text-[28px] font-black text-slate-900 leading-snug tracking-tight mb-3 sm:mb-4 break-words">
              {pageTitle}
            </h1>

            {/* Author and Date Meta Row with Share Button */}
            <div className="flex items-center justify-between gap-3 pb-3 flex-wrap">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&h=240&q=80"
                  alt="Pradeep Bijarniya"
                  style={{ borderRadius: '1px' }}
                  className="w-9 h-9 sm:w-10 sm:h-10 object-cover border border-slate-200 shrink-0"
                />
                <div className="text-xs sm:text-[13px] leading-tight">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <span>By Pradeep Bijarniya</span>
                    <span 
                      style={{ borderRadius: '1px' }}
                      className="inline-flex items-center justify-center w-3.5 h-3.5 bg-[#1d9bf0] text-white shrink-0 shadow-2xs" 
                      title="Verified Author"
                    >
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  </div>
                  <div className="text-slate-600 text-[11px] sm:text-xs font-medium mt-1">
                    On: {publishedDate}
                  </div>
                </div>
              </div>

              {/* Right: Black Share Button */}
              <div className="relative ml-auto">
                <button
                  onClick={handleCopyShareLink}
                  style={{ borderRadius: '1px' }}
                  className="w-8 h-8 bg-black hover:bg-slate-800 text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                  title="Share Page"
                  aria-label="Share page"
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
            {featuredImage && (
              <div 
                style={{ borderRadius: '1px' }}
                className="w-full overflow-hidden my-3 sm:my-5 bg-slate-100 border border-slate-200/60"
              >
                <img
                  src={featuredImage}
                  alt={pageTitle}
                  style={{ borderRadius: '1px' }}
                  className="w-full aspect-[16/10] sm:aspect-[16/9] object-cover"
                />
              </div>
            )}

            {/* Middle In-Article Advertisement Slot */}
            <div 
              style={{ borderRadius: '1px' }}
              className="w-full bg-[#f1f2f4] py-3.5 sm:py-4 text-center my-4 sm:my-6 border border-slate-200/60"
            >
              <span className="text-[11px] sm:text-xs text-slate-500 font-mono tracking-widest select-none">
                ---Advertisement---
              </span>
            </div>

            {/* Content Body */}
            <div className="text-slate-800 leading-relaxed text-sm sm:text-base space-y-5 font-normal">
              {children}
            </div>

            {/* Bottom Actions Row */}
            <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
              <button
                onClick={onBackToHome}
                style={{ borderRadius: '1px' }}
                className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 hover:border-slate-400 transition-all cursor-pointer shadow-2xs active:scale-98"
              >
                <ArrowLeft className="w-4 h-4 text-slate-700" />
                <span>Back to Articles</span>
              </button>

              <div className="text-xs text-slate-500 font-medium">
                Errorease Editorial • Verified Guide
              </div>
            </div>

          </article>
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
                    src={latest.imageUrl}
                    alt={latest.title}
                    style={{ borderRadius: '1px' }}
                    className="w-20 h-14 sm:w-22 sm:h-15 object-cover shrink-0 bg-slate-100 group-hover:opacity-90 transition-opacity border border-slate-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-[#00a877] transition-colors mb-1">
                      {latest.title}
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
