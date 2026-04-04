import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useParallax } from '../../../hooks/useGsap';

gsap.registerPlugin(ScrollTrigger);

const LandingHero = ({ graphImage }) => {
  const headingRef = useRef(null);
  const subHeadingRef = useRef(null);
  const ctaRef = useRef(null);
  const badgeRef = useRef(null);
  const imageRef = useRef(null);
  const imageContainerRef = useRef(null);

  // Parallax on the hero image
  useParallax(imageContainerRef, 60);

  useEffect(() => {
    if (!headingRef.current) return;

    const ctx = gsap.context(() => {
      // Badge reveal
      gsap.fromTo(
        badgeRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: 'power3.out' }
      );

      // Split-text heading reveal
      const heading = headingRef.current;
      const originalHTML = heading.innerHTML;
      const textContent = heading.textContent;
      const words = textContent.split(/(\s+)/);

      heading.innerHTML = '';

      words.forEach((word) => {
        if (/^\s+$/.test(word)) {
          heading.appendChild(document.createTextNode(' '));
          return;
        }

        const wordSpan = document.createElement('span');
        wordSpan.style.display = 'inline-block';
        wordSpan.style.overflow = 'hidden';
        wordSpan.style.verticalAlign = 'top';

        [...word].forEach((char) => {
          const charSpan = document.createElement('span');
          charSpan.textContent = char;
          charSpan.style.display = 'inline-block';
          charSpan.style.transform = 'translateY(120%)';
          charSpan.classList.add('hero-char');
          wordSpan.appendChild(charSpan);
        });

        heading.appendChild(wordSpan);
      });

      const chars = heading.querySelectorAll('.hero-char');

      gsap.to(chars, {
        y: 0,
        duration: 0.8,
        stagger: 0.025,
        delay: 0.5,
        ease: 'power4.out',
      });

      // Sub heading
      gsap.fromTo(
        subHeadingRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 1.2, ease: 'power3.out' }
      );

      // CTA buttons
      gsap.fromTo(
        ctaRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 1.5, ease: 'power3.out' }
      );

      // Hero image
      gsap.fromTo(
        imageRef.current,
        { y: 80, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 1.4, delay: 0.8, ease: 'power3.out' }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative min-h-[140vh] md:min-h-[155vh] flex flex-col pt-32 md:pt-44 overflow-hidden">
      {/* Hero Content — Asymmetric Editorial Layout */}
      <div className="max-w-7xl mx-auto px-6 z-10 w-full">
        {/* Badge */}
        <div ref={badgeRef} className="opacity-0 mb-10">
          <span className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-artifact fine-border text-accent text-[11px] font-semibold tracking-[0.2em] uppercase">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-subtle-pulse absolute inline-flex h-full w-full rounded-full bg-accent"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent"></span>
            </span>
            Intelligence v2.0
          </span>
        </div>

        {/* Heading — Large Editorial Serif */}
        <h1
          ref={headingRef}
          className="font-serif text-5xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-black text-ivory leading-[1.02] tracking-[-0.03em] max-w-5xl"
        >
          Your AI-Powered Second Brain
        </h1>

        {/* Subheading — Clean sans-serif, muted */}
        <p
          ref={subHeadingRef}
          className="opacity-0 mt-8 md:mt-10 text-lg md:text-xl text-ivory/50 max-w-xl font-medium leading-relaxed"
        >
          Capture everything. Recall everything instantly with semantic search and RAG chat. Your knowledge, architecturally organized.
        </p>

        {/* CTA — Editorial buttons */}
        <div ref={ctaRef} className="opacity-0 mt-12 flex flex-col sm:flex-row items-start gap-5">
          <Link
            to="/register"
            className="group relative px-8 py-4 rounded-artifact bg-ivory text-ink-950 font-bold text-base hover:bg-accent transition-all duration-300 shadow-artifact"
          >
            <span className="relative z-10 flex items-center gap-2">
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </Link>
          <a
            href="https://drive.google.com/file/d/1YCjMkUpOn7zer00S5bwIJq7vqMG4NuOO/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="group px-8 py-4 rounded-artifact fine-border text-ivory/70 font-semibold text-base hover:text-ivory hover:border-ivory/20 transition-all duration-300 flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full fine-border flex items-center justify-center group-hover:bg-accent group-hover:border-accent group-hover:text-ink-950 transition-all duration-300">
              <Play className="w-3 h-3 fill-current ml-0.5" />
            </div>
            Watch Demo
          </a>
        </div>
      </div>

      {/* Hero Graph Image — with parallax */}
      <div
        ref={imageContainerRef}
        className="relative mt-20 md:mt-32 w-full max-w-[1400px] mx-auto px-6"
      >
        <div
          ref={imageRef}
          className="opacity-0 relative w-full h-[400px] md:h-[700px] rounded-artifact-xl overflow-hidden fine-border shadow-deep group cursor-zoom-in"
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent z-10 opacity-70" />

          <img
            src={graphImage}
            alt="Second Brain — Knowledge Graph Visualization"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />

          {/* Fine corner accent lines */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-ivory/10 rounded-tl-sm z-20" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-ivory/10 rounded-br-sm z-20" />
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
