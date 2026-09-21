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
          header: '#0F291E',       // Lush Deep Evergreen
          bg: '#F4F8F5',           // Soft Mint linen tint
          card: '#FFFFFF',          // Clean White Card
          subcard: '#EAF3ED',       // Shaded Pale Lush Green
          heading: '#0B2317',      // Deep Forest Green
          body: '#4A5B52',         // Muted Forest Slate
          btn: '#1A5336',          // Lush Green Button
          'btn-hover': '#133F28',  // Deep Forest Green Hover
          decor: '#CDE3D5',        // Soft Sage Green Divider
          yellow: '#fffd47',       // Sunny Signature Yellow
          gold: '#F5A623',         // Warm Amber Gold
          sky: '#38BDF8',          // Vibrant Light Blue
          'sky-pale': '#E0F2FE',   // Ice Light Blue
        },
        lush: {
          950: '#07150E',
          900: '#0B2317',
          850: '#0F291E',
          800: '#133827',
          700: '#15432B',
          600: '#1A5336',
          500: '#16a34a',
          400: '#22c55e',
          100: '#D1E7DD',
          50: '#EAF3ED',
        },
        sunny: {
          yellow: '#fffd47',
          gold: '#F5A623',
          amber: '#EAB308',
          light: '#FFFDEB',
        },
        ice: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
        },
        thematicYellow: '#fffd47',
        kiranaDeepGreen: '#1A5336',
        kiranaGold: '#F5A623',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        roxborough: ['"RoxboroughCF"', 'Roxborough', 'Maharlika', '"Playfair Display"', 'Georgia', 'serif'],
        thematic: ['"RoxboroughCF"', 'Roxborough', 'Maharlika', '"Playfair Display"', 'serif'],
        cursive: ['Caveat', '"Playfair Display"', 'cursive'],
        script: ['Caveat', 'cursive'],
      }
    },
  },
  plugins: [],
}
