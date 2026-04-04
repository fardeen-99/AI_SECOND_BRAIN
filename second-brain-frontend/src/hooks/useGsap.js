import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * useGsapContext — Creates a GSAP context scoped to a container ref.
 * Auto-cleans all animations and ScrollTriggers on unmount.
 */
export function useGsapContext(containerRef) {
  const ctx = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    ctx.current = gsap.context(() => {}, containerRef);

    return () => {
      ctx.current?.revert();
    };
  }, [containerRef]);

  return ctx;
}

/**
 * useSplitTextReveal — Split-text character-by-character reveal with ScrollTrigger.
 * Wraps each character of the text element in a span and animates them in.
 * @param {React.RefObject} textRef — ref to the heading element
 * @param {object} options — { delay, stagger, trigger, start, scrub }
 */
export function useSplitTextReveal(textRef, options = {}) {
  useEffect(() => {
    if (!textRef.current) return;

    const element = textRef.current;
    const originalText = element.textContent;
    const {
      delay = 0,
      stagger = 0.03,
      start = 'top 85%',
      once = true,
    } = options;

    // Split into words, then wrap each word's characters
    const words = originalText.split(/(\s+)/);
    element.innerHTML = '';

    words.forEach((word) => {
      if (/^\s+$/.test(word)) {
        element.appendChild(document.createTextNode(word));
        return;
      }

      const wordSpan = document.createElement('span');
      wordSpan.style.display = 'inline-block';
      wordSpan.style.overflow = 'hidden';

      [...word].forEach((char) => {
        const charSpan = document.createElement('span');
        charSpan.textContent = char;
        charSpan.style.display = 'inline-block';
        charSpan.style.transform = 'translateY(110%)';
        charSpan.style.opacity = '0';
        charSpan.classList.add('split-char');
        wordSpan.appendChild(charSpan);
      });

      element.appendChild(wordSpan);
    });

    const chars = element.querySelectorAll('.split-char');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start,
        toggleActions: once ? 'play none none none' : 'play none none reverse',
      },
    });

    tl.to(chars, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger,
      delay,
      ease: 'power3.out',
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === element) st.kill();
      });
      // Restore original text
      element.textContent = originalText;
    };
  }, [textRef, options]);
}

/**
 * useParallax — Subtle y-transform parallax on scroll.
 * @param {React.RefObject} elementRef — ref to the element
 * @param {number} speed — parallax intensity (positive = moves up on scroll, negative = down)
 */
export function useParallax(elementRef, speed = 50) {
  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;

    const trigger = ScrollTrigger.create({
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.2,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.set(element, {
          y: (progress - 0.5) * speed,
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [elementRef, speed]);
}

/**
 * useScrollReveal — Fade-in + translateY reveal triggered by scroll.
 * @param {React.RefObject} elementRef — ref to the element
 * @param {object} options — { y, duration, delay, start }
 */
export function useScrollReveal(elementRef, options = {}) {
  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    const {
      y = 40,
      duration = 0.9,
      delay = 0,
      start = 'top 85%',
    } = options;

    gsap.set(element, { y, opacity: 0 });

    const trigger = ScrollTrigger.create({
      trigger: element,
      start,
      onEnter: () => {
        gsap.to(element, {
          y: 0,
          opacity: 1,
          duration,
          delay,
          ease: 'power3.out',
        });
      },
      once: true,
    });

    return () => {
      trigger.kill();
    };
  }, [elementRef, options]);
}

/**
 * useStaggerReveal — Stagger-reveal children of a container on scroll.
 * @param {React.RefObject} containerRef — ref to the parent container
 * @param {string} childSelector — CSS selector for children to animate
 * @param {object} options — { stagger, y, duration, start }
 */
export function useStaggerReveal(containerRef, childSelector = '> *', options = {}) {
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const children = container.querySelectorAll(childSelector);

    if (!children.length) return;

    const {
      stagger = 0.08,
      y = 50,
      duration = 0.7,
      start = 'top 80%',
    } = options;

    gsap.set(children, { y, opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start,
        toggleActions: 'play none none none',
      },
    });

    tl.to(children, {
      y: 0,
      opacity: 1,
      duration,
      stagger,
      ease: 'power3.out',
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === container) st.kill();
      });
    };
  }, [containerRef, childSelector, options]);
}
