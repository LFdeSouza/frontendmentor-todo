import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        checkBackground:
          "linear-gradient hsl(192, 100%, 67%) to hsl(280, 87%, 65%)",
        brightBlue: "hsl(var(--color-bright-blue) / <alpha-value>)",
        veryLightGray: "hsl(var(--color-very-light-gray) / <alpha-value>)",
        veryLightGrayishBlue:
          "hsl(var(--color-very-light-grayish-blue) / <alpha-value>)",
        lightGrayishBlue:
          "hsl(var(--color-light-Gbrayish-blue) / <alpha-value>)",
        darkGrayishBlue: "hsl(var(--color-dark-grayish-blue) / <alpha-value>)",
        veryDarkGrayishBlue:
          "hsl(var(--color-very-dark-grayish-Blue) / <alpha-value>)",
        veryDarkBlue: "hsl(var(--color-very-dark-blue) / <alpha-value>)",
        veryDarkDesaturatedBlue:
          "hsl(var(--color-very-dark-desaturated-blue) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};
export default config;
