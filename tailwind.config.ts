import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        background: {
          light: "#FAFAF7",
          dark: "#0C1117",
        },
        // Surface (cards, panels)
        surface: {
          light: "#FFFFFF",
          dark: "#141B24",
        },
        // Border
        border: {
          light: "#E8E8E3",
          dark: "#1F2D3D",
        },
        // Primary (Midnight navy)
        primary: {
          DEFAULT: "#0F1729",
          light: "#1A2540",
          dark: "#E8EDF5",
        },
        // Accent (Sage)
        sage: {
          50:  "#F0F5F1",
          100: "#D6E8DA",
          200: "#B3D4BA",
          300: "#8BBD97",
          400: "#6B9E78",
          500: "#4F7D5C",
          600: "#3D6147",
          700: "#2E4A36",
          800: "#1F3325",
          900: "#111C14",
        },
        // Text
        text: {
          primary: {
            light: "#0F1729",
            dark: "#E8EDF5",
          },
          secondary: {
            light: "#4A5568",
            dark: "#8A9BB0",
          },
          muted: {
            light: "#9AA5B4",
            dark: "#4A5A6B",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-dm-serif)", "Georgia", "serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
    },
  },
  plugins: [],
};

export default config;