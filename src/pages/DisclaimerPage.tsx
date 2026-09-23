import React from 'react';
import { PageArticleLayout } from '../components/PageArticleLayout';
import { Post } from '../types';
import { 
  AlertTriangle, 
  Terminal, 
  TrendingUp, 
  Building2 
} from 'lucide-react';

interface DisclaimerPageProps {
  onBackToHome: () => void;
  allPosts: Post[];
  onSelectPost: (post: Post) => void;
}

export const DisclaimerPage: React.FC<DisclaimerPageProps> = ({ 
  onBackToHome,
  allPosts,
  onSelectPost
}) => {
  return (
    <PageArticleLayout
      pageTitle="Disclaimer: Editorial Policies, Financial Modeling & System Commands"
      categoryTag="Legal Disclosures"
      featuredImage="https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80"
      publishedDate="September 2026"
      onBackToHome={onBackToHome}
      allPosts={allPosts}
      onSelectPost={onSelectPost}
    >
      {/* Lead Excerpt */}
      <p className="text-slate-800 leading-relaxed text-sm sm:text-[15px] font-medium">
        The research notes, step-by-step troubleshooting articles, quantitative valuation spreadsheets, and financial calculators published on Errorease are provided strictly for educational and general informational purposes.
      </p>

      {/* Primary Caution Callout */}
      <div 
        style={{ borderRadius: '1px' }}
        className="p-3 sm:p-3.5 bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-2.5"
      >
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Important Notice: </span>
          Content on this site does not constitute certified legal, certified financial, or fiduciary investment advice. Always consult certified financial planners (CFP) or certified systems administrators for production deployments.
        </div>
      </div>

      {/* Section 1: Financial & Valuation Disclosures */}
      <section className="space-y-3 pt-2">
        <h2 className="text-base sm:text-xl font-bold text-slate-900 pt-2 tracking-tight flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#00a877]" />
          <span>Financial Modeling & Stock Market Analysis</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Articles analyzing public equities (such as Tata Motors Ltd.), debt instruments, term insurance policies, or automotive loans reflect the author’s independent analytical framework at the date of publication.
        </p>
        
        <div 
          style={{ borderRadius: '1px' }}
          className="p-3.5 bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2 leading-relaxed"
        >
          <p>
            • <strong className="text-slate-900">No Buy/Sell Recommendation:</strong> Mention of specific equity tickers (e.g., TATAMOTORS, NIFTY 50) is purely illustrative for balance sheet accounting and historical EV/EBITDA modeling. Errorease does not issue stock tips or portfolio allocations.
          </p>
          <p>
            • <strong className="text-slate-900">Insurance & Loan Estimates:</strong> Term life underwriting criteria, claim settlement ratios (CSR), and lending APRs vary continuously based on regulatory updates from IRDAI, RBI, or institutional underwriters. Readers must verify live policy wording with issuing carriers.
          </p>
        </div>
      </section>

      {/* Section 2: Terminal Commands & OS Diagnostics */}
      <section className="space-y-3 pt-2">
        <h2 className="text-base sm:text-xl font-bold text-slate-900 pt-2 tracking-tight flex items-center gap-2">
          <Terminal className="w-5 h-5 text-[#00a877]" />
          <span>Elevated System Commands & Registry Alterations</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Operating system troubleshooting often involves elevated command prompt utilities (e.g., <code className="px-1 py-0.5 bg-slate-100 font-mono text-[11px] text-slate-800">sfc /scannow</code>, <code className="px-1 py-0.5 bg-slate-100 font-mono text-[11px] text-slate-800">dism</code>), Windows PowerShell modules, or registry keys (<code className="px-1 py-0.5 bg-slate-100 font-mono text-[11px] text-slate-800">regedit</code>).
        </p>

        <div 
          style={{ borderRadius: '1px' }}
          className="p-3.5 bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2 leading-relaxed"
        >
          <p>
            • <strong className="text-slate-900">User Discretion & Backups:</strong> While all scripts are verified on clean test installations, unexpected driver conflicts or third-party background software may cause instability. You are strongly advised to create a full system restore point before modifying system components.
          </p>
          <p>
            • <strong className="text-slate-900">Hardware Risks:</strong> Errorease cannot be held liable for corrupted partitions, lost unsaved data, or BIOS/UEFI firmware misconfigurations resulting from improper execution.
          </p>
        </div>
      </section>

      {/* Section 3: Third-Party Trademarks */}
      <section className="space-y-3 pt-2">
        <h2 className="text-base sm:text-xl font-bold text-slate-900 pt-2 tracking-tight flex items-center gap-2">
          <Building2 className="w-5 h-5 text-[#00a877]" />
          <span>Third-Party Trademarks & Non-Affiliation</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Windows, Microsoft, Apple, iOS, Android, Google, Tata Motors, HDFC, SBI, and other corporate names, logos, or marks referenced within Errorease are registered trademarks of their respective holders. Reference to any third-party entity does not constitute affiliation, partnership, or commercial endorsement.
        </p>
      </section>

      {/* Section 4: Limitation of Liability */}
      <section className="space-y-3 pt-2 border-t border-slate-100">
        <h2 className="text-base sm:text-xl font-bold text-slate-900 pt-2 tracking-tight">
          Limitation of Liability
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Under no circumstances shall Errorease, its lead author Pradeep Bijarniya, or its research contributors be held liable for any direct, indirect, incidental, punitive, or consequential damages arising from the use of, or inability to use, information contained on this site.
        </p>
      </section>
    </PageArticleLayout>
  );
};
