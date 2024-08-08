import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export const locales = {
	root: { label: 'English', lang: 'en' },
	es: { label: 'Español', lang: 'es' }
};

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
			locales,
			sidebar: [
				{
					label: 'Start Here',
					translations: {
						es: 'Comienza Aquí',
					},
					items: [
						// Each item here is one entry in the navigation menu.
						{
						label: 'Getting Started', 
						link: '/getting-started/' ,
						translations: {
							es: 'Empezando',
						}
						},	
					],
				},
				{
					label: 'Core',
					autogenerate: { directory: 'core' },
				},
				{
					label: 'Tunnel',
					autogenerate: { directory: 'ngrok' },
				},
				/*
				{
					label: 'NATS - Synadia Cloud',
					autogenerate: { directory: 'synadia-cloud' },
				},*/
				/*
				{
					label: 'Einar AI Gateway',
					autogenerate: { directory: 'einar-ai-gateway'},
				},*/
				{
					label: 'Google Cloud',
					autogenerate: { directory: 'google-cloud' },
				},
				{
					label: 'StorJ',
					autogenerate: { directory: 'storj' },
				},
				{
					label: 'Others',
					autogenerate: { directory: 'others' },
				},
				/*
				{
					label: 'Powered By Einar',
					autogenerate: { directory: 'powered-by-einar'},
				}*/
				/*
        		{
					label: 'EinarCLI Powered Projects',
					autogenerate: { directory: 'synadia-cloud' },
				},
	
				{
					label: 'Courses (soon)',
					translations: {
						es: 'Cursos (pronto)',
					}
				}*/
				/*
				{
					label: 'Fermyon Cloud',
					autogenerate: { directory: 'fermyon-cloud' },
				},
				{
					label: 'Tutorials',
					autogenerate: { directory: 'tutorials' },
				},
				{
					label: 'Resources',
					autogenerate: { directory: 'resources' },
				},
				*/
			],
		}),
	],
});
