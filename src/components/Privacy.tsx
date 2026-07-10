import { motion } from 'motion/react';
import { ShieldCheck, Lock, Database, UserCheck } from 'lucide-react';

export default function Privacy() {
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

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-12 max-w-4xl mx-auto font-mono text-xs text-muted-foreground leading-relaxed py-6"
    >
      <motion.section variants={itemVariants} className="text-center md:text-left space-y-4" id="privacy-hero">
        <span className="text-cyan tracking-widest uppercase font-semibold bg-cyan/10 border border-cyan/20 px-2.5 py-1 rounded-full">
          Compliance & Disclosures
        </span>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground mt-3">
          Privacy <span className="text-cyan">Policy</span>
        </h1>
        <p className="text-sm">
          // System transmission date: July 10, 2026. Zero telemetry protocols active.
        </p>
      </motion.section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="bg-muted/10 border border-border-color/60 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-foreground font-bold">
            <Lock className="w-4 h-4 text-cyan" />
            <span>1. DATA COLLECTION PROTOCOLS</span>
          </div>
          <p>
            linacre.site does not collect or log personal telemetry, analytics, or behavioral cookies. All client-side parameters are kept in local sandboxes.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-muted/10 border border-border-color/60 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-foreground font-bold">
            <Database className="w-4 h-4 text-cyan" />
            <span>2. SECURE CONTACT FIELDS</span>
          </div>
          <p>
            Submissions via the Secure Contact form are buffered and logged locally within your browser's Local Storage for validation. If forwarded to backend dispatch services, they are encrypted in transit via SSL.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-muted/10 border border-border-color/60 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-foreground font-bold">
            <ShieldCheck className="w-4 h-4 text-cyan" />
            <span>3. CHATBOT RETENTION</span>
          </div>
          <p>
            The floating AI chatbot processes transient prompts via a secure rate-limited `/api/chat` API endpoint. Prompt history is not retained or used for underlying LLM training sets.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-muted/10 border border-border-color/60 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-foreground font-bold">
            <UserCheck className="w-4 h-4 text-cyan" />
            <span>4. USER RIGHTS & CONTROL</span>
          </div>
          <p>
            As a decentralized architecture, you can clear all active state caches (including newsletter and contact records) by invoking 'Clear Caches' in your browser controls or inside the Identity Hub.
          </p>
        </motion.div>
      </div>

      <motion.section variants={itemVariants} className="border-t border-border-color/30 pt-6 text-center">
        <p className="text-[10px] text-muted-foreground/60">
          For technical security disclosures or registry complaints, dispatch a transmission using the main Contact Hub.
        </p>
      </motion.section>
    </motion.div>
  );
}
