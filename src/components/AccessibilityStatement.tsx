import { motion } from 'motion/react';
import { Eye, HelpCircle, Shield, Award } from 'lucide-react';

export default function AccessibilityStatement() {
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
      <motion.section variants={itemVariants} className="text-center md:text-left space-y-4" id="a11y-hero">
        <span className="text-purple-color tracking-widest uppercase font-semibold bg-purple-color/10 border border-purple-color/20 px-2.5 py-1 rounded-full">
          Standard Conformance
        </span>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground mt-3">
          Accessibility <span className="text-purple-color">Statement</span>
        </h1>
        <p className="text-sm">
          // Adhering to WCAG 2.2 AA guidelines for design clarity.
        </p>
      </motion.section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="bg-muted/10 border border-border-color/60 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-foreground font-bold">
            <Eye className="w-4 h-4 text-purple-color" />
            <span>1. VISUAL CONTRAST RATIOS</span>
          </div>
          <p>
            All interface text-to-background color combinations are verified to exceed a 4.5:1 ratio, satisfying WCAG AA compliance. Theme colors scale dynamically using custom HSL tokens.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-muted/10 border border-border-color/60 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-foreground font-bold">
            <Shield className="w-4 h-4 text-purple-color" />
            <span>2. KEYBOARD CONTROL</span>
          </div>
          <p>
            The entire portfolio is traversable using keyboard sequences. Interactive layout elements include explicit `:focus-visible` outline rings to support user visibility.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-muted/10 border border-border-color/60 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-foreground font-bold">
            <Award className="w-4 h-4 text-purple-color" />
            <span>3. ARIA ATTRIBUTES</span>
          </div>
          <p>
            Interactive widgets (such as filter chips and modal overlays) are annotated with descriptive ARIA roles and labels to ensure screen readers parse context accurately.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-muted/10 border border-border-color/60 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-foreground font-bold">
            <HelpCircle className="w-4 h-4 text-purple-color" />
            <span>4. CONTACT FEEDBACK</span>
          </div>
          <p>
            If you encounter navigation issues or contrast hurdles anywhere on linacre.site, please submit an issue log via the contact page so we can repair it immediately.
          </p>
        </motion.div>
      </div>

      <motion.section variants={itemVariants} className="border-t border-border-color/30 pt-6 text-center">
        <p className="text-[10px] text-muted-foreground/60">
          Continuing to review and refine developer utilities for maximum inclusivity.
        </p>
      </motion.section>
    </motion.div>
  );
}
