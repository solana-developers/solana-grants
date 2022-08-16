const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  mode: "jit",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "media",
  theme: {
    extend: {
      spacing: {
        "1/2": "50%",
        "1/3": "33.333333%",
        "2/3": "66.666667%",
        "1/4": "25%",
        "2/4": "50%",
        "3/4": "75%",
        "1/5": "20%",
        "2/5": "40%",
        "3/5": "60%",
        "4/5": "80%",
        "1/6": "16.666667%",
        "2/6": "33.333333%",
        "3/6": "50%",
        "4/6": "66.666667%",
      },
      fontFamily: {
        quantico: ["Quantico", "sans-serif"],
        montserrat: ["montserrat", "Montserrat"],
      },
      colors: {
        magenta: "#9c27b0",
        "royal-purple": "#6A1B9A",
        "solana-green": "#14F195",
        "solana-purple": "#9945FF",
        "safety-orange": "#FF6F00",
        thistle: "#E1BEE7",
        'blue-magenta': '#2514ED',      /* Create grant flow primary color */
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/line-clamp"),
    require("daisyui"),
  ],
  daisyui: {
    styled: true,
    // TODO: Theme needs works
    themes: [
      {
        solana: {
          /* your theme name */
          fontFamily: {
            display: ["PT Mono, monospace"],
            body: ["Inter, sans-serif"],
          },
          primary: "#2a2a2a" /* Primary color */,
          "primary-focus": "#9945FF" /* Primary color - focused */,
          "primary-content":
            "#ffffff" /* Foreground content color to use on primary color */,

          secondary: "#f6d860" /* Secondary color */,
          "secondary-focus": "#f3cc30" /* Secondary color - focused */,
          "secondary-content":
            "#ffffff" /* Foreground content color to use on secondary color */,

          accent: "#33a382" /* Accent color */,
          "accent-focus": "#2aa79b" /* Accent color - focused */,
          "accent-content":
            "#ffffff" /* Foreground content color to use on accent color */,

          neutral: "#2b2b2b" /* Neutral color */,
          "neutral-focus": "#2a2e37" /* Neutral color - focused */,
          "neutral-content":
            "#ffffff" /* Foreground content color to use on neutral color */,

          "base-100":
            "#000000" /* Base color of page, used for blank backgrounds */,
          "base-200": "#35363a" /* Base color, a little darker */,
          "base-300": "#222222" /* Base color, even more darker */,
          "base-content":
            "#f9fafb" /* Foreground content color to use on base color */,

          'info': '#2094f3',              /* Info */
          'success': '#009485',           /* Success */
          'warning': '#ff9900',           /* Warning */
          'error': '#ff5724',             /* Error */
        },
      },
      // backup themes:
      // 'dark',
      // 'synthwave'
    ],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
  },
};
