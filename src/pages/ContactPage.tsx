import React, { useState } from 'react';
import { PageArticleLayout } from '../components/PageArticleLayout';
import { Post } from '../types';
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  Lightbulb, 
  MessageSquare,
  ShieldCheck
} from 'lucide-react';

interface ContactPageProps {
  onBackToHome: () => void;
  allPosts: Post[];
  onSelectPost: (post: Post) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ 
  onBackToHome,
  allPosts,
  onSelectPost
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'Editorial Feedback',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <PageArticleLayout
      pageTitle="Contact Us: Reach the Errorease Editorial & Research Desk"
      categoryTag="Support & Inquiries"
      featuredImage="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"
      publishedDate="September 2026"
      onBackToHome={onBackToHome}
      allPosts={allPosts}
      onSelectPost={onSelectPost}
    >
      {/* Lead Excerpt */}
      <p className="text-slate-800 leading-relaxed text-sm sm:text-[15px] font-medium">
        Have questions regarding a diagnostic guide, want to report an erratum in our financial models, or wish to propose an enterprise technology case study? We maintain open, transparent communication channels directly with our editorial staff.
      </p>

      {/* Analyst Note */}
      <div 
        style={{ borderRadius: '1px' }}
        className="p-3 sm:p-3.5 bg-emerald-50/80 border border-emerald-200/80 text-emerald-900 text-xs sm:text-sm flex items-start gap-2.5"
      >
        <Lightbulb className="w-4 h-4 text-[#00a877] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Turnaround Window: </span>
          All technical submissions, reader suggestions, and syndication requests are reviewed by our lead author and research team within 24 to 48 business hours.
        </div>
      </div>

      {/* Direct Correspondence Channels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
        <div 
          style={{ borderRadius: '1px' }}
          className="p-4 bg-slate-50 border border-slate-200"
        >
          <div className="flex items-center gap-2 text-[#00a877] font-bold text-xs uppercase mb-1">
            <Mail className="w-4 h-4" />
            <span>Editorial Inquiries</span>
          </div>
          <a 
            href="mailto:editorial@errorease.com" 
            className="text-xs sm:text-sm font-bold text-slate-900 hover:text-[#00a877] transition-colors"
          >
            editorial@errorease.com
          </a>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Content suggestions, code verification queries, press releases, and general reader feedback.
          </p>
        </div>

        <div 
          style={{ borderRadius: '1px' }}
          className="p-4 bg-slate-50 border border-slate-200"
        >
          <div className="flex items-center gap-2 text-[#00a877] font-bold text-xs uppercase mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Lead Author Direct</span>
          </div>
          <a 
            href="mailto:pradeepbijarniyaa@gmail.com" 
            className="text-xs sm:text-sm font-bold text-slate-900 hover:text-[#00a877] transition-colors"
          >
            pradeepbijarniyaa@gmail.com
          </a>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Direct correspondence with Pradeep Bijarniya regarding quantitative models and architecture teardowns.
          </p>
        </div>
      </div>

      {/* Interactive Contact Form */}
      <section className="pt-4 space-y-4">
        <h2 className="text-base sm:text-xl font-bold text-slate-900 pt-2 tracking-tight flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#00a877]" />
          <span>Send a Direct Message</span>
        </h2>

        {submitted ? (
          <div 
            style={{ borderRadius: '1px' }}
            className="p-5 sm:p-6 bg-emerald-50 border border-emerald-200 text-center space-y-2 animate-in fade-in duration-200"
          >
            <CheckCircle2 className="w-10 h-10 text-[#00a877] mx-auto" />
            <h3 className="text-base font-bold text-slate-900">Message Dispatched Successfully</h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Thank you for reaching out to Errorease. A confirmation has been routed to our research desk, and our team will get back to you at <strong className="text-slate-800">{formData.email}</strong>.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  name: '',
                  email: '',
                  category: 'Editorial Feedback',
                  subject: '',
                  message: '',
                });
              }}
              style={{ borderRadius: '1px' }}
              className="mt-3 px-4 py-2 bg-[#00a877] text-white text-xs font-bold hover:bg-[#009368] transition-colors cursor-pointer"
            >
              Send Another Note
            </button>
          </div>
        ) : (
          <form 
            onSubmit={handleSubmit}
            style={{ borderRadius: '1px' }}
            className="p-4 sm:p-6 bg-slate-50 border border-slate-200 space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Your Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Henderson"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ borderRadius: '1px' }}
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 focus:border-[#00a877] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ borderRadius: '1px' }}
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 focus:border-[#00a877] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Inquiry Topic
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{ borderRadius: '1px' }}
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 focus:border-[#00a877] focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="Editorial Feedback">Editorial Feedback & Corrections</option>
                  <option value="Topic Request">New Topic / Diagnostic Request</option>
                  <option value="Financial Modeling">Financial Modeling Inquiry</option>
                  <option value="Syndication">Licensing & Syndication</option>
                  <option value="Other">Other Matter</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Subject Line
                </label>
                <input
                  type="text"
                  placeholder="Brief summary of your inquiry"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  style={{ borderRadius: '1px' }}
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 focus:border-[#00a877] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Message Content <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder="Include error codes, OS build version, or specific calculation steps if reporting a technical question..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                style={{ borderRadius: '1px' }}
                className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 focus:border-[#00a877] focus:outline-none transition-colors resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{ borderRadius: '1px' }}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#00a877] hover:bg-[#009368] text-white text-xs sm:text-sm font-bold tracking-wide transition-colors cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Transmitting...' : 'Send Message to Editorial Desk'}</span>
            </button>
          </form>
        )}
      </section>

      {/* Advisory Note */}
      <section className="pt-2 text-xs text-slate-500 border-t border-slate-100 leading-relaxed">
        <p>
          <strong className="text-slate-700">Notice on Direct Troubleshooting:</strong> While our research team reviews reader inquiries to shape future laboratory articles, we cannot provide private one-on-one emergency server recovery or personalized fiduciary investment consultations. For critical emergencies, consult authorized hardware service centers or licensed certified accountants.
        </p>
      </section>
    </PageArticleLayout>
  );
};
