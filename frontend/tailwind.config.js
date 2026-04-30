/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        casino: {
          dark: "#0a0a0a",
          gold: "#FFD700",
          "gold-light": "#FFF080",
          red: "#C41E3A",
          blue: "#0047AB",
          glass: "rgba(255, 255, 255, 0.1)",
        }
      },
      backgroundImage: {
        'casino-gradient': 'linear-gradient(to bottom, #1a1a1a, #0a0a0a)',
        'gold-gradient': 'linear-gradient(135deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)',
      },
      animation: {
        'glow': 'glow 2s infinite alternate',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #FFD700' },
          '100%': { boxShadow: '0 0 20px #FFD700' },
        }
      }
    },
  },
  plugins: [],
}
