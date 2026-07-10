import React, { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Send, CheckCircle, AlertCircle, ShieldAlert } from 'lucide-react';
import FAQ from './FAQ';

export default function Contact() {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [requestId, setRequestId] = useState('');
  const [company, setCompany] = useState(''); // honeypot — humans never see or fill this
  const [startedAt] = useState(() => Date.now()); // server drops sub-human-speed submissions

  // Check for access request parameter
  useEffect(() => {
    try {
      const pending = sessionStorage.getItem('linacre_pending_request');
      if (pending) {
        const parsed = JSON.parse(pending);
        if (parsed && parsed.projectName) {
          setSubject(`ACCESS REQUEST: ${parsed.projectName}`);
          setMessage(`Hi David,\n\nI would like to request details/access for your project: "${parsed.projectName}" (${parsed.projectType || 'Internal'}).\n\nPlease let me know if we can connect.\n\nBest regards,`);
        }
        sessionStorage.removeItem('linacre_pending_request');
      }
    } catch (e) {
      console.error('Failed to parse pending request', e);
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 110, damping: 14 } }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) return;

    setStatus('submitting');
    setErrorMessage('');
    
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email, subject, message, company, startedAt })
      });
      
      const body = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        throw new Error(typeof body.error === "string" ? body.error : "Your enquiry could not be sent.");
      }
      
      setRequestId(body.requestId);
      setStatus('success');
      // Clear inputs only on successful server-side receipt
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Connection failed. Please try again or email david@linacre.site directly.');
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-12 animate-fade-in"
    >
      {/* Title Hero */}
      <motion.section variants={itemVariants} className="text-center md:text-left space-y-4 max-w-3xl" id="contact-hero">
        <span className="font-mono text-xs text-amber-color tracking-widest uppercase font-semibold bg-amber-color/10 border border-amber-color/20 px-2.5 py-1 rounded-full">
          Secure Comms Endpoint
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground mt-3">
          Contact <span className="text-amber-color">David</span>
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          Need custom software design, pipeline automations, or infrastructure auditing? Log your transmission below.
        </p>
      </motion.section>

      {/* Cal.com Booking CTA */}
      <motion.section variants={itemVariants} className="space-y-4" id="contact-booking">
        <div className="bg-muted/10 border border-amber-color/20 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-amber-color tracking-widest uppercase font-semibold bg-amber-color/10 border border-amber-color/20 px-2.5 py-1 rounded-full">
              Book a Call
            </span>
            <span className="text-xs text-muted-foreground font-mono">· 30 min · Free · Google Meet</span>
          </div>
          <h2 className="font-display text-lg font-bold text-foreground">
            Schedule a Discovery Call
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
            Prefer to talk through your project live? Book a free 30-minute discovery call. We'll cover your requirements, tech constraints, and what a solution might look like.
          </p>
          <a
            href="https://cal.com/linacre"
            target="_blank"
            rel="noopener noreferrer"
            id="btn-book-call"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-color hover:bg-amber-color/90 text-black font-bold rounded-lg text-xs font-mono transition-all hover:shadow-lg cursor-pointer select-none"
            style={{ boxShadow: '0 0 12px rgba(245,158,11,0.25)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Book on Cal.com
          </a>
          <p className="text-[10px] text-muted-foreground/60 font-mono">
            Opens cal.com/linacre in a new tab · No account required · Instant confirmation
          </p>
        </div>
      </motion.section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Info Box */}
        <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
          <div className="bg-muted/10 border border-border-color rounded-xl p-6 space-y-4 font-mono text-xs text-muted-foreground">
            <h3 className="text-foreground font-bold text-sm">TRANSMISSION INFO</h3>
            <p className="leading-relaxed">
              We use your email and message to respond to this enquiry. Read the Privacy Policy for retention and contact details.
            </p>
            <div className="border-t border-border-color/30 pt-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan" />
                <span>HTTPS TLS Encryption Active</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Form Box */}
        <motion.div variants={itemVariants} className="lg:col-span-8">
          <div className="linacre-surface p-6 sm:p-8 relative overflow-hidden">
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 text-center space-y-4"
                >
                  <CheckCircle className="w-12 h-12 text-emerald-color mx-auto animate-bounce" />
                  <h3 className="font-display text-lg font-bold text-foreground">ENQUIRY RECEIVED</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto font-mono">
                    Thanks — your enquiry has been accepted with reference <span className="text-amber-color font-bold">{requestId}</span>. Keep this reference if you need to follow up.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-6 px-4 py-2 border border-border-color hover:border-amber-color text-amber-color font-mono text-xs rounded-lg hover:bg-amber-color/10 transition-all cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  {/* Honeypot: visually hidden, removed from tab order and AT. Bots that fill it are silently dropped server-side. */}
                  <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
                    <label htmlFor="company">Company (leave blank)</label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="email" className="block font-mono text-[10px] text-muted-foreground uppercase font-bold">Email Address *</label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-background/50 border border-border-color rounded-lg px-4 py-2 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-amber-color"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="subject" className="block font-mono text-[10px] text-muted-foreground uppercase font-bold">Subject / Project Area</label>
                    <input
                      id="subject"
                      type="text"
                      placeholder="e.g. Pipeline Design Consultation"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-background/50 border border-border-color rounded-lg px-4 py-2 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-amber-color"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="message" className="block font-mono text-[10px] text-muted-foreground uppercase font-bold">Transmission Body *</label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      placeholder="Outline your requirements, tech specs, or inquiries..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-background/50 border border-border-color rounded-lg px-4 py-2 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-amber-color"
                    />
                  </div>

                  <AnimatePresence>
                    {status === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-rose-950/20 border border-rose-500/30 text-rose-300 font-mono text-[11px] p-3 rounded-lg flex flex-col gap-2"
                      >
                        <div className="flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                          <span>{errorMessage}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground/80 pl-6">
                          Fallback: You can send your message directly via email to:{' '}
                          <a
                            href={`mailto:david@linacre.site?subject=${encodeURIComponent(subject || 'Enquiry')}&body=${encodeURIComponent(message)}`}
                            className="text-amber-color hover:underline font-bold"
                          >
                            david@linacre.site
                          </a>
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-border-color/30">
                    <p className="text-[10px] font-mono text-muted-foreground/60">
                      By submitting, you agree to our privacy policy. Your input is validated on the server.
                    </p>
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-color hover:bg-amber-color/90 text-black font-bold rounded-lg text-xs font-mono transition-colors disabled:opacity-50 cursor-pointer select-none"
                    >
                      {status === 'submitting' ? (
                        <>
                          <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full"
                          />
                          <span>Transmitting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <div className="linacre-pulse-line w-full my-8" />
      
      <motion.div variants={itemVariants}>
        <FAQ />
      </motion.div>
    </motion.div>
  );
}
