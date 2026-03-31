/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          ink: "#123047",
          blue: "#1d5f84",
          mint: "#8fd6ca",
          sand: "#f3e6c6",
          coral: "#da6a54",
          cream: "#f9f6ef",
        },
      },
      fontFamily: {
        sans: ["Manrope", "Segoe UI", "sans-serif"],
        display: ["Fraunces", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 18px 45px rgba(18, 48, 71, 0.14)",
      },
      backgroundImage: {
        "mesh-radial":
          "radial-gradient(circle at top left, rgba(143,214,202,0.65), transparent 38%), radial-gradient(circle at top right, rgba(243,230,198,0.9), transparent 33%), radial-gradient(circle at bottom, rgba(29,95,132,0.12), transparent 45%)",
      },
    },
  },
  plugins: [],
};
