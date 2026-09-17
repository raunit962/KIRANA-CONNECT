/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          header: '#171717',
          bg: '#F8F5EF',
          card: '#EFE8DC',
          subcard: '#F4EFE6',
          heading: '#171717',
          body: '#786F67',
          btn: '#B85C38',
          'btn-hover': '#A94D2F',
          decor: '#D8C3A5',
        },
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#d97d54',
          500: '#B85C38', // User Button terracotta
          600: '#A94D2F', // User Button Hover deep terracotta
          700: '#8c3c22',
          800: '#6f2d18',
          900: '#522010',
        },
        indigoNavy: {
          800: '#1e1b4b',
          900: '#0f172a',
          950: '#020617',
        },
        kiranaGreen: {
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        thematicYellow: '#fffd47',
        kiranaDeepGreen: '#1A5336',
        kiranaGold: '#F5A623',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        thematic: ['Maharlika', 'RoxboroughCF', '"Playfair Display"', 'serif'],
        script: ['Caveat', 'cursive'],
      }
    },
  },
  plugins: [],
}
