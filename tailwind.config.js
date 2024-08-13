import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,./node_modules/flowbite/**/*.js}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        lato: ['Lato', ...defaultTheme.fontFamily.sans],
        libre:['libre-baskerville']
      },
      colors:{
        
        'dark-primary' :' #050a30',
        'dark-secondary':' #f4f6fc',
        'dark-accent1': '#233dff',
        'dark-accent2': '#c10fff',
        'light-primary': '#ebfdff',
        'light-secondary': '#05445e',
        'light-accent1': '#75e6da',
        'light-accent2': '#147e93',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    function ({ addComponents }) {
      addComponents({
        '.prose': {
          
          maxWidth: '72rem', // Ajusta el ancho máximo aquí
        },
        '.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6': {
          
        },
        '.prose p, .prose a, .prose strong, .prose em, .prose blockquote': {
          
        },
        // Puedes añadir más estilos aquí si es necesario
      });
    },
  ],
};