/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#2e3b80",
        "on-primary": "#ffffff",
        "primary-container": "#d1d8ff",
        "on-primary-container": "#00105c",
        "secondary": "#5a5d72",
        "on-secondary": "#ffffff",
        "secondary-container": "#dee1f9",
        "on-secondary-container": "#171a2c",
        "tertiary": "#75546f",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#ffd7f5",
        "on-tertiary-container": "#2c1229",
        "error": "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#410002",
        "background": "#fbf8ff",
        "on-background": "#1a1b21",
        "surface": "#fbf8ff",
        "on-surface": "#1a1b21",
        "surface-variant": "#45464f",
        "on-surface-variant": "#c6c6d0",
        "outline": "#8f909a",
        "inverse-on-surface": "#f2f0f4",
        "inverse-surface": "#2f3036",
        "inverse-primary": "#bbc3ff",
        "surface-bright": "#fbf8ff",
        "surface-dim": "#d1d8ff",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f3f2ff",
        "surface-container": "#eeedf4",
        "surface-container-high": "#e8e7ee",
        "surface-container-highest": "#e2e2e9"
      },
      borderRadius: {
        "DEFAULT": "4px",
        "lg": "4px",
        "xl": "8px",
        "full": "9999px"
      },
      spacing: {
        "gutter": "24px",
        "margin-desktop": "64px",
        "md": "24px",
        "sm": "12px",
        "lg": "48px",
        "base": "8px",
        "xs": "4px",
        "xl": "80px",
        "margin-mobile": "16px"
      },
      fontFamily: {
        "display-lg": ["Hanken Grotesk", "sans-serif"],
        "body-md": ["Hanken Grotesk", "sans-serif"],
        "body-lg": ["Hanken Grotesk", "sans-serif"],
        "label-md": ["Hanken Grotesk", "sans-serif"],
        "headline-lg-mobile": ["Hanken Grotesk", "sans-serif"],
        "headline-lg": ["Hanken Grotesk", "sans-serif"],
        "headline-md": ["Hanken Grotesk", "sans-serif"]
      },
      fontSize: {
        "display-lg": ["56px", { "lineHeight": "1.1", "letterSpacing": "-0.01em", "fontWeight": "700" }],
        "body-md": ["16px", { "lineHeight": "1.6", "fontWeight": "400" }],
        "body-lg": ["18px", { "lineHeight": "1.6", "fontWeight": "400" }],
        "label-md": ["14px", { "lineHeight": "1.2", "letterSpacing": "0.05em", "fontWeight": "600" }],
        "headline-lg-mobile": ["32px", { "lineHeight": "1.2", "fontWeight": "700" }],
        "headline-lg": ["40px", { "lineHeight": "1.2", "fontWeight": "700" }],
        "headline-md": ["28px", { "lineHeight": "1.3", "fontWeight": "600" }]
      }
    }
  },
  plugins: [],
}
