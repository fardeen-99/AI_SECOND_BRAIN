import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';

const LandingNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Case Study', href: '#cases' },
    { name: 'Sidekick', href: '#sidekick' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'py-3 glass-obsidian-heavy'
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo — Editorial serif monogram */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-artifact flex items-center justify-center fine-border group-hover:border-accent/30 transition-colors duration-300">
            <span className="font-serif text-lg font-bold text-ivory leading-none">D</span>
          </div>
          <span className="text-xl font-serif font-bold tracking-tight text-ivory">
            DataNest<span className="text-accent ml-1">.</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-ivory/50 hover:text-ivory transition-colors duration-300 tracking-wide"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-5">
          <Link
            to="/login"
            className="text-sm font-medium text-ivory/50 hover:text-ivory transition-colors duration-300"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="group px-5 py-2.5 rounded-artifact fine-border text-ivory text-sm font-semibold hover:border-accent/40 hover:text-accent transition-all duration-300"
          >
            Get Started
            <ArrowRight className="w-3.5 h-3.5 inline-block ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-ivory/70 hover:text-ivory transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-obsidian-heavy overflow-hidden"
          >
            <div className="flex flex-col gap-4 p-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-medium text-ivory/60 hover:text-ivory transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <hr className="border-ivory/5" />
              <Link to="/login" className="text-lg font-medium text-ivory/60">Sign In</Link>
              <Link
                to="/register"
                className="px-6 py-3 rounded-artifact fine-border-accent text-accent font-semibold text-center"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default LandingNavbar;
