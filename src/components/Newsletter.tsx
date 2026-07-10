import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Check, AlertCircle } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setErrorMsg('INVALID EMAIL: Please supply a valid email address.');
      return;
    }

    setStatus('submitting');

    setTimeout(() => {
      try {
        const subscribers = JSON.parse(localStorage.getItem('linacre_newsletter_subscribers') || '[]');
        if (subscribers.includes(email)) {
          setStatus('error');
          setErrorMsg('DUPLICATE ENTRY: This email is already subscribed.');
          return;
        }
        subscribers.push(email);
        localStorage.setItem('linacre_newsletter_subscribers', JSON.stringify(subscribers));
        setStatus('success');
        setEmail('');
      } catch (err) {
        setStatus('error');
        setErrorMsg('STORAGE ERROR: System failed to register subscription.');
      }
    }, 1000);
  };

  return (
    <div className="bg-muted/10 border border-border-color rounded-xl p-6 relative overflow-hidden group">
      <div className="absolute -inset-10 opacity-[0.03] group-hover:opacity-[0.06] blur-2xl rounded-full bg-cyan pointer-events-none transition-opacity duration-300" />
      
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-cyan" />
          <h3 className="font-mono text-xs font-bold text-foreground uppercase tracking-wider">
            Subscribe to Stack Updates
          </h3>
        </div>
        
        <p className="text-xs text-muted-foreground leading-relaxed max-w-lg">
          Receive occasional transmissions about new tools, open-source architectures, and digital design guides. No spam, fully privacy-respecting.
        </p>

        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] p-3 rounded-lg flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>SUBSCRIPTION LOGGED: Welcome to the registry.</span>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleSubscribe}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  placeholder="enter your email..."
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  className="flex-1 bg-background/50 border border-border-color rounded-lg px-4 py-2 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-cyan placeholder:text-muted-foreground/45"
                  id="newsletter-email"
                />
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="px-4 py-2 bg-cyan hover:bg-cyan/90 disabled:opacity-50 text-black font-bold rounded-lg text-xs font-mono transition-colors cursor-pointer select-none"
                >
                  {status === 'submitting' ? 'Logging...' : 'Subscribe'}
                </button>
              </div>

              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-rose-400 font-mono text-[10px] flex items-center gap-1.5"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
