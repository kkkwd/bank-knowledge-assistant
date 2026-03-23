/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#15202b",
        mist: "#f5f7fb",
        bank: {
          50: "#eef7f3",
          100: "#d3ebe0",
          500: "#1f7a5a",
          700: "#15533d",
          900: "#102f24"
        },
        gold: "#d4a63c"
      },
      boxShadow: {
        panel: "0 18px 45px rgba(21, 32, 43, 0.08)"
      }
    },
  },
  plugins: [],
};
