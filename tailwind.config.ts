import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        gasolina: { DEFAULT: "#2563eb", light: "#dbeafe" },
        gasoleo: { DEFAULT: "#374151", light: "#f3f4f6" },
        entrada: { DEFAULT: "#16a34a", light: "#dcfce7" },
        despacho: { DEFAULT: "#ea580c", light: "#ffedd5" },
      },
    },
  },
  plugins: [],
};

export default config;
