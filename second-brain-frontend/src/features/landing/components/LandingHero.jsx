import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useParallax } from '../../../hooks/useGsap';

gsap.registerPlugin(ScrollTrigger);

// ─── Trust stats shown below the CTA ──────────────────────────────────────────
const STATS = [
  { value: '10k+', label: 'Notes indexed' },
  { value: '< 200ms', label: 'Recall latency' },
  { value: '99.9%', label: 'Uptime' },
];

const LandingHero = ({ graphImage }) => {
  const headingRef        = useRef(null);
  const subHeadingRef     = useRef(null);
  const ctaRef            = useRef(null);
  const badgeRef          = useRef(null);
  const statsRef          = useRef(null);
  const imageRef          = useRef(null);
  const imageContainerRef = useRef(null);

  useParallax(imageContainerRef, 50);

  useEffect(() => {
    if (!headingRef.current) return;

    const ctx = gsap.context(() => {
      // ── badge ──────────────────────────────────────────────────────────────
      gsap.fromTo(
        badgeRef.current,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, delay: 0.15, ease: 'power3.out' }
      );

      // ── heading character reveal ───────────────────────────────────────────
      const heading     = headingRef.current;
      const textContent = heading.textContent;
      const words       = textContent.split(/(\s+)/);
      heading.innerHTML = '';

      words.forEach((word) => {
        if (/^\s+$/.test(word)) {
          heading.appendChild(document.createTextNode(' '));
          return;
        }
        const wordSpan = document.createElement('span');
        wordSpan.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:top;';
        [...word].forEach((char) => {
          const charSpan = document.createElement('span');
          charSpan.textContent = char;
          charSpan.style.cssText = 'display:inline-block;transform:translateY(115%);';
          charSpan.classList.add('hero-char');
          wordSpan.appendChild(charSpan);
        });
        heading.appendChild(wordSpan);
      });

      gsap.to(heading.querySelectorAll('.hero-char'), {
        y: 0,
        duration: 0.75,
        stagger: 0.018,
        delay: 0.45,
        ease: 'power4.out',
      });

      // ── sub-heading + cta + stats ──────────────────────────────────────────
      gsap.fromTo(
        [subHeadingRef.current, ctaRef.current, statsRef.current],
        { y: 24, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.75,
          stagger: 0.15,
          delay: 1.1,
          ease: 'power3.out',
        }
      );

      // ── image ──────────────────────────────────────────────────────────────
      gsap.fromTo(
        imageRef.current,
        { y: 70, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 1.3, delay: 0.7, ease: 'power3.out' }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative flex flex-col pt-28 md:pt-40 pb-0 overflow-hidden">
      {/*
        ── Ambient background glow ─────────────────────────────────────────────
        Subtle radial that references the existing ink/accent palette.
        Kept very low opacity so it reads as atmosphere, not decoration.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-[0.07] blur-3xl"
        style={{ background: 'radial-gradient(ellipse at center, var(--color-accent, #a78bfa) 0%, transparent 70%)' }}
      />

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 z-10 w-full">

        {/* Badge */}
        <div ref={badgeRef} className="opacity-0 mb-8">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full fine-border text-accent text-[10px] font-semibold tracking-[0.18em] uppercase select-none">
            <Sparkles className="w-3 h-3 opacity-80" />
            Second Brain · v2.0
          </span>
        </div>

        {/*
          ── Heading ───────────────────────────────────────────────────────────
          Tighter, more intentional fluid scale.
          clamp() gives smooth interpolation so no jumps between breakpoints.
        */}
        <h1
          ref={headingRef}
          className="font-serif font-black text-ivory leading-[1.04] tracking-[-0.035em]"
          style={{ fontSize: 'clamp(2.75rem, 8vw, 6rem)' }}
        >
          Your AI-Powered Second Human Brain
        </h1>

        {/*
          ── Two-column layout on desktop ──────────────────────────────────────
          Sub-heading sits left; CTA + stats anchor the bottom-right on large screens.
          On mobile everything stacks naturally.
        */}
        <div className="mt-10 md:mt-12 flex flex-col md:flex-row md:items-end md:justify-between gap-10 md:gap-16">

          {/* Sub-heading */}
          <p
            ref={subHeadingRef}
            className="opacity-0 text-base md:text-lg text-ivory/50 max-w-md font-medium leading-[1.75]"
          >
          Capture everything. Instantly retrieve insights with semantic search and RAG chat — your knowledge, intelligently structured.
          </p>

          {/* CTA group */}
          <div ref={ctaRef} className="opacity-0 flex flex-col gap-8 shrink-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">

              {/* Primary CTA */}
              <Link
                to="/register"
                className="
                  group relative inline-flex items-center gap-2.5
                  px-7 py-3.5 rounded-artifact
                  bg-ivory text-ink-950
                  text-sm font-bold tracking-tight
                  transition-all duration-200
                  hover:bg-accent hover:text-white
                  shadow-artifact focus-visible:outline-none
                  focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
                  focus-visible:ring-offset-ink-950
                "
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>

              {/* Ghost CTA — simplified; the play icon speaks for itself */}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group inline-flex items-center gap-2.5
                  px-7 py-3.5 rounded-artifact
                  fine-border
                  text-ivory/60 text-sm font-semibold
                  transition-all duration-200
                  hover:text-ivory hover:border-ivory/25
                  focus-visible:outline-none
                  focus-visible:ring-2 focus-visible:ring-ivory/30 focus-visible:ring-offset-2
                  focus-visible:ring-offset-ink-950
                "
              >
                <span
                  className="
                    inline-flex items-center justify-center
                    w-6 h-6 rounded-full
                    fine-border
                    transition-all duration-200
                    group-hover:bg-accent group-hover:border-accent group-hover:text-white
                  "
                  aria-hidden="true"
                >
                  <Play className="w-2.5 h-2.5 fill-current ml-px" />
                </span>
                Watch Demo
              </a>
            </div>
          </div>
        </div>

        {/* Trust stats — thin divider line above */}
        <div
          ref={statsRef}
          className="opacity-0 mt-12 pt-8 border-t border-ivory/[0.07] flex flex-wrap gap-x-10 gap-y-4"
        >
          {STATS.map(({ value, label }) => (
            <div key={label} className="flex flex-col gap-0.5">
              <span className="text-ivory text-sm font-bold tracking-tight tabular-nums">
                {value}
              </span>
              <span className="text-ivory/35 text-[11px] font-medium tracking-wide uppercase">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/*
        ── Hero image ────────────────────────────────────────────────────────────
        Full-bleed up to max-width. Height uses aspect-ratio so it scales
        correctly on every viewport without magic px values.
      */}
      <div
        ref={imageContainerRef}
        className="relative mt-16 md:mt-24 w-full max-w-[1400px] mx-auto px-4 md:px-8"
      >
        <figure
          ref={imageRef}
          className="
            opacity-0 relative w-full overflow-hidden
            rounded-t-[20px] md:rounded-t-[28px]
            fine-border border-b-0
            shadow-deep
            group cursor-zoom-in
          "
          style={{ aspectRatio: '16 / 8' }}
        >
          {/*
            Gradient: lighter at the bottom so the image fades cleanly
            into the next section rather than abruptly cropping.
          */}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background:
                'linear-gradient(to bottom, transparent 55%, var(--color-ink-950, #0a0a0a) 100%)',
            }}
          />

          <img
            src={graphImage}
            alt="Second Brain — Knowledge Graph Visualization"
            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.025]"
          />

          {/*
            Subtle inner glow along the top edge — gives the image a
            "floating panel" feel consistent with the app aesthetic.
          */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px z-20"
            style={{
              background:
                'linear-gradient(to right, transparent, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.08) 60%, transparent)',
            }}
          />

          {/* Corner accents — increased contrast */}
          <div aria-hidden="true" className="absolute top-5 left-5 w-6 h-6 border-t border-l border-ivory/20 rounded-tl-sm z-20" />
          <div aria-hidden="true" className="absolute top-5 right-5 w-6 h-6 border-t border-r border-ivory/20 rounded-tr-sm z-20" />
        </figure>
      </div>
    </section>
  );
};

export default LandingHero;