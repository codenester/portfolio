import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	// Bind IPv4 localhost explicitly: on macOS `localhost` resolves to ::1, which
	// is invisible to IPv4-only readiness probes and to some container tooling.
	server: {
		host: '127.0.0.1',
		port: 5173
	},

	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// Static output: fully prerendered site in build/ — deployable to
			// GitHub Pages, Netlify, Cloudflare Pages, or any file host.
			adapter: adapter()
		})
	]
});
