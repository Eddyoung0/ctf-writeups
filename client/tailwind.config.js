/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        // Custom spacing for responsive design
        'xs': '0.5rem',    // 8px
        'sm': '1rem',      // 16px
        'md': '1.5rem',    // 24px
        'lg': '2rem',      // 32px
        'xl': '3rem',      // 48px
        '2xl': '4rem',     // 64px
        '3xl': '6rem',     // 96px
        '4xl': '8rem',     // 128px
        '5xl': '10rem',    // 160px
      },
      // You can also add custom screen breakpoints
      screens: {
        'xs': '320px',     // Very small phones
        'sm': '640px',     // Small devices (landscape phones)
        'md': '768px',     // Medium devices (tablets)
        'custom': '1250px', // Your custom breakpoint (1250px and above)
        'max-custom': {'max': '1249px'}, // 1249px and below
        'lg': '1024px',    // Large devices (desktops)
        'xl': '1280px',    // Extra large devices
        '2xl': '1536px',   // 2X extra large devices
      },
    },
  },
  plugins: [require('daisyui')],
}
