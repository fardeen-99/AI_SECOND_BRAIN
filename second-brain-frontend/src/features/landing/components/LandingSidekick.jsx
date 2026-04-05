import React from 'react';
import { motion } from 'framer-motion';
import { Globe, FileText, Share2, ArrowRight, Chrome } from 'lucide-react';
import SectionWrapper from './SectionWrapper';

// ─── Feature list ──────────────────────────────────────────────────────────────
const capabilities = [
  {
    icon: Globe,
    title: 'One-click URL capture',
    detail: 'Save any page without leaving your tab.',
  },
  {
    icon: FileText,
    title: 'PDF OCR & Summarisation',
    detail: 'Full-text extraction and AI distillation in the background.',
  },
  {
    icon: Share2,
    title: 'Instant node tagging',
    detail: 'Auto-links new content into your Knowledge Graph on save.',
  },
];

// ─── Shared easing ─────────────────────────────────────────────────────────────
const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: EASE },
  }),
};

// ─── Capability row ────────────────────────────────────────────────────────────
const CapabilityRow = ({ item, index }) => {
  const Icon = item.icon;
  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={fadeUp}
      className="group flex items-start gap-4"
    >
      {/*
        Icon — resting: neutral; hover: accent tint.
        Uses rounded-artifact to match the design system.
      */}
      <div
        className="
          shrink-0 w-9 h-9 flex items-center justify-center
          rounded-artifact fine-border
          bg-obsidian-900/60 text-ivory/40
          group-hover:bg-accent/[0.08] group-hover:text-accent group-hover:border-accent/25
          transition-all duration-300 mt-0.5
        "
      >
        <Icon className="w-4 h-4" strokeWidth={1.5} />
      </div>

      <div>
        <p className="text-ivory/85 text-sm font-semibold leading-snug mb-0.5">
          {item.title}
        </p>
        <p className="text-ivory/35 text-xs leading-relaxed">
          {item.detail}
        </p>
      </div>
    </motion.div>
  );
};

