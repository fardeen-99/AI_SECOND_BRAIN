import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Save, Cpu, HardDrive, Share2, MessageCircle } from 'lucide-react';
import SectionWrapper from './SectionWrapper';

// ─── Pipeline data ─────────────────────────────────────────────────────────────
const steps = [
  {
    icon: Save,
    label: 'Save',
    detail: 'URL & Files',
    description: 'One-click capture from any source — browser, file, or paste.',
  },
  {
    icon: Cpu,
    label: 'Process',
    detail: 'Summarisation',
    description: 'AI strips noise and distils the signal into structured memory.',
  },
  {
    icon: HardDrive,
    label: 'Collect',
    detail: 'Vector DB',
    description: 'Embeddings land in a high-dimensional store, ready to retrieve.',
  },
  {
    icon: Share2,
    label: 'Connect',
    detail: 'Knowledge Graph',
    description: 'Automatic links surface relationships across unrelated notes.',
  },
  {
    icon: MessageCircle,
    label: 'Chat',
    detail: 'Retrieval',
    description: 'Ask questions; get answers grounded in your own documents.',
  },
];

// ─── Shared variants ───────────────────────────────────────────────────────────
const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden:  { opacity: 0, y: 22 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: EASE },
  }),
};

const connectorVariants = {
  hidden:  { scaleX: 0, opacity: 0 },
  visible: (i = 0) => ({
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.5, delay: 0.3 + i * 0.1, ease: EASE },
  }),
};

// ─── Animated dashed line between steps (desktop) ────────────────────────────
const Connector = ({ index }) => (
  <motion.div
    custom={index}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-60px' }}
    variants={connectorVariants}
    aria-hidden="true"
    className="hidden md:block flex-1 origin-left"
  >
    {/* SVG dashed line so we can animate stroke-dashoffset later if wanted */}
    <svg
      className="w-full"
      height="2"
      viewBox="0 0 100 2"
      preserveAspectRatio="none"
    >
      <line
        x1="0" y1="1" x2="100" y2="1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="4 5"
        className="text-ivory/[0.12]"
      />
    </svg>
  </motion.div>
);

// ─── Mobile vertical connector ────────────────────────────────────────────────
const VerticalConnector = () => (
  <div
    aria-hidden="true"
    className="md:hidden self-center w-px h-10 bg-gradient-to-b from-accent/20 to-transparent"
  />
);

// ─── Single step node ─────────────────────────────────────────────────────────
const StepNode = ({ step, index, total }) => {
  const Icon = step.icon;
  const isLast = index === total - 1;

  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={fadeUp}
      className="
        group relative flex flex-col items-center
        flex-1 min-w-0
      "
    >
      {/*
        ── Step number ──────────────────────────────────────────────────────────
        Positioned above the node so the sequence reads before the icon.
        Faint by default; accent-tinted on hover.
      */}
      <span
        className="
          text-[10px] font-bold tracking-[0.2em] uppercase tabular-nums mb-3
          text-ivory/20 group-hover:text-accent/60
          transition-colors duration-300
        "
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      {/*
        ── Icon node ────────────────────────────────────────────────────────────
        Uses the design system radius (rounded-artifact).
        Resting: subtle border + dark fill.
        Hover: border brightens, icon tints to accent — no full-color flip.
      */}
      <div
        className="
          relative w-14 h-14 flex items-center justify-center
          rounded-artifact fine-border
          bg-obsidian-900/60
          text-ivory/40
          transition-all duration-300
          group-hover:border-accent/30 group-hover:text-accent
          group-hover:bg-accent/[0.06]
          mb-5
        "
      >
        <Icon className="w-6 h-6" strokeWidth={1.5} />

        {/* Completion dot — terminal step gets a filled accent dot */}
        {isLast && (
          <span
            aria-hidden="true"
            className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_8px_2px] shadow-accent/40"
          />
        )}
      </div>

      {/* Label + detail */}
      <h4 className="text-ivory/90 font-bold text-sm tracking-tight mb-1">
        {step.label}
      </h4>
      <p className="text-accent/70 text-[10px] font-semibold tracking-[0.15em] uppercase mb-3">
        {step.detail}
      </p>

      {/*
        ── Micro description ─────────────────────────────────────────────────────
        Hidden by default; slides in on hover.
        On mobile it's always visible to avoid reliance on hover.
      */}
      <p
        className="
          text-ivory/35 text-xs leading-relaxed text-center
          max-w-[140px]
          md:opacity-0 md:translate-y-2
          md:group-hover:opacity-100 md:group-hover:translate-y-0
          transition-all duration-300
        "
      >
        {step.description}
      </p>
    </motion.div>
  );
};

// ─── Section ───────────────────────────────────────────────────────────────────
const LandingPipeline = () => {
  return (
    <SectionWrapper className="bg-obsidian-900/10 py-28 md:py-36">
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/*
          ── Header — left-aligned for consistency with LandingFeatures ─────────
        */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-20 md:mb-24"
        >
          <div>
            <p className="text-accent text-[10px] font-semibold tracking-[0.2em] uppercase mb-4">
              How it works
            </p>
            <h2
              className="font-serif font-black text-ivory leading-[1.06] tracking-[-0.03em]"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
            >
              The Information Pipeline
            </h2>
          </div>
          <p className="text-ivory/40 text-sm md:text-base leading-relaxed max-w-xs md:text-right">
            From raw input to instant recall — five stages that run automatically in the background.
          </p>
        </motion.div>

        {/*
          ── Pipeline track ───────────────────────────────────────────────────────
          Desktop: horizontal flex with SVG dashed connectors between nodes.
          Mobile: vertical stack with simple gradient connectors.

          Using items-start keeps nodes top-aligned so connectors sit at
          a consistent vertical position between them.
        */}
        <div className="flex flex-col md:flex-row md:items-start gap-0 md:gap-0">
          {steps.map((step, idx) => (
            <React.Fragment key={step.label}>
              <StepNode step={step} index={idx} total={steps.length} />
              {idx < steps.length - 1 && (
                <>
                  {/* Desktop connector */}
                  <div className="hidden md:flex items-center mt-[52px]">
                    <Connector index={idx} />
                  </div>
                  {/* Mobile connector */}
                  <VerticalConnector />
                </>
              )}
            </React.Fragment>
          ))}
        </div>

        {/*
          ── Footer note ──────────────────────────────────────────────────────────
          Anchors the section and gives context to the full-bleed pipeline.
        */}
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={6}
          className="mt-16 text-center text-ivory/20 text-xs tracking-wide"
        >
          Every stage runs on your data — nothing leaves your account.
        </motion.p>

      </div>
    </SectionWrapper>
  );
};

export default LandingPipeline;