/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './layouts/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(145 70 255)', // matches the Twitch brand color
        editing: 'rgb(145 70 255)',
        error: 'rgb(212 37 37)',
        elementHighlight: 'rgb(255 0 0)', // matches the highlight color in OBS
      },
      gridTemplateColumns: {
        playerWithSidebar: 'auto 340px', // matches the width of the Twitch live chat
      },
    },
  },
  plugins: [],
}
