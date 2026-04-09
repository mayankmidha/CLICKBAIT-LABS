import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#000000",
        foreground: "#ededed",
        primary: "#ff0000",
        secondary: "#111111",
        border: "rgba(255, 255, 255, 0.1)",
        muted: "#888888",
      },
    },
  },
  plugins: [],
};
export default config;
