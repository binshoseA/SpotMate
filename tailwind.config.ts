import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#18242c",
        campus: "#15a58a",
        coral: "#ff6b5f",
        mango: "#f8c14a",
        sky: "#5ab4f6",
        paper: "#f7faf8"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(24, 36, 44, 0.10)",
        card: "0 14px 35px rgba(24, 36, 44, 0.08)"
      }
    }
  },
  plugins: [forms]
};

export default config;
