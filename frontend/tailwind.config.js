/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        serif: ["Cormorant Garamond", "Georgia", "serif"],
      },
      colors: {
        primary: {
          50: "#f4ead8",
          100: "#e9d8ba",
          200: "#d6be94",
          300: "#c3a477",
          400: "#b7915f",
          500: "#956b38",
          600: "#77502a",
          700: "#5d3c22",
          900: "#352517",
        },
        slate: {
          50: "#f7f3e9", 100: "#efe8d9", 200: "#d8cfbe",
          300: "#bdb39f", 400: "#998e7c", 500: "#7e7261",
          600: "#635848", 700: "#493f33", 800: "#322b23",
          850: "#2b251e", 900: "#231e19", 950: "#191612",
        },
        purple: { 400: "#b7915f", 500: "#956b38", 600: "#77502a" },
        cyan: { 400: "#8e9a85", 500: "#61715b", 700: "#3e4e3a" },
        blue: { 50: "#eeeee3", 100: "#d8ddc9", 200: "#b7c0a7", 400: "#8e9a85", 500: "#61715b", 600: "#4c5e47", 700: "#3e4e3a" },
        emerald: { 50: "#eeeee3", 200: "#b7c0a7", 400: "#8e9a85", 500: "#61715b", 600: "#4c5e47", 700: "#3e4e3a" },
        red: { 50: "#f4e6dc", 200: "#d8b9a5", 300: "#cfa58b", 400: "#bb8a70", 500: "#9c6047", 600: "#864e38", 900: "#492c24" },
        amber: { 400: "#c3a477", 500: "#a08860", 700: "#77502a", 800: "#5d3c22" },
        orange: { 50: "#f4e6dc", 200: "#d8b9a5", 400: "#bb8a70", 500: "#9c6047", 600: "#864e38" },
        yellow: { 50: "#f4ead8", 200: "#d6be94", 300: "#c3a477", 400: "#b7915f", 500: "#956b38", 700: "#77502a" },
        green: { 50: "#eeeee3", 200: "#b7c0a7", 400: "#8e9a85", 500: "#61715b", 700: "#3e4e3a" },
        lime: { 50: "#eeeee3", 200: "#b7c0a7", 400: "#8e9a85", 700: "#3e4e3a" },
        teal: { 50: "#eeeee3", 200: "#b7c0a7", 400: "#8e9a85", 700: "#3e4e3a" },
        pink: { 50: "#f4e6dc", 200: "#d8b9a5", 400: "#bb8a70", 700: "#864e38" },
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        shimmer: "shimmer 1.5s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
