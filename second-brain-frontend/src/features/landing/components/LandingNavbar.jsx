import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Menu, X, ArrowRight, Zap } from 'lucide-react';

// ─── Nav links ─────────────────────────────────────────────────────────────────
const navLinks = [
  { name: 'Features',   href: '#features' },
  { name: 'Case Study', href: '#cases' },
  { name: 'Sidekick',   href: '#sidekick' },
];

const EASE = [0.22, 1, 0.36, 1];

// ─── Magnetic button — pulls toward cursor on hover ───────────────────────────
const MagneticCTA = ({ children, className, to }) => {
  const ref     = useRef(null);
  const x       = useMotionValue(0);
  const y       = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e) => {
    const rect    = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width  / 2;
    const centerY = rect.top  + rect.height / 2;
    x.set((e.clientX - centerX) * 0.25);
    y.set((e.clientY - centerY) * 0.25);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={to} className={className}>
        {children}
      </Link>
    </motion.div>
  );
};

// ─── Animated nav link with line-reveal underline ─────────────────────────────
const NavLink = ({ link, index }) => (
  <motion.a
    key={link.name}
    href={link.href}
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 + index * 0.07, ease: EASE }}
    className="group relative text-sm font-medium text-ivory/45 hover:text-ivory transition-colors duration-250 tracking-wide py-1"
  >
    {link.name}
    {/* Slide-in underline */}
    <span
      className="
        absolute -bottom-0.5 left-0 h-px w-0 bg-accent
        group-hover:w-full transition-all duration-300 ease-out
      "
      aria-hidden="true"
    />
  </motion.a>
);

// ─── Main component ────────────────────────────────────────────────────────────
const LandingNavbar = () => {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [scrollPct,   setScrollPct]   = useState(0);   // 0–100 for progress bar

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const docH   = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(docH > 0 ? (window.scrollY / docH) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      {/* ── Navbar ────────────────────────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE }}
        className={`
          fixed top-0 inset-x-0 z-50
          transition-all duration-500
          ${scrolled
            ? 'py-2.5 bg-obsidian-950/80 backdrop-blur-xl backdrop-saturate-150 border-b border-ivory/[0.05]'
            : 'py-5 bg-transparent'
          }
        `}
      >
        {/*
          ── Read-progress bar ────────────────────────────────────────────────
          A single-pixel accent line at the very top of the navbar tracks
          scroll depth — a subtle but memorable agency-level detail.
        */}
        <motion.div
          aria-hidden="true"
          className="absolute top-0 left-0 h-[1.5px] bg-accent origin-left"
          style={{ width: `${scrollPct}%` }}
          transition={{ duration: 0.1 }}
        />

        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">

          {/* ── Wordmark ──────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <Link
              to="/"
              className="group flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
              aria-label="Second Brain — home"
            >
              {/* Icon mark */}
              <div
                className="
                  relative w-7 h-7 rounded-artifact
                  flex items-center justify-center
                  bg-accent/10 text-accent
                  fine-border border-accent/20
                  group-hover:bg-accent group-hover:text-ink-950
                  transition-all duration-200
                "
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
              </div>

              {/* Wordmark */}
              <span className="font-serif font-black text-ivory text-[1.05rem] tracking-[-0.02em] leading-none">
                Human
                <span className="text-accent ml-1">Brain</span>
              </span>
            </Link>
          </motion.div>

          {/* ── Desktop links ──────────────────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-9">
            {navLinks.map((link, i) => (
              <NavLink key={link.name} link={link} index={i} />
            ))}
          </div>

          {/* ── Desktop actions ────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="hidden md:flex items-center gap-4"
          >
            {/* Sign in — text link */}
            <Link
              to="/login"
              className="text-sm font-medium text-ivory/40 hover:text-ivory transition-colors duration-200 tracking-wide"
            >
              Sign in
            </Link>

            {/*
              Get Started — magnetic CTA.
              Filled ivory → accent on hover, matching the hero primary button.
              The magnetic pull effect is the one thing visitors will remember.
            */}
            <MagneticCTA
              to="/register"
              className="
                group inline-flex items-center gap-2
                px-5 py-2.5 rounded-artifact
                bg-ivory text-ink-950
                text-sm font-bold tracking-tight
                hover:bg-accent hover:text-white
                transition-all duration-200
                shadow-artifact
                focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-accent
                focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950
              "
            >
              Get Started
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </MagneticCTA>
          </motion.div>

          {/* ── Mobile toggle ──────────────────────────────────────────────── */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="
              md:hidden relative w-9 h-9 flex items-center justify-center
              rounded-artifact fine-border text-ivory/60
              hover:text-ivory hover:border-ivory/20
              transition-all duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
            "
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -45, opacity: 0 }}
                  animate={{ rotate: 0,   opacity: 1 }}
                  exit={{   rotate:  45, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-4 h-4" />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ rotate:  45, opacity: 0 }}
                  animate={{ rotate: 0,   opacity: 1 }}
                  exit={{   rotate: -45, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-4 h-4" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.nav>

      {/*
        ── Mobile menu — full-viewport overlay ───────────────────────────────
        Not a dropdown. Full-screen with staggered link reveals gives it weight
        and prevents the cramped "accordion" feeling.
      */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)'   }}
            exit={{   opacity: 0, clipPath: 'inset(0 0 100% 0)'  }}
            transition={{ duration: 0.45, ease: EASE }}
            className="
              fixed inset-0 z-40
              bg-obsidian-950/98 backdrop-blur-xl
              flex flex-col
              px-6 pt-24 pb-12
              md:hidden
            "
          >
            {/* Nav links — staggered */}
            <nav className="flex flex-col gap-1 flex-1" aria-label="Mobile navigation">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0   }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.07, ease: EASE }}
                  onClick={() => setMobileOpen(false)}
                  className="
                    group flex items-center justify-between
                    py-4 border-b border-ivory/[0.05]
                    text-2xl font-serif font-black text-ivory/60
                    hover:text-ivory transition-colors duration-200
                  "
                >
                  {link.name}
                  <ArrowRight
                    className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-40 group-hover:translate-x-0 transition-all duration-200"
                    aria-hidden="true"
                  />
                </motion.a>
              ))}
            </nav>

            {/* Mobile CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0  }}
              transition={{ duration: 0.4, delay: 0.35, ease: EASE }}
              className="flex flex-col gap-3 mt-8"
            >
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="
                  w-full py-4 rounded-artifact
                  bg-ivory text-ink-950
                  text-sm font-bold text-center tracking-tight
                  hover:bg-accent hover:text-white
                  transition-all duration-200
                "
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="
                  w-full py-4 rounded-artifact
                  fine-border text-ivory/50
                  text-sm font-semibold text-center
                  hover:text-ivory hover:border-ivory/20
                  transition-all duration-200
                "
              >
                Sign in
              </Link>
            </motion.div>

            {/* Bottom brand watermark */}
            <p
              aria-hidden="true"
              className="mt-8 font-serif font-black text-ivory/[0.04] text-5xl tracking-tight select-none"
            >
              Second Brain
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LandingNavbar;