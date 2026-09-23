import React from 'react';
import { 
  Facebook, 
  Instagram, 
  Youtube, 
  Send,
  MessageCircle
} from 'lucide-react';

export type PageSlug = 'about' | 'contact' | 'disclaimer' | 'privacy' | 'terms' | 'sitemap';

interface FooterProps {
  onNavigatePage: (page: PageSlug) => void;
  onResetHome: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigatePage,
  onResetHome,
}) => {
  return (
    <footer className="w-full bg-[#0b0c0e] text-white pt-14 pb-8 border-t border-slate-900 mt-auto">
      <div className="max-w-4xl mx-auto px-4 text-center">
        
        {/* Centered Logo: Errorease Logo Image */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onResetHome();
          }}
          className="hover:opacity-90 transition-opacity cursor-pointer inline-block mb-6"
          title="Errorease - Home"
          aria-label="Errorease Home"
        >
          <img
            src="/errorease-logo-white.png"
            alt="Errorease"
            className="h-10 sm:h-11 w-auto object-contain mx-auto"
          />
        </a>

        {/* Circular Social Icons Row */}
        <div className="flex items-center justify-center gap-3 sm:gap-3.5 mb-7">
          {/* Facebook */}
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="w-9 h-9 rounded-full bg-[#1c1e24] hover:bg-[#00a877] text-slate-300 hover:text-white flex items-center justify-center transition-all duration-150 cursor-pointer shadow-xs"
          >
            <Facebook className="w-4 h-4 fill-current stroke-none" />
          </a>

          {/* X / Twitter */}
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X / Twitter"
            className="w-9 h-9 rounded-full bg-[#1c1e24] hover:bg-[#00a877] text-slate-300 hover:text-white flex items-center justify-center transition-all duration-150 cursor-pointer shadow-xs"
          >
            <span className="font-extrabold text-xs">𝕏</span>
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="w-9 h-9 rounded-full bg-[#1c1e24] hover:bg-[#00a877] text-slate-300 hover:text-white flex items-center justify-center transition-all duration-150 cursor-pointer shadow-xs"
          >
            <Instagram className="w-4 h-4" />
          </a>

          {/* WhatsApp */}
          <a
            href="https://whatsapp.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="w-9 h-9 rounded-full bg-[#1c1e24] hover:bg-[#00a877] text-slate-300 hover:text-white flex items-center justify-center transition-all duration-150 cursor-pointer shadow-xs"
          >
            <MessageCircle className="w-4 h-4 fill-current stroke-none" />
          </a>

          {/* Telegram */}
          <a
            href="https://telegram.org"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Telegram"
            className="w-9 h-9 rounded-full bg-[#1c1e24] hover:bg-[#00a877] text-slate-300 hover:text-white flex items-center justify-center transition-all duration-150 cursor-pointer shadow-xs"
          >
            <Send className="w-3.5 h-3.5 -ml-0.5" />
          </a>

          {/* YouTube */}
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="w-9 h-9 rounded-full bg-[#1c1e24] hover:bg-[#00a877] text-slate-300 hover:text-white flex items-center justify-center transition-all duration-150 cursor-pointer shadow-xs"
          >
            <Youtube className="w-4 h-4 fill-current stroke-none" />
          </a>
        </div>

        {/* Footer Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-y-2 text-xs sm:text-[13px] text-slate-300 font-medium mb-8">
          <a
            href="/about"
            onClick={(e) => {
              e.preventDefault();
              onNavigatePage('about');
            }}
            className="hover:text-[#00a877] transition-colors cursor-pointer"
          >
            About Us
          </a>
          <span className="text-slate-600 mx-2 sm:mx-3 select-none">|</span>

          <a
            href="/contact"
            onClick={(e) => {
              e.preventDefault();
              onNavigatePage('contact');
            }}
            className="hover:text-[#00a877] transition-colors cursor-pointer"
          >
            Contact Us
          </a>
          <span className="text-slate-600 mx-2 sm:mx-3 select-none">|</span>

          <a
            href="/disclaimer"
            onClick={(e) => {
              e.preventDefault();
              onNavigatePage('disclaimer');
            }}
            className="hover:text-[#00a877] transition-colors cursor-pointer"
          >
            Disclaimer
          </a>
          <span className="text-slate-600 mx-2 sm:mx-3 select-none">|</span>

          <a
            href="/privacy"
            onClick={(e) => {
              e.preventDefault();
              onNavigatePage('privacy');
            }}
            className="hover:text-[#00a877] transition-colors cursor-pointer"
          >
            Privacy Policy
          </a>
          <span className="text-slate-600 mx-2 sm:mx-3 select-none">|</span>

          <a
            href="/terms"
            onClick={(e) => {
              e.preventDefault();
              onNavigatePage('terms');
            }}
            className="hover:text-[#00a877] transition-colors cursor-pointer"
          >
            Terms and Conditions
          </a>
          <span className="text-slate-600 mx-2 sm:mx-3 select-none">|</span>

          <a
            href="/sitemap"
            onClick={(e) => {
              e.preventDefault();
              onNavigatePage('sitemap');
            }}
            className="hover:text-[#00a877] transition-colors cursor-pointer"
          >
            Sitemap
          </a>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-slate-900/90 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Errorease.com - All rights reserved</p>
        </div>

      </div>
    </footer>
  );
};
