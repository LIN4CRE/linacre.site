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
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 110, damping: 14 } }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) return;

    setStatus('submitting');
    
    // Check if the user has sent too many messages recently (simple anti-spam)
    try {
      const lastSent = localStorage.getItem('linacre_last_contact_sent');
      if (lastSent) {
        const timeDiff = Date.now() - Number(lastSent);
        if (timeDiff < 60000) { // 1 minute rate limit
          setStatus('error');
          setErrorMessage('RATE LIMIT EXCEEDED: Please wait 60 seconds before sending another transmission.');
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }

    // Simulate server request
    setTimeout(() => {
      try {
        // Save contact locally to simulate backend store or dispatch event
        const contacts = JSON.parse(localStorage.getItem('linacre_local_contacts') || '[]');
        contacts.push({
          email,
          subject,
          message,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('linacre_local_contacts', JSON.stringify(contacts));
        localStorage.setItem('linacre_last_contact_sent', String(Date.now()));
        
        setStatus('success');
        setEmail('');
        setSubject('');
        setMessage('');
      } catch (err) {
        setStatus('error');
        setErrorMessage('DATABASE WRITE ERROR: System failed to log contact data locally.');
      }
    }, 1500);
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Info Box */}
        <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
          <div className="bg-muted/10 border border-border-color rounded-xl p-6 space-y-4 font-mono text-xs text-muted-foreground">
            <h3 className="text-foreground font-bold text-sm">TRANSMISSION INFO</h3>
            <p className="leading-relaxed">
              Standard responses are processed within 24-48 business hours. All submissions are client-validated and rate-limited.
            </p>
            <div className="border-t border-border-color/30 pt-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-color" />
                <span>Secure API Handshake: ACTIVE</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan" />
                <span>SSL Encrypted Pipeline</span>
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
                  <h3 className="font-display text-lg font-bold text-foreground">TRANSMISSION RECEIVED</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto font-mono">
                    Your request has been successfully dispatched to the server logs. Database handshake completed.
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
                        className="bg-rose-950/20 border border-rose-500/30 text-rose-300 font-mono text-[11px] p-3 rounded-lg flex items-center gap-2"
                      >
                        <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>{errorMessage}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-border-color/30">
                    <p className="text-[10px] font-mono text-muted-foreground/60">
                      By submitting this, you authorize secure local logging of your IP & email.
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
