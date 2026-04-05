import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Twitter, Github, Linkedin, ArrowUpRight } from 'lucide-react';

// ─── Data ──────────────────────────────────────────────────────────────────────
const footerLinks = [
  {
    title: 'Product',
    links: [
      { name: 'Features',   href: '#features' },
      { name: 'Case Study', href: '#cases' },
      { name: 'Changelog',  href: '#' },
      { name: 'Pricing',    href: '#' },
    ],
  },
  {
    title: 'Developer',
    links: [
      { name: 'GitHub',    href: '#', external: true },
      { name: 'API Docs',  href: '#' },
      { name: 'Status',    href: '#', external: true },
      { name: 'Discord',   href: '#', external: true },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About',           href: '#' },
      { name: 'Privacy Policy',  href: '#' },
      { name: 'Terms of Service',href: '#' },
      { name: 'Security',        href: '#' },
    ],
  },
];

const socials = [
  { icon: Twitter,  href: '#', label: 'Twitter / X' },
  { icon: Github,   href: '#', label: 'GitHub' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
];

// ─── Shared easing ─────────────────────────────────────────────────────────────
const EASE = [0.22, 1, 0.36, 1];

// ─── Component ────────────────────────────────────────────────────────────────
const LandingFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-obsidian-950 overflow-hidden">

      {/*
        ── Atmosphere ────────────────────────────────────────────────────────────
        Mirrors the CTA section glow so the page closes with the same warmth
        it opened with — a subtle visual bookend.
      */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-[0.06] blur-[80px]"
          style={{ background: 'var(--color-accent, #a78bfa)' }}
        />
      </div>

      {/* ── Main footer body ─────────────────────────────────────────────────── */}
      <div className="relative max-w-7xl mx-auto px-6 md:px-10 pt-20 pb-12">

        {/*
          ── Top row: brand + nav columns ──────────────────────────────────────
          Brand takes ~35% on desktop; nav columns fill the rest.
          On mobile they stack with brand always first.
        */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 pb-16 border-b border-ivory/[0.06]">

          {/* Brand column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            className="lg:w-[320px] shrink-0 flex flex-col"
          >
            {/* Wordmark */}
            <Link
              to="/"
              className="group inline-flex items-center gap-2.5 mb-6 w-fit"
              aria-label="Second Brain — home"
            >
              <div
                className="
                  w-8 h-8 rounded-artifact flex items-center justify-center
                  bg-accent/10 text-accent
                  group-hover:bg-accent group-hover:text-ink-950
                  transition-all duration-200
                "
              >
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <span className="font-serif font-black text-ivory text-lg tracking-tight">
                Human Brain
              </span>
            </Link>

            {/* Tagline */}
            <p className="text-ivory/35 text-sm leading-[1.75] mb-8 max-w-[28ch]">
              Your AI-powered knowledge system. Capture everything,
              recall anything, connect the dots automatically.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3 mt-auto">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="
                    w-8 h-8 rounded-artifact flex items-center justify-center
                    fine-border text-ivory/30
                    hover:text-ivory hover:border-ivory/20
                    transition-all duration-200
                  "
                >
                  <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Nav columns */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-12">
            {footerLinks.map((section, si) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: si * 0.08, ease: EASE }}
              >
                {/* Column heading — sentence case, not all-caps screaming */}
                <p className="text-ivory/25 text-[10px] font-semibold tracking-[0.18em] uppercase mb-5">
                  {section.title}
                </p>

                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                        className="
                          group inline-flex items-center gap-1
                          text-ivory/45 hover:text-ivory
                          text-sm font-medium
                          transition-colors duration-200
                        "
                      >
                        {link.name}
                        {link.external && (
                          <ArrowUpRight
                            className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-60 transition-all duration-200"
                            aria-hidden="true"
                          />
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/*
          ── Bottom bar ────────────────────────────────────────────────────────
          Copyright left, legal links right.
          Both use identical weight/size — no faux hierarchy in legal copy.
        */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-ivory/20 text-xs font-medium order-2 md:order-1">
            © {currentYear} DataNest AI Inc. All rights reserved.
          </p>

          <div className="flex items-center gap-1 order-1 md:order-2">
            {['Privacy', 'Terms', 'Cookies'].map((label, i, arr) => (
              <React.Fragment key={label}>
                <a
                  href="#"
                  className="text-ivory/20 hover:text-ivory/50 text-xs font-medium px-2.5 py-1 transition-colors duration-200"
                >
                  {label}
                </a>
                {i < arr.length - 1 && (
                  <span aria-hidden="true" className="text-ivory/10 text-xs select-none">·</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

      </div>

      {/*
        ── Wordmark watermark ─────────────────────────────────────────────────
        Large, extremely faint letterform fills the bottom of the page —
        gives the footer a sense of visual terminus without adding noise.
        Purely decorative, hidden from screen readers.
      */}
      <div
        aria-hidden="true"
        className="
          relative overflow-hidden h-25 md:h-34          flex items-end justify-center
          select-none pointer-events-none
        "
      >
        <span
          className="
            font-serif font-black text-ivory
            leading-none tracking-[-0.05em]
          
            opacity-[0.025]
            whitespace-nowrap
          "
          style={{ fontSize: 'clamp(4rem, 14vw, 10rem)' }}
        >
          Second Brain
        </span>
      </div>

    </footer>
  );
};

export default LandingFooter;