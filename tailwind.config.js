import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './node_modules/flowbite/**/*.js',
  ],
  darkMode: 'class', // Habilita el modo oscuro
  theme: {
    extend: {
      fontFamily: {
        lato: ['Lato', ...defaultTheme.fontFamily.sans],
        libre: ['Libre Baskerville', 'serif'],
      },
      colors: {
        'dark-primary': '#050a30',
        'dark-secondary': '#f4f6fc',
        'dark-accent1': '#6A97B0',
        'dark-accent2': '#3A4385',
        'light-primary': '#ebfdff',
        'light-secondary': '#05445e',
        'light-accent1': '#75e6da',
        'light-accent2': '#147e93',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    function ({ addComponents, theme }) {
      addComponents({
        '.prose ': {
          maxWidth: '72rem',
          color: theme('colors.light-secondary'), // Color de texto en modo claro
          fontFamily: theme('fontFamily.lato'),
        },
        '.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6': {
          color: theme('colors.light-secondary'),
          fontFamily: theme('fontFamily.libre'),
        },
        '.prose a, .propose li': {
          color: theme('colors.light-accent2'),
          fontFamily: theme('fontFamily.lato'),
        },
        '.dark .prose a, .propose li': {
          color: theme('colors.dark-accent1"'),
          fontFamily: theme('fontFamily.lato'),
        },
        '.dark .prose': {
          color: theme('colors.dark-secondary'), // Color de texto en modo oscuro
          fontFamily: theme('fontFamily.lato'),
        },
        '.dark .prose h1, .dark .prose h2, .dark .prose h3, .dark .prose h4, .dark .prose h5, .dark .prose h6': {
          color: theme('colors.dark-accent1'),
          fontFamily: theme('fontFamily.libre'),
        },
      });
    },
  ],
  
};
