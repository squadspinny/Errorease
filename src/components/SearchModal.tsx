import React, { useState, useEffect, useRef } from 'react';
import { Post } from '../types';
import { searchArticles } from '../lib/articles';
import { Search, X, Calendar, ArrowRight, Sparkles } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: Post[];
  onSelectPost: (post: Post) => void;
}

const POPULAR_SEARCHES = [
  'Windows 11',
  'Tata Motors',
  'Term Insurance',
  'Car Loan',
  'iPhone 16',
  'BSOD Fix'
];

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  posts,
  onSelectPost,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filtered = q ? searchArticles(q) : [];

  const handleKeyDownInput = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && filtered.length > 0) {
      onSelectPost(filtered[0]);
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-4 bg-slate-900/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div 
        style={{ borderRadius: '1px' }}
        className="w-full max-w-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Simple Search Input Bar */}
        <div className="relative border-b border-slate-200 p-3.5 sm:p-4 flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-[#00a877] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDownInput}
            placeholder="Search articles by title, topic, or keyword..."
            className="w-full text-sm sm:text-base text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ borderRadius: '1px' }}
              className="p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            style={{ borderRadius: '1px' }}
            className="px-2 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer ml-1"
          >
            ESC
          </button>
        </div>

        {/* Modal Body */}
        <div className="max-h-[60vh] overflow-y-auto">
          {/* Case 1: No query entered yet -> show popular searches & recent articles */}
          {!q && (
            <div className="p-4 sm:p-5 space-y-5">
              {/* Popular Searches */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#00a877]" />
                  <span>Popular Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((item) => (
                    <button
                      key={item}
                      onClick={() => setQuery(item)}
                      style={{ borderRadius: '1px' }}
                      className="px-3 py-1.5 bg-slate-50 hover:bg-[#00a877]/10 text-slate-700 hover:text-[#00a877] text-xs font-medium border border-slate-200 hover:border-[#00a877]/40 transition-colors cursor-pointer"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Articles */}
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                  Recent Articles
                </div>
                <div className="divide-y divide-slate-100 border border-slate-100" style={{ borderRadius: '1px' }}>
                  {posts.slice(0, 4).map((post) => (
                    <div
                      key={post.id}
                      onClick={() => {
                        onSelectPost(post);
                        onClose();
                      }}
                      className="p-3 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-3 group"
                    >
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        style={{ borderRadius: '1px' }}
                        className="w-14 h-11 object-cover shrink-0 bg-slate-100 border border-slate-200"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span 
                            style={{ borderRadius: '1px' }}
                            className="text-[10px] font-bold uppercase tracking-wider text-[#00a877] bg-[#00a877]/10 px-1.5 py-0.2"
                          >
                            {post.category}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 group-hover:text-[#00a877] transition-colors truncate">
                          {post.title}
                        </h4>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#00a877] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Case 2: Query entered and has matches */}
          {q && filtered.length > 0 && (
            <div className="p-2 sm:p-3 divide-y divide-slate-100">
              <div className="px-2 py-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span>Matching Articles</span>
                <span className="text-[#00a877]">{filtered.length} found</span>
              </div>
              {filtered.map((post) => (
                <div
                  key={post.id}
                  onClick={() => {
                    onSelectPost(post);
                    onClose();
                  }}
                  style={{ borderRadius: '1px' }}
                  className="p-3 hover:bg-slate-50 transition-colors cursor-pointer group flex items-start gap-3.5"
                >
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    style={{ borderRadius: '1px' }}
                    className="w-16 h-14 object-cover shrink-0 bg-slate-100 border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span 
                        style={{ borderRadius: '1px' }}
                        className="text-[10px] font-bold uppercase tracking-wider text-[#00a877] bg-[#00a877]/10 px-1.5 py-0.2"
                      >
                        {post.category}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {post.publishedDate}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#00a877] transition-colors line-clamp-1 mb-1">
                      {post.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="shrink-0 text-slate-400 group-hover:text-[#00a877] transition-colors self-center">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Case 3: Query entered with 0 matches */}
          {q && filtered.length === 0 && (
            <div className="py-12 px-4 text-center space-y-3">
              <div className="w-10 h-10 bg-slate-100 text-slate-400 flex items-center justify-center mx-auto" style={{ borderRadius: '1px' }}>
                <Search className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">No articles found for "{query}"</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Try checking your spelling or search by general keywords such as "Windows", "Tata", "Insurance", or "Loan".
                </p>
              </div>
              <button
                onClick={() => setQuery('')}
                style={{ borderRadius: '1px' }}
                className="px-3.5 py-1.5 bg-[#00a877] text-white text-xs font-bold hover:bg-[#009368] transition-colors cursor-pointer"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>

        {/* Simple Footer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Press <kbd className="font-semibold text-slate-700 bg-white px-1.5 py-0.5 border border-slate-200" style={{ borderRadius: '1px' }}>Enter</kbd> to open first result</span>
          <span><kbd className="font-semibold text-slate-700 bg-white px-1.5 py-0.5 border border-slate-200" style={{ borderRadius: '1px' }}>ESC</kbd> to close</span>
        </div>
      </div>
    </div>
  );
};
