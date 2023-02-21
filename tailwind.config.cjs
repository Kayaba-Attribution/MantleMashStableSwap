module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts,gif,jpeg}'],
  theme: {
    backgroundImage: {
      //'test': "url('./gt1.jpeg')",
    },
    extend: {
      fontFamily: {
        LL: ["Metafont", "Metafont"],
        LR: ["Metafont", "Metafont"],
      },
    },
    linearBorderGradients: {
      directions: { // defaults to these values
        't': 'to top',
        'tr': 'to top right',
        'r': 'to right',
        'br': 'to bottom right',
        'b': 'to bottom',
        'bl': 'to bottom left',
        'l': 'to left',
        'tl': 'to top left',
      },
      colors: { // defaults to {}
        'red': '#f00',
        'red-blue': ['#f00', '#00f'],
        'blue-green': ['#0000ff', '#00FF00'],
        'red-green-blue': ['#f00', '#0f0', '#00f'],
        'black-white-with-stops': ['#000', '#000 45%', '#fff 55%', '#fff'],
      },
      background: {
        'gray-50': '#F9FAFB',
        'gray-900':'#111827',
      },
      borders: { // defaults to these values (optional)
        '1': '1px',
        '2': '2px',
        '4': '4px',
      },
    },
  },
  plugins: [
    require('daisyui'),
    require('tailwindcss-border-gradient-radius'),
  ],
  daisyui: {
    themes: ["dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter"],
    darkTheme: "night"

  },
};