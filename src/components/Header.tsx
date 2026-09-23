import React, { useState } from 'react';
import { Search, Menu, X, Bookmark } from 'lucide-react';

interface HeaderProps {
  activeCategory: string | null;
  onSelectCategory: (categorySlug: string | null) => void;
  onOpenSearch: () => void;
  onResetHome: () => void;
  savedCount?: number;
  onOpenBookmarks?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  onSelectCategory,
  onOpenSearch,
  onResetHome,
  savedCount = 0,
  onOpenBookmarks,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Windows', slug: 'windows' },
    { label: 'Browsers', slug: 'browsers' },
    { label: 'Network & DNS', slug: 'network-dns' },
    { label: 'Programming', slug: 'programming' },
    { label: 'Software', slug: 'software' },
    { label: 'Guides', slug: 'guides' },
  ];

  return (
    <header className="w-full bg-white border-b border-slate-100 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Brand Logo: Errorease Logo Image */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onResetHome();
          }}
          className="hover:opacity-90 transition-opacity cursor-pointer flex items-center py-1 shrink-0"
          title="Errorease - Home"
          aria-label="Errorease Home"
        >
          <img
            src="/errorease-logo.png"
            alt="Errorease"
            className="h-8 sm:h-9 w-auto object-contain"
          />
        </a>

        {/* Desktop Navigation Links & Search */}
        <div className="hidden md:flex items-center gap-4 lg:gap-7">
          <nav className="flex items-center gap-3.5 lg:gap-6 text-xs sm:text-[13px] font-bold text-slate-800">
            {navLinks.map((link) => {
              const isActive = activeCategory === link.slug;
              return (
                <a
                  key={link.label}
                  href={`/${link.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectCategory(isActive ? null : link.slug);
                  }}
                  className={`transition-colors cursor-pointer whitespace-nowrap hover:text-[#00a877] ${
                    isActive ? 'text-[#00a877]' : 'text-slate-800'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {/* Bookmarks Quick Access */}
            {onOpenBookmarks && (
              <button
                onClick={onOpenBookmarks}
                className={`p-1.5 transition-colors cursor-pointer relative ${
                  activeCategory === 'bookmarks' ? 'text-[#00a877]' : 'text-slate-800 hover:text-[#00a877]'
                }`}
                title="Bookmarked articles"
                aria-label="Bookmarks"
              >
                <Bookmark className={`w-4 h-4 stroke-[2.5] ${savedCount > 0 ? 'fill-[#00a877] text-[#00a877]' : ''}`} />
                {savedCount > 0 && (
                  <span 
                    style={{ borderRadius: '1px' }}
                    className="absolute -top-1 -right-2 bg-[#00a877] text-white text-[9px] font-bold px-1 py-0.2 min-w-[15px] h-3.5 flex items-center justify-center leading-none"
                  >
                    {savedCount}
                  </span>
                )}
              </button>
            )}

            {/* Search Button (Simple & clean) */}
            <button
              onClick={onOpenSearch}
              style={{ borderRadius: '1px' }}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
              title="Search articles (Ctrl+K)"
              aria-label="Search articles"
            >
              <Search className="w-3.5 h-3.5 text-[#00a877] stroke-[2.5]" />
              <span className="hidden lg:inline font-medium text-slate-600">Search</span>
              <kbd className="hidden lg:inline text-[9px] text-slate-400 bg-white px-1 py-0.2 border border-slate-200 font-mono leading-none">⌘K</kbd>
            </button>
          </div>
        </div>

        {/* Mobile Actions: Search, Bookmark & Hamburger */}
        <div className="flex md:hidden items-center gap-1.5">
          {onOpenBookmarks && (
            <button
              onClick={onOpenBookmarks}
              className={`p-2 transition-colors relative ${
                activeCategory === 'bookmarks' ? 'text-[#00a877]' : 'text-slate-700 hover:text-[#00a877]'
              }`}
              title="Bookmarked articles"
              aria-label="Bookmarks"
            >
              <Bookmark className={`w-5 h-5 stroke-[2.5] ${savedCount > 0 ? 'fill-[#00a877] text-[#00a877]' : ''}`} />
              {savedCount > 0 && (
                <span 
                  style={{ borderRadius: '1px' }}
                  className="absolute top-1 right-0.5 bg-[#00a877] text-white text-[9px] font-bold px-1 py-0.2 min-w-[14px] h-3.5 flex items-center justify-center leading-none"
                >
                  {savedCount}
                </span>
              )}
            </button>
          )}

          <button
            onClick={onOpenSearch}
            className="p-2 text-slate-700 hover:text-[#00a877] transition-colors"
            title="Search articles"
            aria-label="Search"
          >
            <Search className="w-5 h-5 stroke-[2.5]" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-[#00a877] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-3 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={`/${link.slug}`}
              onClick={(e) => {
                e.preventDefault();
                onSelectCategory(link.slug);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left py-2 text-sm font-semibold border-b border-slate-50 ${
                activeCategory === link.slug ? 'text-[#00a877]' : 'text-slate-700'
              }`}
            >
              {link.label}
            </a>
          ))}
          {onOpenBookmarks && (
            <button
              onClick={() => {
                onOpenBookmarks();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-between w-full text-left py-2 text-sm font-semibold text-slate-700 hover:text-[#00a877]"
            >
              <span className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-[#00a877]" />
                Bookmarked Articles
              </span>
              {savedCount > 0 && (
                <span 
                  style={{ borderRadius: '1px' }}
                  className="bg-[#00a877] text-white text-xs font-bold px-2 py-0.5"
                >
                  {savedCount}
                </span>
              )}
            </button>
          )}
        </div>
      )}
    </header>
  );
};
