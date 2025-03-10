/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'spicy-red': '#FF3B30',
        'cream-white': '#FFF5F5',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        spicypalace: {
          primary: '#FF3B30',
          secondary: '#FFF5F5',
          accent: '#FF6B6B',
          neutral: '#2A2A2A',
          'base-100': '#FFFFFF',
          info: '#3ABFF8',
          success: '#36D399',
          warning: '#FBBD23',
          error: '#F87272',
        },
      },
    ],
  },
}
