import React, { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

// Components
import LandingNavbar from '../features/landing/components/LandingNavbar';
import LandingHero from '../features/landing/components/LandingHero';
import LandingFeatures from '../features/landing/components/LandingFeatures';
import LandingPipeline from '../features/landing/components/LandingPipeline';
import LandingCaseStudy from '../features/landing/components/LandingCaseStudy';
import LandingSidekick from '../features/landing/components/LandingSidekick';
import LandingCTA from '../features/landing/components/LandingCTA';
import LandingFooter from '../features/landing/components/LandingFooter';



const LandingPage = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="bg-obsidian-950 min-h-screen text-white overflow-x-hidden selection:bg-accent selection:text-obsidian-950">
      <LandingNavbar />
      
      <main>
        <LandingHero graphImage={"https://wallpapercave.com/wp/wp6690976.jpg"} />
        <LandingFeatures />
        <LandingPipeline />
        <LandingCaseStudy 
          commandCenterImg={"https://blogs-cdn.imagine.art/ai_image_generator_hero_image_57699a1f24.png"} 
          neuralImg={"https://www.nextechar.com/hubfs/output%20%287%29-1.jpg"} 
          ragImg={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKexnUwRC8NU_gD_ClTyW7k1ncK629TP6GNQ&s"} 
        />
        <LandingSidekick sidekickImg={"https://www.lucrative.ai/wp-content/uploads/2021/03/Shopify-fb-google-sales-1024x624.jpg"} />
        <LandingCTA />
      </main>

      <LandingFooter />
    </div>
  );
};

export default LandingPage;
