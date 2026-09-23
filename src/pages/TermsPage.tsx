import React from 'react';
import { PageArticleLayout } from '../components/PageArticleLayout';
import { Post } from '../types';
import { 
  Copyright, 
  Terminal, 
  AlertCircle, 
  Lightbulb, 
  Scale 
} from 'lucide-react';

interface TermsPageProps {
  onBackToHome: () => void;
  allPosts: Post[];
  onSelectPost: (post: Post) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ 
  onBackToHome,
  allPosts,
  onSelectPost
}) => {
  return (
    <PageArticleLayout
      pageTitle="Terms & Conditions: Content Licensing & Code Snippet Execution"
      categoryTag="Terms of Service"
      featuredImage="https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80"
      publishedDate="September 2026"
      onBackToHome={onBackToHome}
      allPosts={allPosts}
      onSelectPost={onSelectPost}
    >
      {/* Lead Excerpt */}
      <p className="text-slate-800 leading-relaxed text-sm sm:text-[15px] font-medium">
        Welcome to Errorease. By visiting, reading, copying syntax blocks, or downloading reference spreadsheets from this site, you acknowledge and accept the terms and conditions outlined below.
      </p>

      {/* Analyst Note Callout */}
      <div 
        style={{ borderRadius: '1px' }}
        className="p-3 sm:p-3.5 bg-emerald-50/80 border border-emerald-200/80 text-emerald-900 text-xs sm:text-sm flex items-start gap-2.5"
      >
        <Lightbulb className="w-4 h-4 text-[#00a877] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Permissive Code License: </span>
          All single-line troubleshooting commands and terminal scripts published on Errorease may be executed freely on your personal or corporate computers without royalty or attribution.
        </div>
      </div>

      {/* Section 1: Copyright & Intellectual Property */}
      <section className="space-y-3 pt-2">
        <h2 className="text-base sm:text-xl font-bold text-slate-900 pt-2 tracking-tight flex items-center gap-2">
          <Copyright className="w-5 h-5 text-[#00a877]" />
          <span>Intellectual Property & Text Attribution</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          The prose, structure, explanatory diagrams, and quantitative research syntheses published on Errorease are authored by Pradeep Bijarniya and protected under international copyright law.
        </p>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          You may quote brief excerpts (up to 150 words) provided direct, clear backlink attribution to the canonical Errorease URL is retained. Automated mirroring, scraping, or wholesale reproduction of entire articles without written authorization is strictly prohibited.
        </p>
      </section>

      {/* Section 2: Command & Script Execution */}
      <section className="space-y-3 pt-2">
        <h2 className="text-base sm:text-xl font-bold text-slate-900 pt-2 tracking-tight flex items-center gap-2">
          <Terminal className="w-5 h-5 text-[#00a877]" />
          <span>Execution of Terminal & Administrative Scripts</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          While our editorial team verifies commands (PowerShell, Command Prompt, bash) on isolated laboratory systems, execution on your machine occurs entirely at your own risk. Errorease does not warrant that code snippets will be error-free or uninterrupted across custom driver or enterprise network configurations.
        </p>
      </section>

      {/* Section 3: Prohibited Conduct */}
      <section className="space-y-3 pt-2">
        <h2 className="text-base sm:text-xl font-bold text-slate-900 pt-2 tracking-tight flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-[#00a877]" />
          <span>Prohibited Reader Actions</span>
        </h2>
        <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 list-disc list-inside">
          <li>Launching denial-of-service (DDoS) probes or vulnerability scans against our infrastructure</li>
          <li>Scraping content via high-frequency automated bots that degrade server responsiveness for other readers</li>
          <li>Framing or embedding Errorease within third-party advertising iframes without explicit licensing agreements</li>
        </ul>
      </section>

      {/* Section 4: Governing Law & Inquiries */}
      <section className="space-y-3 pt-2 border-t border-slate-100">
        <h2 className="text-base sm:text-xl font-bold text-slate-900 pt-2 tracking-tight flex items-center gap-2">
          <Scale className="w-5 h-5 text-[#00a877]" />
          <span>Governing Law & Inquiries</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          These Terms of Service are governed by applicable internet regulations and international trademark standards. If you have questions regarding content syndication or educational reprint permissions, contact our legal desk at <a href="mailto:editorial@errorease.com" className="text-[#00a877] font-semibold hover:underline">editorial@errorease.com</a>.
        </p>
      </section>
    </PageArticleLayout>
  );
};
