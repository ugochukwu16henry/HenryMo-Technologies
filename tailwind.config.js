/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#007BFF',
          50: '#E6F2FF',
          100: '#CCE5FF',
          500: '#007BFF',
          600: '#0066CC',
          700: '#0052A3',
        },
        secondary: {
          DEFAULT: '#111827',
          50: '#F9FAFB',
          100: '#F3F4F6',
          500: '#6B7280',
          700: '#374151',
          900: '#111827',
        },
        success: {
          DEFAULT: '#22C55E',
          50: '#F0FDF4',
          500: '#22C55E',
          600: '#16A34A',
        },
        accent: {
          DEFAULT: '#FACC15',
          50: '#FEFCE8',
          500: '#FACC15',
          600: '#EAB308',
        },
        neutral: {
          DEFAULT: '#E5E7EB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
        },
        indigo: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

