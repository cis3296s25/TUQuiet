import daisyui from "daisyui";
import { defineConfig } from "tailwindcss";

export default defineConfig({
  darkMode: "class", // Ensures Tailwind uses 'dark' class to toggle dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'temple-cherry': '#9E1B34',
        'temple-cherry-light': '#C13A51',
        'temple-cherry-dark': '#7A1428',
        'temple-gray': '#A7A9AC',
        'temple-gray-light': '#D1D3D4',
        'temple-gray-dark': '#58595B',
      },
      fontFamily: {
        bumbbled: ['Bumbbled', 'sans-serif'], // Add custom font
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#9E1B34",
          "primary-content": "#FFFFFF",
          "secondary": "#A7A9AC",
          "secondary-content": "#000000",
          "accent": "#C13A51",
          "accent-content": "#FFFFFF",
          "neutral": "#58595B",
          "neutral-content": "#FFFFFF",
          "base-100": "#FFFFFF",
          "base-200": "#F9F9F9",
          "base-300": "#F0F0F0",
          "base-content": "#000000",
        },
        dark: {
          "primary": "#9E1B34",
          "primary-content": "#FFFFFF",
          "secondary": "#A7A9AC",
          "secondary-content": "#FFFFFF",
          "accent": "#C13A51",
          "accent-content": "#FFFFFF",
          "neutral": "#58595B",
          "neutral-content": "#FFFFFF",
          "base-100": "#1D1D1D",
          "base-200": "#2A2A2A",
          "base-300": "#3A3A3A",
          "base-content": "#FFFFFF",
        },
      },
    ],
  },
});