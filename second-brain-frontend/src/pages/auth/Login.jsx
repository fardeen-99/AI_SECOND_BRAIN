import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, ArrowLeft, ArrowRight, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useLogin } from '../../hooks/useAuth';
import { notify } from '../../utils/toast';
import { getPreferredLandingRoute } from '../../utils/userPreferences';

// ─── Shared easing ─────────────────────────────────────────────────────────────
const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: EASE },
  }),
};

// ─── Input field — self-contained, design-system aligned ──────────────────────
const Field = ({ label, id, icon: Icon, type = 'text', placeholder, value, onChange, required, action }) => (
  <motion.div
    custom={0}
    variants={fadeUp}
    className="flex flex-col gap-2"
  >
    <label
      htmlFor={id}
      className="text-ivory/50 text-xs font-semibold tracking-[0.12em] uppercase"
    >
      {label}
    </label>

    <div className="group relative">
      {/* Leading icon */}
      <Icon
        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ivory/20 group-focus-within:text-accent transition-colors duration-200 pointer-events-none"
        strokeWidth={1.5}
        aria-hidden="true"
      />

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={id === 'email' ? 'email' : id === 'password' ? 'current-password' : undefined}
        className="
          w-full pl-10 pr-10 py-3
          rounded-artifact fine-border
          bg-obsidian-900/60 text-ivory
          text-sm font-medium
          placeholder:text-ivory/20
          outline-none
          focus:border-accent/40 focus:bg-obsidian-900/80
          transition-all duration-200
          autofill:bg-obsidian-900/60
        "
      />

      {/* Trailing action (e.g. show/hide password) */}
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ivory/20 hover:text-ivory/50 transition-colors duration-200"
          aria-label={action.label}
          tabIndex={-1}
        >
          <action.icon className="w-4 h-4" strokeWidth={1.5} />
        </button>
      )}
    </div>
  </motion.div>
);

// ─── Page ──────────────────────────────────────────────────────────────────────
const Login = () => {
  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [showPass,    setShowPass]    = useState(false);

  const navigate              = useNavigate();
  const { loginUser, loading } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      notify.warning('Enter both email and password to continue.', {
        toastId: 'login-validation',
      });
      return;
    }
    const result = await loginUser({ email: email.trim(), password });
    if (result.success) navigate(getPreferredLandingRoute());
  };

  return (
    <div className="relative min-h-screen bg-obsidian-950 flex items-center justify-center p-4 overflow-hidden">

      {/*
        ── Atmosphere — mirrors the CTA / footer glow ─────────────────────────
        Keeps the auth page feeling like it belongs to the same product.
      */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full opacity-[0.07] blur-[90px]"
          style={{ background: 'var(--color-accent, #a78bfa)' }}
        />
        <div
          className="absolute -bottom-32 right-0 w-[350px] h-[350px] rounded-full opacity-[0.03] blur-[70px]"
          style={{ background: '#e0e7ff' }}
        />
      </div>

      {/* ── Back to home ────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0  }}
        transition={{ duration: 0.5, ease: EASE }}
        className="absolute top-6 left-6 md:top-8 md:left-10"
      >
        <Link
          to="/"
          className="
            group inline-flex items-center gap-2
            text-ivory/30 hover:text-ivory
            text-xs font-semibold tracking-wide uppercase
            transition-colors duration-200
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm
          "
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Back
        </Link>
      </motion.div>

      {/* ── Card ────────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.98 }}
        animate={{ opacity: 1, y: 0,  scale: 1    }}
        transition={{ duration: 0.65, ease: EASE }}
        className="
          relative w-full max-w-[400px]
          rounded-artifact-xl fine-border
          bg-obsidian-900/50 backdrop-blur-sm
          p-8 md:p-10
          shadow-deep
        "
      >
        {/* Top hairline accent */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px rounded-t-artifact-xl overflow-hidden"
          style={{
            background:
              'linear-gradient(to right, transparent, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.06) 60%, transparent)',
          }}
        />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="flex flex-col gap-0"
        >
          {/* ── Header ──────────────────────────────────────────────────────── */}
          <motion.div variants={fadeUp} className="flex flex-col items-start gap-5 mb-8">
            {/* Wordmark */}
            <Link
              to="/"
              className="group inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
              aria-label="Second Brain — home"
            >
              <div
                className="
                  w-7 h-7 rounded-artifact flex items-center justify-center
                  bg-accent/10 text-accent fine-border border-accent/20
                  group-hover:bg-accent group-hover:text-ink-950
                  transition-all duration-200
                "
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
              </div>
              <span className="font-serif font-black text-ivory text-base tracking-tight">
                Second<span className="text-accent ml-1">Brain</span>
              </span>
            </Link>

            {/* Heading */}
            <div>
              <h1 className="font-serif font-black text-ivory tracking-[-0.03em] leading-tight mb-1.5"
                  style={{ fontSize: 'clamp(1.6rem, 4vw, 2rem)' }}>
                Welcome back
              </h1>
              <p className="text-ivory/35 text-sm leading-relaxed">
                Sign in to access your knowledge base.
              </p>
            </div>
          </motion.div>

          {/* ── Form ────────────────────────────────────────────────────────── */}
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

            <motion.div variants={fadeUp}>
              <Field
                label="Email"
                id="email"
                icon={Mail}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-col gap-1.5">
              <Field
                label="Password"
                id="password"
                icon={Lock}
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                action={{
                  icon:    showPass ? EyeOff : Eye,
                  label:   showPass ? 'Hide password' : 'Show password',
                  onClick: () => setShowPass((v) => !v),
                }}
              />
        
            </motion.div>

            {/* Submit */}
            <motion.div variants={fadeUp} custom={3} className="mt-2">
              <button
                type="submit"
                disabled={loading}
                className="
                  group w-full inline-flex items-center justify-center gap-2.5
                  py-3.5 rounded-artifact
                  bg-ivory text-ink-950
                  text-sm font-bold tracking-tight
                  hover:bg-accent hover:text-white
                  disabled:opacity-40 disabled:cursor-not-allowed
                  transition-all duration-200
                  shadow-artifact
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-accent focus-visible:ring-offset-2
                  focus-visible:ring-offset-obsidian-900
                "
              >
                {loading ? (
                  <>
                    {/* Spinner */}
                    <svg
                      className="w-4 h-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                      <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a10 10 0 00-10 10h4z" />
                    </svg>
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </motion.div>
          </form>

          {/* ── Footer link ─────────────────────────────────────────────────── */}
          <motion.p
            variants={fadeUp}
            custom={4}
            className="mt-8 text-center text-ivory/30 text-xs font-medium"
          >
            No account yet?{' '}
            <Link
              to="/register"
              className="text-accent hover:text-ivory font-semibold transition-colors duration-200"
            >
              Create one free
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>

      {/*
        ── Ghost wordmark watermark ─────────────────────────────────────────────
        Matches the footer treatment — consistent visual language on full-page views.
      */}
      <p
        aria-hidden="true"
        className="
          fixed bottom-6 left-1/2 -translate-x-1/2
          font-serif font-black text-ivory
          opacity-[0.025] text-3xl tracking-tight
          select-none pointer-events-none whitespace-nowrap
        "
      >
        Second Brain
      </p>
    </div>
  );
};

export default Login;