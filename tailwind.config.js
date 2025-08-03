// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-poppins)', 'sans-serif'],
        mono: ['var(--font-fira)', 'monospace'],
      },
    },
  },
  plugins: [],
};
