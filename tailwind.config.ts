import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(222 47% 11%)",
        foreground: "hsl(210 40% 98%)",
        primary: {
          DEFAULT: "hsl(221 83% 53%)",
          foreground: "hsl(210 40% 98%)"
        },
        muted: {
          DEFAULT: "hsl(215 27% 16%)",
          foreground: "hsl(217 20% 65%)"
        },
        card: {
          DEFAULT: "hsl(222 47% 11%)",
          foreground: "hsl(210 40% 98%)"
        }
      },
      backdropBlur: {
        xs: "2px"
      }
    }
  },
  plugins: []
};

export default config;
