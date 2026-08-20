/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0f172a',      // Deep dark slate/charcoal
          steel: '#475569',     // Slate steel gray
          muted: '#64748b',     // Muted slate gray
          bg: '#f8fafc',        // Super light slate blue-gray background
          card: '#ffffff',      // Crisp card background
          border: '#e2e8f0',    // Light slate border divider
        }
      },
      borderRadius: {
        'brand': '12px',
        'brand-lg': '16px'
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}