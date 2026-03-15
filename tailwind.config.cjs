/** @type {import('tailwindcss').Config} */
const baseConfig = require('a11ying-ui/tailwind');

module.exports = {
  ...baseConfig,
  content: [
    ...baseConfig.content,
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  ],
  theme: {
    ...baseConfig.theme,
  },
	plugins: [],
}
