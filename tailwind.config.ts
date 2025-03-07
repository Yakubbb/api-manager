import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mainBgColor:"var(--main-bg-base)",
        bgAdditionalColor: "var(--bg-additional-color)",
        bgAdditionalColor2: "var(--bg-additional-color-2)",
        fColor: "var(--f-color)",
        errBgColor:"var(--bg-err-color)",
        errTextColor:"var(--err-color)",
        mainTextColor:"var(--text-main)",
        secondTextColor:"var(--text-second)",
        contrastTextColor:"var(--text-contrast-main)",
        borderColorForm:"var(--border-color-form)",
    },
    backgroundImage: {
      'main-gradient': 'var(--main-bg-gradient)', 
    },
    },
  },
  plugins: [require('tailwindcss-font-inter')],
  important: true,
} satisfies Config;