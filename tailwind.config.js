/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FBF8F3",
        ink: "#1F2A24",
        moss: {
          DEFAULT: "#2F4B3C",
          light: "#3F614F",
          dark: "#1D2F26",
          50: "#E7EDE4",
        },
        gold: {
          DEFAULT: "#C89B3C",
          light: "#DDB863",
          dark: "#9C7A2C",
        },
        stone: {
          line: "#E4DDD0",
        },
      },
      fontFamily: {
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "10px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(31,42,36,0.06), 0 6px 20px rgba(31,42,36,0.06)",
      },
    },
  },
  plugins: [],
};
