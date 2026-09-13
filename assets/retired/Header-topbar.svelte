<script lang="ts">
	import { onMount } from 'svelte';
	import Logo from './Logo.svelte';
	import { profile, ui } from '$lib/content/site';
	import { readTheme, applyTheme, nextTheme, type Theme } from '$lib/theme';
	import { readShape, applyShape, nextShape, type Shape } from '$lib/ui-shape';

	let theme = $state<Theme>('light');
	let shape = $state<Shape>('rounded');
	let menuOpen = $state(false);

	onMount(() => {
		theme = readTheme();
		shape = readShape();
	});

	function onTheme() {
		theme = nextTheme(theme);
		applyTheme(theme);
	}

	function onShape() {
		shape = nextShape(shape);
		applyShape(shape);
	}

	const navLinks = [
		{ href: '#about', label: ui.about.nav },
		{ href: '#work', label: ui.nav.work },
		{ href: '#experience', label: ui.nav.experience },
		{ href: '#skills', label: ui.nav.skills },
		{ href: '#contact', label: ui.nav.contact }
	];
</script>

<header class="site-header">
	<div class="wrap bar">
		<a class="brand" href="#top" aria-label={profile.nameLatin}>
			<Logo size={34} />
			<span class="brand-text">
				<span class="name">{profile.nameLatin}</span>
				<span class="role">{profile.role.split('·')[0]?.trim()}</span>
			</span>
		</a>

		<nav class="nav" class:open={menuOpen} aria-label="Sections">
			{#each navLinks as link (link.href)}
				<a href={link.href} onclick={() => (menuOpen = false)}>{link.label}</a>
			{/each}
		</nav>

		<div class="header-controls">
			<button
				type="button"
				class="ctrl-btn"
				onclick={onTheme}
				title={ui.controls.theme}
				aria-label={ui.controls.theme}
			>
				{#if theme === 'dark'}
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z" />
					</svg>
				{:else}
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<circle cx="12" cy="12" r="4" />
						<path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" />
					</svg>
				{/if}
			</button>

			<button
				type="button"
				class="ctrl-btn"
				onclick={onShape}
				title={ui.controls.shape}
				aria-label={ui.controls.shape}
			>
				{#if shape === 'rect'}
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
						<rect x="4" y="4" width="16" height="16" />
					</svg>
				{:else if shape === 'rounded'}
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
						<rect x="4" y="4" width="16" height="16" rx="4" />
					</svg>
				{:else}
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
						<rect x="2" y="7" width="20" height="10" rx="5" />
					</svg>
				{/if}
			</button>

			<button
				type="button"
				class="ctrl-btn menu-btn"
				onclick={() => (menuOpen = !menuOpen)}
				aria-expanded={menuOpen ? 'true' : 'false'}
				aria-label={ui.controls.menu}
			>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
					<path d="M4 7h16M4 12h16M4 17h16" />
				</svg>
			</button>
		</div>
	</div>
</header>

<style>
	.menu-btn {
		display: none;
	}

	@media (max-width: 900px) {
		.menu-btn {
			display: inline-flex;
		}
		.brand .role {
			display: none;
		}
	}
</style>
