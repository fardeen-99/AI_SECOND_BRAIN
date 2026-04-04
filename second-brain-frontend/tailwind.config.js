/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Manrope"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Fraunces"', 'Baskerville', 'Georgia', 'serif'],
      },
      colors: {
        primary: "#4F46E5",
        "primary-dark": "#4338CA",
        background: "#F8FAFC",
        card: "#FFFFFF",
        ivory: "#F5F5F5",
        ink: {
          950: "#0A0A0A",
          900: "#111111",
          850: "#161616",
          800: "#1A1A1A",
          700: "#222222",
          600: "#2A2A2A",
          500: "#3A3A3A",
          400: "#555555",
          300: "#888888",
          200: "#AAAAAA",
          100: "#CCCCCC",
        },
        obsidian: {
          950: "#0A0A0A",
          900: "#111111",
          850: "#161616",
          800: "#1A1A1A",
          700: "#222222",
          600: "#2A2A2A",
          500: "#3A3A3A",
          400: "#777777",
          300: "#AAAAAA",
        },
        accent: {
          DEFAULT: "#D4A017",
          soft: "#B8860B",
          muted: "#9A7209",
        },
      },
      borderRadius: {
        'artifact': '0.75rem',
        'artifact-lg': '1rem',
        'artifact-xl': '1.25rem',
      },
      boxShadow: {
        panel: "0 24px 80px rgba(0, 0, 0, 0.55)",
        soft: "0 12px 30px rgba(0, 0, 0, 0.35)",
        artifact: "0 1px 0 0 rgba(245,245,245,0.06), 0 16px 50px rgba(0,0,0,0.5)",
        "artifact-hover": "0 1px 0 0 rgba(245,245,245,0.1), 0 24px 60px rgba(0,0,0,0.6)",
        deep: "0 32px 80px rgba(0, 0, 0, 0.7)",
      },
    },
  },
  plugins: [],
}
