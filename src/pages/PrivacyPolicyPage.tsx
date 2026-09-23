import React from 'react';
import { PageArticleLayout } from '../components/PageArticleLayout';
import { Post } from '../types';
import { 
  Lock, 
  Database, 
  Cookie, 
  Lightbulb, 
  UserCheck 
} from 'lucide-react';

interface PrivacyPolicyPageProps {
  onBackToHome: () => void;
  allPosts: Post[];
  onSelectPost: (post: Post) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ 
  onBackToHome,
  allPosts,
  onSelectPost
}) => {
  return (
    <PageArticleLayout
      pageTitle="Privacy Policy: How Errorease Protects Reader Data"
      categoryTag="Privacy & Security"
      featuredImage="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80"
      publishedDate="September 2026"
      onBackToHome={onBackToHome}
      allPosts={allPosts}
      onSelectPost={onSelectPost}
    >
      {/* Lead Excerpt */}
      <p className="text-slate-800 leading-relaxed text-sm sm:text-[15px] font-medium">
        At Errorease, reader privacy is a fundamental architecture principle rather than an afterthought. This policy details how our web service processes information when you read troubleshooting tutorials, equity breakdowns, or save articles to your browser.
      </p>

      {/* Analyst Note Callout */}
      <div 
        style={{ borderRadius: '1px' }}
        className="p-3 sm:p-3.5 bg-emerald-50/80 border border-emerald-200/80 text-emerald-900 text-xs sm:text-sm flex items-start gap-2.5"
      >
        <Lightbulb className="w-4 h-4 text-[#00a877] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Zero-Account Architecture: </span>
          You are never forced to register an account, provide phone numbers, or supply payment credentials to access articles on Errorease. Our guides are 100% open to read without registration.
        </div>
      </div>

      {/* Section 1: Local Storage Transparency */}
      <section className="space-y-3 pt-2">
        <h2 className="text-base sm:text-xl font-bold text-slate-900 pt-2 tracking-tight flex items-center gap-2">
          <Database className="w-5 h-5 text-[#00a877]" />
          <span>Client-Side Local Storage & Bookmarking</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          When you click the Bookmark button to save an article for offline or subsequent reference, Errorease stores only the article slug ID (e.g. <code className="px-1 py-0.5 bg-slate-100 font-mono text-[11px] text-slate-800">errorease_saved_slugs</code>) locally inside your browser's HTML5 <code className="px-1 py-0.5 bg-slate-100 font-mono text-[11px] text-slate-800">localStorage</code>.
        </p>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          This data never leaves your device and is not transmitted to our servers or any commercial data broker. You can clear your saved bookmarks at any time by clearing your browser cache.
        </p>
      </section>

      {/* Section 2: Server Logs & Operational Metrics */}
      <section className="space-y-3 pt-2">
        <h2 className="text-base sm:text-xl font-bold text-slate-900 pt-2 tracking-tight flex items-center gap-2">
          <Lock className="w-5 h-5 text-[#00a877]" />
          <span>Automated Server Logs</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Like all standard web servers, our infrastructure automatically records non-identifiable technical transaction data, such as:
        </p>
        <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 list-disc list-inside">
          <li>Browser type, engine version, and user-agent string</li>
          <li>Referring URL and requested page paths</li>
          <li>Standard network timestamp and anonymized IP subnet</li>
        </ul>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          These logs are inspected solely for cybersecurity diagnostics, bot suppression, and server uptime monitoring.
        </p>
      </section>

      {/* Section 3: Third-Party Advertisers & Cookies */}
      <section className="space-y-3 pt-2">
        <h2 className="text-base sm:text-xl font-bold text-slate-900 pt-2 tracking-tight flex items-center gap-2">
          <Cookie className="w-5 h-5 text-[#00a877]" />
          <span>Third-Party Advertising & Cookies</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          To sustain free access to our laboratory testing and financial analysis, Errorease displays non-intrusive advertisements served by third-party advertising partners (such as Google AdSense). These third-party vendors may use cookies, web beacons, or unique device identifiers to deliver relevant advertisements based on prior visits to our site or other internet properties.
        </p>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Users can opt out of personalized advertising by visiting Google Ad Settings (<a href="https://adssettings.google.com" target="_blank" rel="noreferrer" className="text-[#00a877] underline">adssettings.google.com</a>) or via the Network Advertising Initiative opt-out portal.
        </p>
      </section>

      {/* Section 4: Reader Rights (GDPR & CCPA/CPRA) */}
      <section className="space-y-3 pt-2 border-t border-slate-100">
        <h2 className="text-base sm:text-xl font-bold text-slate-900 pt-2 tracking-tight flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-[#00a877]" />
          <span>Your Privacy Rights (GDPR & CCPA/CPRA)</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Under European General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA), you retain the right to inquire about data processed by Errorease. Because we do not store customer databases or personal profile rosters, we do not sell your personal information.
        </p>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          For any privacy inquiries or policy requests, reach out directly to <a href="mailto:editorial@errorease.com" className="text-[#00a877] font-semibold hover:underline">editorial@errorease.com</a> or <a href="mailto:pradeepbijarniyaa@gmail.com" className="text-[#00a877] font-semibold hover:underline">pradeepbijarniyaa@gmail.com</a>.
        </p>
      </section>
    </PageArticleLayout>
  );
};
