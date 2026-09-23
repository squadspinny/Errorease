import React from 'react';
import { AlertCircle, Search, Home } from 'lucide-react';

interface NotFoundViewProps {
  onBackToHome: () => void;
  onOpenSearch: () => void;
  attemptedSlug?: string;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({
  onBackToHome,
  onOpenSearch,
  attemptedSlug,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-4 sm:px-6 text-center">
      <div 
        style={{ borderRadius: '1px' }}
        className="bg-white border border-slate-200 p-6 sm:p-10 shadow-2xs"
      >
        <div className="w-14 h-14 bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4" style={{ borderRadius: '1px' }}>
          <AlertCircle className="w-7 h-7" />
        </div>

        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#00a877] block mb-1">
          404 Error
        </span>

        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2">
          Article Not Found
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
          {attemptedSlug ? (
            <>
              The requested troubleshooting guide <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 font-mono text-xs">/{attemptedSlug}</code> does not exist or has been removed from ErrorEase.
            </>
          ) : (
            'The troubleshooting guide you are looking for does not exist or may have been removed.'
          )}
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={onBackToHome}
            style={{ borderRadius: '1px' }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00a877] hover:bg-[#009368] text-white text-xs sm:text-sm font-bold tracking-wide uppercase shadow-xs transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </button>

          <button
            onClick={onOpenSearch}
            style={{ borderRadius: '1px' }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 text-xs sm:text-sm font-bold transition-all cursor-pointer hover:bg-slate-50"
          >
            <Search className="w-4 h-4 text-slate-500" />
            <span>Search ErrorEase</span>
          </button>
        </div>
      </div>
    </div>
  );
};