// ─── Section ───────────────────────────────────────────────────────────────────
const LandingSidekick = ({ sidekickImg }) => {
  return (
    <SectionWrapper
      id="sidekick"
      className="bg-obsidian-950/20 py-28 md:py-36 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex flex-col lg:flex-row items-start gap-16 lg:gap-20 xl:gap-28">

          {/* ── Left column: text ──────────────────────────────────────────── */}
          <div className="flex-1 lg:max-w-[480px]">

            {/* Eyebrow — consistent with features + pipeline */}
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
              className="text-accent text-[10px] font-semibold tracking-[0.2em] uppercase mb-4"
            >
              Browser Extension
            </motion.p>

            {/*
              Heading — serif, fluid, matches section heading system.
              "Sidekick" gets a restrained accent treatment:
              color shift only (no underline), readable at all sizes.
            */}
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
              custom={0.5}
              className="font-serif font-black text-ivory leading-[1.06] tracking-[-0.03em] mb-7"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
            >
              The Omnipresent{' '}
              <span className="text-accent">Sidekick</span>
            </motion.h2>

            {/* Body copy */}
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
              custom={1}
              className="text-ivory/45 text-sm md:text-base leading-[1.8] mb-10 max-w-[42ch]"
            >
              Lives in your browser, ready to capture sparks of inspiration.
              Save a code snippet, a tweet, or a full whitepaper instantly —
              the AI processes everything in the background.
            </motion.p>

            {/* Capabilities */}
            <div className="flex flex-col gap-5 mb-10">
              {capabilities.map((item, idx) => (
                <CapabilityRow key={item.title} item={item} index={idx + 1.5} />
              ))}
            </div>

            {/*
              CTA — uses the same ghost-style button pattern from the hero
              so the extension download doesn't feel like the primary action
              (Get Started is). Consistent radius + border.
            */}
            <motion.a
              href="https://github.com/fardeen-99/AI_Second_Brain"
              target="_blank"
              rel="noopener noreferrer"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
              custom={5}
              className="
                group inline-flex items-center gap-3
                px-6 py-3.5 rounded-artifact
                fine-border
                text-ivory/60 text-sm font-semibold
                hover:text-ivory hover:border-ivory/20
                transition-all duration-200
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-accent focus-visible:ring-offset-2
                focus-visible:ring-offset-ink-950
              "
            >
              <Chrome className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
              Download Extension
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </motion.a>
          </div>

          {/* ── Right column: image ────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
            className="flex-1 w-full lg:w-auto"
          >
            {/*
              Browser chrome frame — gives the screenshot product context
              without needing a separate mockup asset.
            */}
            <div className="rounded-artifact-xl fine-border overflow-hidden shadow-deep">

              {/* ── Fake browser chrome ────────────────────────────────────── */}
              <div
                className="
                  flex items-center gap-2 px-4 py-3
                  bg-obsidian-900 border-b border-ivory/[0.06]
                "
              >
                {/* Traffic lights */}
                <div className="flex gap-1.5" aria-hidden="true">
                  <span className="w-2.5 h-2.5 rounded-full bg-ivory/10" />
                  <span className="w-2.5 h-2.5 rounded-full bg-ivory/10" />
                  <span className="w-2.5 h-2.5 rounded-full bg-ivory/10" />
                </div>

                {/* Fake URL bar */}
                <div
                  className="
                    flex-1 mx-3 px-3 py-1 rounded-md
                    bg-obsidian-800 border border-ivory/[0.06]
                    flex items-center gap-2
                  "
                >
                  <span className="w-2 h-2 rounded-full bg-accent/60 shrink-0" aria-hidden="true" />
                  <span className="text-ivory/25 text-[10px] font-mono truncate">
                    second-brain.app / knowledge-graph
                  </span>
                </div>

                {/* Extension indicator */}
                <div
                  className="
                    flex items-center gap-1.5 px-2 py-1 rounded-md
                    bg-accent/10 border border-accent/20
                  "
                  aria-label="Second Brain extension active"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
                  <span className="text-accent text-[9px] font-bold tracking-wide">ACTIVE</span>
                </div>
              </div>

              {/* ── Screenshot ─────────────────────────────────────────────── */}
              <div className="relative aspect-video bg-obsidian-900 overflow-hidden group">
                <img
                  src={sidekickImg}
                  alt="Second Brain browser extension sidebar — showing a captured article being processed and linked into the knowledge graph"
                  className="
                    w-full h-full object-cover object-top
                    transition-transform duration-700 ease-out
                    group-hover:scale-[1.02]
                  "
                />

                {/* Gradient — fade bottom into the next section */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(to bottom, transparent 60%, rgba(10,10,10,0.6) 100%)',
                  }}
                />

                {/* ── Save toast — simulates the extension in action ──────── */}
                <motion.div
                  initial={{ opacity: 0, y: 8, x: 8 }}
                  whileInView={{ opacity: 1, y: 0, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1, duration: 0.5, ease: EASE }}
                  className="
                    absolute bottom-5 right-5
                    flex items-center gap-2.5
                    px-3.5 py-2.5
                    rounded-artifact fine-border
                    bg-obsidian-900/90 backdrop-blur-sm
                    shadow-deep
                  "
                  aria-hidden="true"
                >
                  <span className="w-2 h-2 rounded-full bg-accent shadow-[0_0_6px_2px] shadow-accent/50 shrink-0" />
                  <span className="text-ivory/80 text-[11px] font-semibold">
                    Saved to Second Brain
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Caption below image */}
            <p className="mt-3 text-ivory/20 text-[11px] tracking-wide text-center">
              Extension sidebar · Chrome & Firefox · v1.4.2
            </p>
          </motion.div>

        </div>
      </div>
    </SectionWrapper>
  );
};

export default LandingSidekick;