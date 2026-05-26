// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	site: 'https://orcha.run',
	integrations: [
		starlight({
			title: 'Orcha',
			logo: {
				src: './src/assets/logo-on-dark.png',
				alt: 'Orcha',
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/whileTrueYield/orcha' },
			],
			customCss: ['./src/styles/custom.css'],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'What is Orcha', slug: 'what-is-orcha' },
						{ label: "What's Different", slug: 'whats-different' },
						{ label: 'Quick Tour', slug: 'quick-tour' },
						{ label: 'Your First Project', slug: 'first-project' },
						{ label: 'Importing Tickets', slug: 'importing-tickets' },
					],
				},
				{
					label: 'Core Concepts',
					items: [
						{ label: 'How Scheduling Works', slug: 'scheduling' },
						{ label: 'Autopilot', slug: 'autopilot' },
						{ label: 'Work Weeks & Time Zones', slug: 'work-weeks' },
						{ label: 'Priorities', slug: 'priorities' },
					],
				},
				{
					label: 'Features',
					items: [
						{ label: 'Dashboard', slug: 'dashboard' },
						{ label: 'Task Switcher', slug: 'task-switcher' },
						{ label: 'Projects & Folders', slug: 'projects' },
						{ label: 'Tickets', slug: 'tickets' },
						{ label: 'Schedule Views', slug: 'schedule-views' },
						{ label: 'Dependencies', slug: 'dependencies' },
						{ label: 'Collaborative Editing', slug: 'collaborative-editing' },
						{ label: 'Time Tracking', slug: 'time-tracking' },
						{ label: 'Notes & Search', slug: 'notes-search' },
						{ label: 'Notifications', slug: 'notifications' },
					],
				},
				{
					label: 'Team Management',
					items: [
						{ label: 'Roles & Permissions', slug: 'roles' },
						{ label: 'Velocity Biases', slug: 'velocity' },
						{ label: 'Time-Offs', slug: 'time-offs' },
						{ label: 'Account Deactivation', slug: 'deactivation' },
					],
				},
				{
					label: 'Self-Hosting',
					items: [
						{ label: 'Deployment Guide', slug: 'self-hosting' },
					],
				},
				{
					label: 'Support & Integrations',
					items: [
						{ label: 'Support Widget', slug: 'support-widget' },
						{ label: 'Documentation Builder', slug: 'documentation-builder' },
					],
				},
			],
		}),
	],
});
