/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,svelte}'],
	theme: {
		extend: {},
	},
	plugins: [
		require('daisyui'),
	],
}
