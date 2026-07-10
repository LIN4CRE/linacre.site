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
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 110, damping: 14 } }
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
          // System transmission date: July 10, 2026. Zero tracking cookies active.
        </p>
      </motion.section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="bg-muted/10 border border-border-color/60 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-foreground font-bold">
            <Lock className="w-4 h-4 text-cyan" />
            <span>1. DATA COLLECTION PROTOCOLS</span>
          </div>
          <p>
            linacre.site does not collect or log personal telemetry, tracking analytics, or behavioral advertising cookies. We use browser Local Storage solely for functional user preferences (such as light/dark theme selection and active tab state).
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-muted/10 border border-border-color/60 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-foreground font-bold">
            <Database className="w-4 h-4 text-cyan" />
            <span>2. SECURE CONTACT FIELDS</span>
          </div>
          <p>
            Submissions via the Contact Form are transmitted securely over SSL to our contact API. Message contents are processed solely to address your inquiries and are retained for a maximum of 30 days following resolution.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-muted/10 border border-border-color/60 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-foreground font-bold">
            <ShieldCheck className="w-4 h-4 text-cyan" />
            <span>3. CHATBOT PROCESSING</span>
          </div>
          <p>
            The floating AI chatbot processes prompts statelessly via our secure rate-limited API, which forwards queries directly to the Gemini API. Chat history is held in transient memory for the current session only and is not retained.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-muted/10 border border-border-color/60 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-foreground font-bold">
            <UserCheck className="w-4 h-4 text-cyan" />
            <span>4. DATA CONTROLLER & RIGHTS</span>
          </div>
          <p>
            David Linacre is the Data Controller. You can clear all local storage cache items directly via browser controls or inside the Identity Hub. For questions, data access, or deletion requests, contact us at david@linacre.site.
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
