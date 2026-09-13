<script lang="ts">
	import { onMount } from 'svelte';
	import { ui } from '$lib/content/site';

	// Right-hand section rail. No top bar any more — this IS the navigation,
	// drawn as carousel dots: one dot per section, the current one filled.
	const items = [
		{ id: 'top', label: ui.nav.home },
		{ id: 'about', label: ui.about.nav },
		{ id: 'work', label: ui.nav.work },
		{ id: 'experience', label: ui.nav.experience },
		{ id: 'skills', label: ui.nav.skills },
		{ id: 'education', label: ui.nav.education },
		{ id: 'contact', label: ui.nav.contact }
	];

	// Scroll-spy: a section is current once its top passes 35% of the viewport.
	let active = $state('');

	onMount(() => {
		const sections = items
			.map((item) => document.getElementById(item.id))
			.filter((el): el is HTMLElement => el !== null);
		if (sections.length === 0) return;

		let raf = 0;
		const compute = () => {
			raf = 0;
			const line = window.scrollY + window.innerHeight * 0.35;
			let current = '';
			for (const section of sections) {
				const top = section.getBoundingClientRect().top + window.scrollY;
				if (top <= line) current = section.id;
			}
			// at the very bottom the last section wins, however short it is
			const atEnd = window.innerHeight + window.scrollY >= document.body.scrollHeight - 4;
			if (atEnd) current = sections[sections.length - 1].id;
			active = current;
		};

		const onScroll = () => {
			if (!raf) raf = requestAnimationFrame(compute);
		};

		compute();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll);
		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
			if (raf) cancelAnimationFrame(raf);
		};
	});
</script>

<nav class="side-nav" aria-label="Sections">
	<ul>
		{#each items as item (item.id)}
			<li>
				<a
					href={`#${item.id}`}
					class:active={active === item.id}
					aria-current={active === item.id ? 'true' : undefined}
					aria-label={item.label}
				>
					<span class="label">{item.label}</span>
					<span class="dot" aria-hidden="true"></span>
				</a>
			</li>
		{/each}
	</ul>
</nav>

<style>
	.side-nav {
		position: fixed;
		top: 50%;
		right: clamp(12px, 1.6vw, 24px);
		transform: translateY(-50%);
		z-index: 45;
	}

	.side-nav ul {
		display: grid;
		gap: 4px;
		justify-items: end;
	}

	/* the tap/click target stays comfortably bigger than the dot itself */
	.side-nav a {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding: 7px 3px;
		text-decoration: none;
	}

	.side-nav .dot {
		display: block;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--brand);
		opacity: 0.45;
		transition: opacity 0.18s, transform 0.18s, box-shadow 0.18s;
	}

	.side-nav a:hover .dot,
	.side-nav a:focus-visible .dot {
		opacity: 0.75;
		transform: scale(1.2);
	}

	/* current section: solid dot with a soft brand halo */
	.side-nav a.active .dot {
		opacity: 1;
		transform: scale(1.55);
		box-shadow: 0 0 0 4px var(--brand-wash);
	}

	/* labels stay out of the layout — they only appear on hover/focus */
	.side-nav .label {
		position: absolute;
		right: 28px;
		padding: 3px 9px;
		border: 1px solid var(--border-strong);
		border-radius: var(--radius-control);
		background: var(--surface);
		box-shadow: var(--shadow);
		color: var(--brand-ink);
		font-family: var(--font-mono);
		font-size: 10.5px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		white-space: nowrap;
		opacity: 0;
		transform: translateX(5px);
		pointer-events: none;
		transition: opacity 0.18s, transform 0.18s;
	}

	.side-nav a:hover .label,
	.side-nav a:focus-visible .label {
		opacity: 1;
		transform: translateX(0);
	}

	/* phones: tuck the rail into the page gutter */
	@media (max-width: 640px) {
		.side-nav {
			right: 7px;
		}
		.side-nav .dot {
			width: 6px;
			height: 6px;
		}
		.side-nav a {
			padding: 8px 4px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.side-nav .dot,
		.side-nav .label {
			transition: none;
		}
	}
</style>
