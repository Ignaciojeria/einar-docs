import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://ignaciojeria.github.io',
	integrations: [
		starlight({
			title: 'EinarCLI',
			logo: { 
                src: './src/assets/logo.svg', // Ruta a tu archivo de logo
            },
			social: {
				github: 'https://github.com/ignaciojeria/einar',
			},
			sidebar: [
				{
					label: 'Start Here',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Getting Started', link: '/getting-started/' },
					],
				},
				{
					label: 'Core',
					autogenerate: { directory: 'core' },
				},
				{
					label: 'Google Cloud',
					autogenerate: { directory: 'google-cloud' },
				},
				{
					label: 'Synadia Cloud',
					autogenerate: { directory: 'synadia-cloud' },
				},
				{
					label: 'Others',
					autogenerate: { directory: 'others' },
				},
				{
					label: 'Tutorials',
					autogenerate: { directory: 'tutorials' },
				},
				{
					label: 'Resources',
					autogenerate: { directory: 'resources' },
				},
			],
		}),
	],
});
