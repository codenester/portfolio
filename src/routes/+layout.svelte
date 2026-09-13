<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import SideNav from '$lib/components/SideNav.svelte';
	import CornerControls from '$lib/components/CornerControls.svelte';
	import FirstVisitGuide from '$lib/components/FirstVisitGuide.svelte';
	import { profile, siteUrl, ui } from '$lib/content/site';
	import { readShape, applyShape } from '$lib/ui-shape';
	import { readTheme, applyTheme } from '$lib/theme';

	let { children } = $props();

	onMount(() => {
		// the inline bootstrap script in app.html already painted these;
		// re-reading keeps state and DOM in sync when storage changed.
		applyTheme(readTheme(), false);
		applyShape(readShape(), false);
	});

	const year = new Date().getFullYear();
</script>

<svelte:head>
	<title>Rithea Sreng · Software Development Supervisor & Full-Stack Engineer</title>
	<meta
		name="description"
		content="Software development supervisor and full-stack engineer in Phnom Penh, Cambodia. 7+ years building POS, ERP, logistics and e-commerce systems, currently leading the POS platform behind a supermarket group of 20+ stores."
	/>
	<meta name="author" content="Rithea Sreng" />
	<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
	<meta name="theme-color" content="#150d1c" />
	<meta property="og:title" content="Rithea Sreng · Software Development Supervisor" />
	<meta
		property="og:description"
		content="POS, ERP and integration platforms built and run end to end: architecture, delivery, releases and the teams behind them."
	/>
	<meta property="og:type" content="profile" />
	<meta property="og:url" content="{siteUrl}/" />
	<link rel="canonical" href="{siteUrl}/" />
</svelte:head>

<CornerControls />
<SideNav />
<FirstVisitGuide />

<main>
	{@render children()}
</main>

<footer class="site-footer">
	<div class="wrap inner">
		<span>© {year} {profile.nameLatin} · {ui.footer.built}</span>
	</div>
</footer>
