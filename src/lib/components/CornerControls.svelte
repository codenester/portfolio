<script lang="ts">
	import { onMount } from 'svelte';
	import { ui } from '$lib/content/site';
	import { readTheme, applyTheme, nextTheme, type Theme } from '$lib/theme';
	import { readShape, applyShape, nextShape, type Shape } from '$lib/ui-shape';

	// Top-left floating controls: theme + corner style. No top bar any more,
	// so these stay pinned in the corner while the page scrolls.
	let theme = $state<Theme>('light');
	let shape = $state<Shape>('rounded');

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
</script>

<div class="corner-controls">
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
</div>

<style>
	.corner-controls {
		position: fixed;
		top: clamp(12px, 1.6vw, 20px);
		left: clamp(12px, 1.6vw, 20px);
		z-index: 46;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.corner-controls :global(.ctrl-btn) {
		background: var(--surface);
		box-shadow: var(--shadow);
		backdrop-filter: blur(6px);
	}
</style>
