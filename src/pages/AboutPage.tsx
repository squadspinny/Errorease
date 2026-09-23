import React from 'react';
import { PageArticleLayout } from '../components/PageArticleLayout';
import { Post } from '../types';
import { 
  CheckCircle2, 
  Terminal, 
  TrendingUp, 
  Shield, 
  Lightbulb, 
  Mail, 
  Award,
  Cpu,
  Layers
} from 'lucide-react';

interface AboutPageProps {
  onBackToHome: () => void;
  onContactClick?: () => void;
  allPosts: Post[];
  onSelectPost: (post: Post) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ 
  onBackToHome, 
  onContactClick,
  allPosts,
  onSelectPost
}) => {
  return (
    <PageArticleLayout
      pageTitle="About Errorease: Independent Technical Diagnostics & Quantitative Analysis"
      categoryTag="Editorial Desk"
      featuredImage="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80"
      publishedDate="September 2026"
      onBackToHome={onBackToHome}
      allPosts={allPosts}
      onSelectPost={onSelectPost}
    >
      {/* Lead Excerpt */}
      <p className="text-slate-800 leading-relaxed text-sm sm:text-[15px] font-medium">
        Errorease is an independent digital publication and research portal dedicated to reproducible technical diagnostics, quantitative financial modeling, and empirical consumer tech reviews. Every guide, terminal script, and equity analysis published here is engineered for accuracy and tested in live environments.
      </p>

      {/* Analyst Note Callout */}
      <div 
        style={{ borderRadius: '1px' }}
        className="p-3 sm:p-3.5 bg-emerald-50/80 border border-emerald-200/80 text-emerald-900 text-xs sm:text-sm flex items-start gap-2.5"
      >
        <Lightbulb className="w-4 h-4 text-[#00a877] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Editorial Mission: </span>
          We believe technical documentation and financial evaluations should be transparent, step-by-step, and free from sponsored bias. No marketing fluff—just verified syntax, mathematical models, and actionable conclusions.
        </div>
      </div>

      {/* Section 1: Lead Author Profile */}
      <section className="space-y-3 pt-2">
        <h2 className="text-base sm:text-xl font-bold text-slate-900 pt-2 tracking-tight flex items-center gap-2">
          <Award className="w-5 h-5 text-[#00a877]" />
          <span>Lead Author & Editorial Leadership</span>
        </h2>

        <div 
          style={{ borderRadius: '1px' }}
          className="bg-slate-50 border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&h=240&q=80"
            alt="Pradeep Bijarniya"
            style={{ borderRadius: '1px' }}
            className="w-16 h-16 sm:w-20 sm:h-20 object-cover border border-slate-300 shrink-0"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">Pradeep Bijarniya</h3>
              <span 
                style={{ borderRadius: '1px' }}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#00a877]/10 text-[#00a877] text-[10px] font-bold uppercase tracking-wider"
              >
                <CheckCircle2 className="w-3 h-3 text-[#00a877]" />
                Lead Editor & Architect
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Principal Systems Engineer, Quantitative Financial Researcher & Founder
            </p>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1">
              Pradeep directs all technical teardowns and computational models across Errorease. With extensive background across operating system kernels, cloud infrastructure, and mathematical finance, every article undergoes rigorous bench testing before publication.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Core Methodologies */}
      <section className="space-y-3 pt-2">
        <h2 className="text-base sm:text-xl font-bold text-slate-900 pt-2 tracking-tight flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#00a877]" />
          <span>Our Three Verification Pillars</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
          <div 
            style={{ borderRadius: '1px' }}
            className="p-3.5 bg-slate-50 border border-slate-200"
          >
            <div className="flex items-center gap-2 text-[#00a877] font-bold text-xs uppercase mb-1.5">
              <Terminal className="w-4 h-4" />
              <span>Verified Syntax</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every command block (PowerShell, Command Prompt, bash) is verified on fresh production OS builds to ensure it executes without destructive side effects.
            </p>
          </div>

          <div 
            style={{ borderRadius: '1px' }}
            className="p-3.5 bg-slate-50 border border-slate-200"
          >
            <div className="flex items-center gap-2 text-[#00a877] font-bold text-xs uppercase mb-1.5">
              <TrendingUp className="w-4 h-4" />
              <span>Quantitative Math</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Financial guides incorporate weighted EV/EBITDA multiples, discounted Human Life Value (HLV) formulas, and true effective annual lending rates.
            </p>
          </div>

          <div 
            style={{ borderRadius: '1px' }}
            className="p-3.5 bg-slate-50 border border-slate-200"
          >
            <div className="flex items-center gap-2 text-[#00a877] font-bold text-xs uppercase mb-1.5">
              <Shield className="w-4 h-4" />
              <span>Unbiased Testing</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              We never accept sponsored editorial rankings or pay-for-placement benchmarks. Hardware and software reviews represent true laboratory findings.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Primary Coverage Beats */}
      <section className="space-y-3 pt-2">
        <h2 className="text-base sm:text-xl font-bold text-slate-900 pt-2 tracking-tight flex items-center gap-2">
          <Cpu className="w-5 h-5 text-[#00a877]" />
          <span>Editorial Coverage Domains</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Errorease focuses on high-impact problem spaces where inaccurate information carries serious computational or financial penalties:
        </p>

        <ul className="space-y-2 text-xs sm:text-sm text-slate-700 list-disc list-inside">
          <li><strong className="text-slate-900">Operating System Diagnostics:</strong> Windows 11 updates, BSOD resolution, boot corruption, network timeouts, and disk performance bottlenecks.</li>
          <li><strong className="text-slate-900">Equity & Industrial Research:</strong> Balance sheet evaluations, CAPEX cycles, and cyclical fundamentals of leading enterprises (e.g. Tata Motors).</li>
          <li><strong className="text-slate-900">Consumer Financial Strategy:</strong> Pure term insurance underwriting, critical illness riders, and car loan APR optimization.</li>
          <li><strong className="text-slate-900">Hardware & Consumer Electronics:</strong> Battery degradation metrics, thermals, and display refresh benchmarks on flagship smartphones and laptops.</li>
        </ul>
      </section>

      {/* Section 4: Corrections & Inquiries */}
      <section className="space-y-3 pt-2 border-t border-slate-100">
        <h2 className="text-base sm:text-xl font-bold text-slate-900 pt-2 tracking-tight">
          Fact-Checking & Feedback Protocol
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Operating systems update rapidly and market parameters evolve. When an OS update deprecates a flag or a financial index modifies its weighting, our editorial team immediately updates the published record.
        </p>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          If you identify an erratum or wish to suggest a topic for empirical evaluation, reach our desk at <a href="mailto:editorial@errorease.com" className="text-[#00a877] font-semibold hover:underline">editorial@errorease.com</a> or <a href="mailto:pradeepbijarniyaa@gmail.com" className="text-[#00a877] font-semibold hover:underline">pradeepbijarniyaa@gmail.com</a>.
        </p>

        {onContactClick && (
          <div className="pt-2">
            <button
              onClick={onContactClick}
              style={{ borderRadius: '1px' }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#00a877] text-white text-xs font-bold hover:bg-[#009368] transition-colors cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Our Editorial Desk</span>
            </button>
          </div>
        )}
      </section>
    </PageArticleLayout>
  );
};
