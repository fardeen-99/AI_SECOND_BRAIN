import React from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  MessageSquare,
  Workflow,
  LayoutGrid,
  Globe,
  Zap,
} from 'lucide-react';
import SectionWrapper from './SectionWrapper';

// ─── Feature data ──────────────────────────────────────────────────────────────
// "featured" = spans two columns; gives one feature anchor status
const features = [
  {
    icon: Search,
    title: 'Semantic Search',
    description:
      'Find concepts, not just keywords. Our vector-based engine understands the full context of your notes — so "anxiety before launch" surfaces the entry titled "pre-ship nerves".',
    featured: true,
  },
  {
    icon: MessageSquare,
    title: 'RAG Chat',
    description:
      'Converse with your entire knowledge base. Get precise answers grounded in your actual documents, with source citations.',
  },
  {
    icon: Workflow,
    title: 'Knowledge Graph',
    description:
      'Visualise hidden connections. The graph links topics across your notes automatically — no manual tagging required.',
  },
  {
    icon: LayoutGrid,
    title: 'Smart Tagging',
    description:
      'AI classifies your content on ingest, so you never waste hours reorganising folders again.',
  },
  {
    icon: Globe,
    title: 'Browser Extension',
    description:
      'Save snippets, full pages, or research papers directly to your Second Brain with one click.',
  },

];

// ─── Animation variants ────────────────────────────────────────────────────────
const cardVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ─── Individual card ───────────────────────────────────────────────────────────
const FeatureCard = ({ feature, index }) => {
  const Icon = feature.icon;

  if (feature.featured) {
    // ── Featured (wide) card ─────────────────────────────────────────────────
    return (
      <motion.div
        custom={index}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={cardVariants}
        className="
          col-span-1 md:col-span-2
          group relative flex flex-col md:flex-row gap-10
          p-8 md:p-10
          rounded-artifact fine-border
          bg-obsidian-900/50
          hover:border-ivory/[0.12]
          transition-colors duration-300
          overflow-hidden
        "
      >
        {/* Ambient glow — single, intentional */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 -left-20 w-60 h-60 rounded-full opacity-[0.08] blur-3xl"
          style={{ background: 'var(--color-accent, #a78bfa)' }}
        />

        {/* Icon column */}
        <div className="shrink-0 flex items-start">
          <div
            className="
              w-14 h-14 rounded-artifact flex items-center justify-center
              bg-accent/10 text-accent
              transition-transform duration-300
              group-hover:scale-105
            "
          >
            <Icon className="w-7 h-7" strokeWidth={1.5} />
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2.5 mb-3">
            <h3 className="text-xl font-bold text-ivory tracking-tight">
              {feature.title}
            </h3>
            {/* "Core" label only on featured */}
            <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold tracking-[0.15em] uppercase bg-accent/10 text-accent border border-accent/20">
              Core
            </span>
          </div>
          <p className="text-ivory/45 leading-relaxed text-sm md:text-base max-w-xl">
            {feature.description}
          </p>
        </div>
      </motion.div>
    );
  }

  // ── Standard card ──────────────────────────────────────────────────────────
  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={cardVariants}
      className="
        group relative flex flex-col
        p-7
        rounded-artifact fine-border
        bg-obsidian-900/30
        hover:bg-obsidian-900/50
        hover:border-ivory/[0.1]
        transition-all duration-300
        overflow-hidden
      "
    >
      {/* Icon */}
      <div
        className="
          w-10 h-10 rounded-xl flex items-center justify-center mb-6
          bg-ivory/[0.05] text-ivory/60
          transition-all duration-300
          group-hover:bg-accent/10 group-hover:text-accent
        "
      >
        <Icon className="w-5 h-5" strokeWidth={1.5} />
      </div>

      {/* Text */}
      <h3 className="text-base font-bold text-ivory/90 tracking-tight mb-2.5">
        {feature.title}
      </h3>
      <p className="text-ivory/40 leading-relaxed text-sm">
        {feature.description}
      </p>

      {/*
        Subtle bottom accent line that grows on hover —
        replaces the noisy corner glow with something intentional.
      */}
      <div
        aria-hidden="true"
        className="
          absolute bottom-0 left-0 right-0 h-px
          bg-gradient-to-r from-transparent via-accent/30 to-transparent
          opacity-0 group-hover:opacity-100
          transition-opacity duration-500
        "
      />
    </motion.div>
  );
};

// ─── Section ───────────────────────────────────────────────────────────────────
const LandingFeatures = () => {
  return (
    <SectionWrapper id="features" className="bg-obsidian-950 py-28 md:py-36">
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/*
          ── Section header — left-aligned, asymmetric ──────────────────────────
          Left-aligned headers feel more editorial and confident than centered ones.
          The label + headline + description form a clear 3-level hierarchy.
        */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 md:mb-20"
        >
          <div className="max-w-xl">
            {/* Eyebrow */}
            <p className="text-accent text-[10px] font-semibold tracking-[0.2em] uppercase mb-4">
              What's inside
            </p>
            <h2
              className="font-serif font-black text-ivory leading-[1.06] tracking-[-0.03em]"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
            >
              Master Your Information
            </h2>
          </div>

          {/* Bridge copy — right column on desktop */}
          <p className="text-ivory/40 text-sm md:text-base leading-relaxed max-w-sm md:text-right">
            Six tightly integrated tools that turn a chaotic note collection
            into a living, queryable knowledge system.
          </p>
        </motion.div>

        {/*
          ── Bento-style grid ────────────────────────────────────────────────────
          Featured card spans 2 cols. The remaining 5 fill a 2→3 col grid.
          Uses subgrid-aware gap so spacing is consistent at every breakpoint.
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {features.map((feature, idx) => (
            <FeatureCard key={feature.title} feature={feature} index={idx} />
          ))}
        </div>

      </div>
    </SectionWrapper>
  );
};

export default LandingFeatures;