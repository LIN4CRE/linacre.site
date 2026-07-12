import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Mail, Shield, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { WORK_FAQS, WORK_NEXT_AVAILABLE } from '../data';

interface Offering {
  id: string;
  title: string;
  price: string;
  description: string;
  deliverables: string[];
  cta: string;
  ctaHref: string;
  isExternal: boolean;
  popular?: boolean;
}

export default function WorkWithMe() {
  const [leadEmail, setLeadEmail] = useState('');
  const [leadStatus, setLeadStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [leadError, setLeadError] = useState('');

  const offerings: Offering[] = [
    {
      id: 'audit',
      title: 'Systems & Infrastructure Audit',
      price: 'From £1,800',
      description: 'Deep technical review of your architecture, security, performance, and developer experience.',
      deliverables: [
        'Full architecture review + report',
        'Security & performance recommendations',
        'Implementation roadmap (30/60/90 days)',
        '2x 45-min follow-up consulting calls'
      ],
      // Calendly event 404'd (audit Issue 1, 12 Jul 2026) — route to the
      // contact form (prefilled project type) until a scheduler is restored.
      cta: 'Book an Audit',
      ctaHref: '/contact?project=audit',
      isExternal: false
    },
    {
      id: 'development',
      title: 'Custom Development Project',
      price: 'From £6,500',
      description: 'End-to-end build of production-grade tools, automation platforms, or AI integrations.',
      deliverables: [
        'Full-stack React + TypeScript / Go / Python',
        'Production deployment (Vercel / Cloud)',
        'Documentation + system handoff',
        '30 days of direct post-launch support'
      ],
      cta: 'Start Project',
      ctaHref: '/contact?project=custom',
      isExternal: false,
      popular: true
    },
    {
      id: 'retainer',
      title: 'Ongoing Engineering Retainer',
      price: '£2,400 / month',
      description: 'Dedicated fractional engineering time for ongoing improvements and rapid iteration.',
      deliverables: [
        '20 hours / month priority access',
        'Architecture guidance + code reviews',
        'Rapid prototyping & API support',
        'Monthly systems strategy calls'
      ],
      cta: 'Discuss Retainer',
      ctaHref: '/contact?project=retainer',
      isExternal: false
    }
  ];

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadEmail.trim()) return;

    setLeadStatus('submitting');
    setLeadError('');

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          email: leadEmail,
          subject: "LEAD MAGNET: Go Concurrency Starter Kit",
          message: "User signed up to receive the free High-Performance Go Concurrency Starter Kit.",
          company: "",
          startedAt: Date.now()
        })
      });

      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(body.error || "Subscription failed.");
      }

      setLeadStatus('success');
      setLeadEmail('');
    } catch (err: any) {
      setLeadStatus('error');
      setLeadError(err.message || 'Failed to submit. Please email david@linacre.site directly.');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 110, damping: 14 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-16 pb-16 animate-fade-in"
      id="work-with-me-container"
    >
      {/* Title Hero */}
      <motion.section variants={itemVariants} className="text-center space-y-4 max-w-3xl mx-auto" id="work-hero">
        <span className="font-mono text-xs text-amber-color tracking-widest uppercase font-semibold bg-amber-color/10 border border-amber-color/20 px-2.5 py-1 rounded-full">
          Services &amp; Engagement
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground mt-3">
          Work with <span className="text-amber-color">David</span>
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          I help engineering groups ship faster, automate operations, and implement secure, high-throughput systems. Select contract services are outlined below.
        </p>
        {/* Availability indicator (audit Roadmap #15, 12 Jul 2026) —
            WORK_NEXT_AVAILABLE lives in src/data.ts; update it there. */}
        <p className="inline-flex items-center gap-2 font-mono text-xs text-emerald-color bg-emerald-color/10 border border-emerald-color/25 px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-color animate-pulse" aria-hidden="true" />
          <span>Next available: <strong className="font-bold">{WORK_NEXT_AVAILABLE}</strong></span>
        </p>
      </motion.section>

      {/* Offerings Grid */}
      <motion.section variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6" id="work-offerings">
        {offerings.map((offering) => (
          <div
            key={offering.id}
            className={`relative rounded-xl p-6 border flex flex-col justify-between transition-all ${
              offering.popular
                ? 'border-amber-color/50 bg-amber-color/5 shadow-[0_0_15px_rgba(245,158,11,0.06)]'
                : 'border-border-color bg-muted/10'
            }`}
          >
            {offering.popular && (
              <div className="absolute -top-3 right-6 px-3 py-0.5 bg-amber-color text-black text-[9px] font-mono font-bold tracking-wider rounded-full shadow-sm">
                MOST POPULAR
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5 border-b border-border-color/30 pb-4">
                <h2 className="text-lg font-bold text-foreground tracking-tight">{offering.title}</h2>
                <div className="text-2xl font-mono font-bold text-amber-color">{offering.price}</div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed min-h-[48px]">{offering.description}</p>

              <ul className="space-y-2 border-t border-border-color/30 pt-4 text-xs font-mono">
                {offering.deliverables.map((del, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                    <span className="text-amber-color shrink-0">→</span>
                    <span className="leading-snug">{del}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              {offering.isExternal ? (
                <a
                  href={offering.ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full block text-center py-2.5 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
                    offering.popular
                      ? 'bg-amber-color hover:bg-amber-color/90 text-black shadow-md'
                      : 'bg-muted/40 border border-border-color hover:bg-muted text-foreground'
                  }`}
                >
                  {offering.cta}
                </a>
              ) : (
                <button
                  onClick={() => {
                    // Navigate to Contact tab via URL pushState + custom event
                    window.history.pushState({}, '', offering.ctaHref);
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }}
                  className={`w-full py-2.5 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
                    offering.popular
                      ? 'bg-amber-color hover:bg-amber-color/90 text-black shadow-md'
                      : 'bg-muted/40 border border-border-color hover:bg-muted text-foreground'
                  }`}
                >
                  {offering.cta}
                </button>
              )}
            </div>
          </div>
        ))}
      </motion.section>

      {/* FAQ — visible copy of the /work FAQPage JSON-LD (audit TASK-006,
          12 Jul 2026). Both render from WORK_FAQS in src/data.ts so the
          schema and on-page text always match. */}
      <motion.section variants={itemVariants} className="space-y-6" id="work-faq" aria-labelledby="work-faq-heading">
        <h2 id="work-faq-heading" className="font-display text-2xl font-bold tracking-tight text-foreground text-center">
          Frequently asked <span className="text-amber-color">questions</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {WORK_FAQS.map((faq) => (
            <div key={faq.question} className="bg-muted/10 border border-border-color rounded-xl p-5 space-y-2">
              <h3 className="text-sm font-bold text-foreground leading-snug">{faq.question}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Lead Magnet — UK GDPR / PECR compliant disclosure (audit CRO-01, 11 Jul 2026) */}
      <motion.section variants={itemVariants} className="linacre-surface p-8 relative overflow-hidden" id="work-lead-magnet">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-3 text-center lg:text-left">
            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Free: High-Performance Go Concurrency Starter Kit
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Worker pools, token limiters, and production-ready channel sync patterns extracted from the GhostMail system code.
            </p>
            <ul className="text-[11px] text-muted-foreground/90 leading-relaxed space-y-1 max-w-lg mx-auto lg:mx-0">
              <li><strong className="text-foreground">What you get:</strong> a single email with the starter-kit ZIP attached, sent within a few minutes.</li>
              <li><strong className="text-foreground">What we do with your address:</strong> deliver the kit, then <em>nothing</em> unless you tick the optional update box below.</li>
              <li><strong className="text-foreground">Retention:</strong> 30 days if you don&#39;t opt into updates. Unsubscribe any time from the footer of any email.</li>
            </ul>
          </div>

          <div className="lg:col-span-5 w-full">
            <AnimatePresence mode="wait">
              {leadStatus === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  role="status"
                  aria-live="polite"
                  className="flex items-start gap-3 bg-emerald-950/20 border border-emerald-500/35 p-4 rounded-xl text-xs text-emerald-color"
                >
                  <CheckCircle className="w-5 h-5 text-emerald-color shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="space-y-1">
                    <p className="font-bold">Kit on the way.</p>
                    <p className="text-muted-foreground text-[11px]">Check your inbox &mdash; if it doesn&#39;t arrive in 10 minutes, look in spam or email david@linacre.site.</p>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleLeadSubmit}
                  className="space-y-3"
                  aria-describedby="lead-magnet-disclosure"
                  noValidate
                >
                  <div className="relative">
                    <label htmlFor="lead-email-input" className="block text-[11px] uppercase tracking-wide font-mono text-muted-foreground mb-1">
                      Email address <span className="text-amber-color">*</span>
                    </label>
                    <input
                      id="lead-email-input"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@company.com"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      aria-invalid={leadStatus === 'error'}
                      aria-describedby={leadStatus === 'error' ? 'lead-magnet-error' : undefined}
                      className="w-full bg-background border border-border-color rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus-visible:border-amber-color"
                    />
                  </div>
                  <label htmlFor="lead-marketing-consent" className="flex items-start gap-2 text-[11px] text-muted-foreground leading-relaxed cursor-pointer">
                    <input
                      id="lead-marketing-consent"
                      name="marketing_optin"
                      type="checkbox"
                      className="mt-0.5 accent-[color:var(--color-amber-color)]"
                    />
                    <span>
                      Optional: also send me occasional engineering updates (about 1 per month). Unchecked by default.
                    </span>
                  </label>
                  <p id="lead-magnet-disclosure" className="text-[10px] text-muted-foreground/70 leading-relaxed">
                    By hitting <em>Send the kit</em> you consent to us using your email once, to deliver the file. See{' '}
                    <a href="/privacy" className="text-amber-color hover:underline">Privacy Policy</a>{' '}
                    for legal basis (legitimate interest / consent for updates) and retention.
                  </p>
                  <button
                    type="submit"
                    disabled={leadStatus === 'submitting'}
                    data-analytics="work_lead_magnet_submit"
                    className="w-full sm:w-auto px-5 py-2.5 bg-amber-color hover:bg-amber-glow text-black text-sm font-bold rounded-lg transition-all cursor-pointer disabled:opacity-50"
                  >
                    {leadStatus === 'submitting' ? 'Sending…' : 'Send me the kit →'}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {leadStatus === 'error' && (
              <p
                id="lead-magnet-error"
                role="alert"
                aria-live="assertive"
                className="mt-2 text-red-400 text-[11px] flex items-start gap-1.5"
              >
                <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  {leadError || 'Something went wrong. Try again or email david@linacre.site.'}
                </span>
              </p>
            )}
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
