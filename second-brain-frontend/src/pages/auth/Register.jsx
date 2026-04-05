import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap,
  ArrowLeft,
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User
} from 'lucide-react';

import { useRegister } from '../../hooks/useAuth';
import { notify } from '../../utils/toast';

// ─── Shared easing ─────────────────────────────────────────────────────────────
const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: EASE },
  }),
};

// ─── Field Component (same as login) ───────────────────────────────────────────
const Field = ({
  label,
  id,
  icon: Icon,
  type = 'text',
  placeholder,
  value,
  onChange,
  required,
  action
}) => (
  <motion.div variants={fadeUp} className="flex flex-col gap-2">
    <label
      htmlFor={id}
      className="text-ivory/50 text-xs font-semibold tracking-[0.12em] uppercase"
    >
      {label}
    </label>

    <div className="group relative">
      <Icon
        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ivory/20 group-focus-within:text-accent transition-colors duration-200"
        strokeWidth={1.5}
      />

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="
          w-full pl-10 pr-10 py-3
          rounded-artifact fine-border
          bg-obsidian-900/60 text-ivory
          text-sm font-medium
          placeholder:text-ivory/20
          outline-none
          focus:border-accent/40 focus:bg-obsidian-900/80
          transition-all duration-200
        "
      />

      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ivory/20 hover:text-ivory/50"
        >
          <action.icon className="w-4 h-4" />
        </button>
      )}
    </div>
  </motion.div>
);

// ─── Register Page ─────────────────────────────────────────────────────────────
const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const navigate = useNavigate();
  const { registerUser, loading } = useRegister();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !email.trim() || !password.trim()) {
      notify.warning('Complete every field before creating your account.', {
        toastId: 'register-validation',
      });
      return;
    }

    if (password.trim().length < 6) {
      notify.warning('Use a password with at least 6 characters.', {
        toastId: 'register-password-validation',
      });
      return;
    }

    const result = await registerUser({
      username: username.trim(),
      email: email.trim(),
      password,
    });

    if (result.success) {
      navigate('/login');
    }
  };

  return (
    <div className="relative min-h-screen bg-obsidian-950 flex items-center justify-center p-4 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[700px] h-[500px] bg-accent/10 blur-[90px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full" />
      </div>

      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-6 left-6"
      >
        <Link className="text-ivory/30 hover:text-ivory flex items-center gap-2" to="/">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px] p-8 bg-obsidian-900/50 rounded-artifact-xl backdrop-blur shadow-deep"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="mb-8">
            <Link to="/" className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 bg-accent/10 rounded-artifact flex items-center justify-center">
                <Zap className="w-4 h-4 text-accent" />
              </div>
              <span className="text-ivory font-bold">
                Second<span className="text-accent">Brain</span>
              </span>
            </Link>

            <h1 className="text-2xl text-ivory font-bold mb-1">
              Create account
            </h1>
            <p className="text-ivory/40 text-sm">
              Start building your second brain.
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <Field
              label="Full Name"
              id="username"
              icon={User}
              placeholder="John Doe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

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
                icon: showPass ? EyeOff : Eye,
                onClick: () => setShowPass((v) => !v),
              }}
            />

            {/* Submit */}
            <motion.button
              variants={fadeUp}
              type="submit"
              disabled={loading}
              className="
                w-full py-3.5 rounded-artifact
                bg-ivory text-black font-bold
                hover:bg-accent hover:text-white
                transition-all
                disabled:opacity-40
              "
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </motion.button>
          </form>

          {/* Footer */}
          <motion.p
            variants={fadeUp}
            className="mt-8 text-center text-ivory/30 text-sm"
          >
            Already have an account?{' '}
            <Link to="/login" className="text-accent font-semibold">
              Login
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;