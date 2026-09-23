import React, { useState, useEffect } from 'react';
import { List, ChevronDown, ChevronUp } from 'lucide-react';

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3 | 4;
}

export interface TableOfContentsProps {
  items: TocItem[];
  className?: string;
  title?: string;
}

/**
 * Generates a clean, URL-friendly anchor ID from heading text.
 */
export function slugifyHeading(text: string): string {
  const slug = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'section';
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  items,
  className = '',
  title = 'Table of Contents',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeId, setActiveId] = useState<string>('');

  // Track the heading in viewport
  useEffect(() => {
    if (items.length === 0) return;

    const observerCallback: IntersectionObserverCallback = (entries) => {
      // Find the first intersecting heading
      const visible = entries.find((entry) => entry.isIntersecting);
      if (visible && visible.target.id) {
        setActiveId(visible.target.id);
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: '-80px 0px -65% 0px',
      threshold: 0.1,
    });

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (!items || items.length === 0) {
    return null;
  }

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', `#${id}`);
      setActiveId(id);
    }
  };

  // Compute numbered prefixes for H2 items (1., 2., 3...)
  let h2Count = 0;

  return (
    <nav
      id="table-of-contents"
      aria-label="Table of Contents"
      style={{ borderRadius: '1px' }}
      className={`my-4 sm:my-5 p-3 sm:p-4 bg-slate-50/90 border border-slate-200/90 not-prose shadow-2xs ${className}`}
    >
      {/* Header Bar */}
      <div
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex items-center justify-between gap-3 select-none cursor-pointer group"
      >
        <div className="flex items-center gap-2 min-w-0">
          <List className="w-4 h-4 text-[#00a877] shrink-0" />
          <span className="font-bold text-xs sm:text-[13px] uppercase tracking-wider text-slate-900 group-hover:text-[#00a877] transition-colors">
            {title}
          </span>
          <span
            style={{ borderRadius: '1px' }}
            className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-500 bg-slate-200/70 px-1.5 py-0.5"
            title={`${items.length} sections`}
          >
            {items.length}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded((prev) => !prev);
          }}
          style={{ borderRadius: '1px' }}
          className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 px-2 py-0.5 sm:py-1 border border-slate-200 transition-colors cursor-pointer"
          aria-expanded={isExpanded}
          aria-controls="toc-list"
          title={isExpanded ? 'Collapse Table of Contents' : 'Expand Table of Contents'}
        >
          <span>{isExpanded ? 'Hide' : 'Show'}</span>
          {isExpanded ? (
            <ChevronUp className="w-3 h-3 text-slate-500" />
          ) : (
            <ChevronDown className="w-3 h-3 text-slate-500" />
          )}
        </button>
      </div>

      {/* Expandable Content List */}
      {isExpanded && (
        <ol
          id="toc-list"
          className="mt-3 pt-3 border-t border-slate-200/80 space-y-1 sm:space-y-1.5 text-xs sm:text-[13.5px] leading-relaxed"
        >
          {items.map((item) => {
            const isH2 = item.level === 2;
            const isH3 = item.level === 3;
            const isH4 = item.level === 4;
            const isActive = activeId === item.id;

            if (isH2) {
              h2Count += 1;
            }

            return (
              <li
                key={item.id}
                className={`transition-colors ${
                  isH3
                    ? 'pl-4 sm:pl-5'
                    : isH4
                    ? 'pl-8 sm:pl-9'
                    : 'pl-0'
                }`}
              >
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleScrollTo(e, item.id)}
                  className={`group inline-flex items-baseline gap-2 py-0.5 hover:text-[#00a877] transition-colors ${
                    isActive
                      ? 'text-[#00a877] font-semibold'
                      : 'text-slate-700 hover:underline'
                  }`}
                >
                  {isH2 ? (
                    <span className="text-[11px] font-mono font-semibold text-slate-400 group-hover:text-[#00a877] shrink-0 select-none">
                      {h2Count}.
                    </span>
                  ) : isH3 ? (
                    <span className="text-[10px] text-slate-400 group-hover:text-[#00a877] shrink-0 select-none font-mono">
                      ↳
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 group-hover:text-[#00a877] shrink-0 select-none font-mono">
                      •
                    </span>
                  )}
                  <span className="underline-offset-2 break-words">
                    {item.text}
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      )}
    </nav>
  );
};
