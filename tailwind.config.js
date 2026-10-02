/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'sans-serif'], display: ['Plus Jakarta Sans', 'sans-serif'] },
      colors: {
        ink: '#0F172A',
        brand: '#2F7DF4',
        mist: '#F5F8FC',
        mint: '#0F9F83',
      },
      boxShadow: {
        soft: '0 16px 50px rgba(15, 23, 42, 0.07)',
        card: '0 4px 18px rgba(15, 23, 42, 0.045)',
      },
    },
  },
  plugins: [],
}
