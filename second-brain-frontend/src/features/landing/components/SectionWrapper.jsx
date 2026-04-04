import React, { useRef } from 'react';
import { useScrollReveal } from '../../../hooks/useGsap';

const SectionWrapper = ({ children, className = "", id = "" }) => {
  const sectionRef = useRef(null);
  useScrollReveal(sectionRef, { y: 30, duration: 0.9 });

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`relative px-6 py-20 md:py-28 lg:py-36 overflow-hidden ${className}`}
    >
      {children}
    </section>
  );
};

export default SectionWrapper;
