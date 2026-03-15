/** @type {import('tailwindcss').Config} */
const baseConfig = require('a11ying-ui/tailwind');

module.exports = {
  ...baseConfig,
  content: [
    ...baseConfig.content,
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './node_modules/a11ying-ui/dist/*.{js,cjs}',
  ],
  theme: {
    ...baseConfig.theme,
  },
	plugins: [],
}
