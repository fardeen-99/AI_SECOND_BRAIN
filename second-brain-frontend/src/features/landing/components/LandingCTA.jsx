import React from 'react';
import { motion } from 'framer-motion';
import { Github, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionWrapper from './SectionWrapper';

// ─── Shared easing ─────────────────────────────────────────────────────────────
const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: EASE },
  }),
};

// ─── Section ───────────────────────────────────────────────────────────────────
const LandingCTA = () => {
  return (
    <SectionWrapper className="relative bg-obsidian-950 py-32 md:py-44 overflow-hidden">

      {/*
        ── Atmosphere ────────────────────────────────────────────────────────────
        The CTA is the emotional climax — it deserves more visual weight than
        the sections above. Two radial glows: one centred (warm accent) and one
        offset upper-right (cooler, near-white) create depth without adding
        any new hues to the palette.
      */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Central warm glow */}
        {/* <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full opacity-[0.09] blur-[80px]"
          style={{ background: 'var(--color-accent, #a78bfa)' }}
        /> */}
        {/* Upper-right cool accent */}
        {/* <div
          className="absolute -top-24 right-0 w-[400px] h-[400px] rounded-full opacity-[0.04] blur-[60px]"
          style={{ background: '#e0e7ff' }}
        /> */}
        {/* Hairline top border — transitions from the section above */}
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background:
              'linear-gradient(to right, transparent, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.06) 60%, transparent)',
          }}
        />
      </div>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <div className="relative max-w-3xl mx-auto px-6 md:px-10 text-center">

        {/*
          Eyebrow — matches section language across the page.
          Sets context before the heading lands.
        */}
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
          className="text-accent text-[10px] font-semibold tracking-[0.2em] uppercase mb-5"
        >
          Get started today
        </motion.p>

        {/*
          Heading — serif, fluid, consistent with every other section h2.
          "Second Brain" in accent colour (same treatment as "Sidekick").
          No scale animation — fade-up only.
        */}
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
          custom={0.5}
          className="font-serif font-black text-ivory leading-[1.06] tracking-[-0.03em] mb-6"
          style={{ fontSize: 'clamp(2.25rem, 6vw, 4rem)' }}
        >
          Start building your{' '}
          <span className="text-accent">Second Brain</span>{' '}
          today.
        </motion.h2>

        {/* Sub-copy — gives the CTA emotional weight */}
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
          custom={1}
          className="text-ivory/40 text-sm md:text-base leading-[1.8] max-w-[40ch] mx-auto mb-12"
        >
          Join thousands of researchers, engineers, and writers who never
          lose an idea again.
        </motion.p>

        {/*
          ── CTA buttons ─────────────────────────────────────────────────────────
          Primary: ivory fill (matches hero).
          Secondary: ghost (matches hero "Watch Demo").
          Both use rounded-artifact and the same text sizing — hierarchy
          is conveyed by fill, not by scale.
        */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
          custom={1.5}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12"
        >
          {/* Primary */}
          <Link
            to="/register"
            className="
              group inline-flex items-center gap-2.5
              px-7 py-3.5 rounded-artifact
              bg-ivory text-ink-950
              text-sm font-bold tracking-tight
              hover:bg-accent hover:text-white
              transition-all duration-200
              shadow-artifact
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-accent focus-visible:ring-offset-2
              focus-visible:ring-offset-ink-950
            "
          >
            Get Started Free
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>

          {/* Secondary — GitHub */}
          <a
            href="https://github.com/fardeen/AI_SECOND_BRAIN"
            target="_blank"
            rel="noopener noreferrer"
            className="
              group inline-flex items-center gap-2.5
              px-7 py-3.5 rounded-artifact
              fine-border
              text-ivory/60 text-sm font-semibold
              hover:text-ivory hover:border-ivory/20
              transition-all duration-200
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-ivory/30 focus-visible:ring-offset-2
              focus-visible:ring-offset-ink-950
            "
          >
            <Github className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
            Star on GitHub
            {/*
              Star icon — kept, but neutralised to ivory/50 rather than
              introducing yellow. Scales subtly (not aggressively) on hover.
            */}
            <Star
              className="w-3.5 h-3.5 text-ivory/30 group-hover:text-accent/80 transition-colors duration-200"
            />
          </a>
        </motion.div>

        {/*
          ── Social proof ──────────────────────────────────────────────────────
          Rewritten: sentence case, normal weight, readable opacity.
          Three micro-stats separated by middot — scannable at a glance.
        */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
          custom={2}
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2"
        >
          {[
            '10,000+ thinkers',
            'Free to start',
            'No credit card required',
          ].map((item, i) => (
            <React.Fragment key={item}>
              {i > 0 && (
                <span aria-hidden="true" className="text-ivory/15 text-xs select-none">·</span>
              )}
              <span className="text-ivory/30 text-xs font-medium">{item}</span>
            </React.Fragment>
          ))}
        </motion.div>

      </div>
    </SectionWrapper>
  );
};

export default LandingCTA;