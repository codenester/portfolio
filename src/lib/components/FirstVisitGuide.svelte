<script lang="ts">
	import { onMount } from 'svelte';

	// First visit only: walk the visitor to the two settings in the top-left
	// corner (theme + corner style), because they are easy to miss. The dim is
	// pointer-transparent, so the highlighted button stays usable: clicking it
	// both does the thing and steps the tour forward.
	const KEY = 'rithea.tour';

	type Box = { x: number; y: number; w: number; h: number; r: string };

	const steps = [
		{
			title: 'Light or dark',
			body: 'This is the theme switch. Everything you are looking at follows it. Pick whichever is easier on your eyes.',
			next: 'Next'
		},
		{
			title: 'Corner style',
			body: 'This one changes the shape of every control and card on the page: square, rounded or pill. Try all three.',
			next: 'Got it'
		}
	];

	let ready = $state(false);
	let active = $state(false);
	let step = $state(0);
	let box = $state<Box | null>(null);
	let cardAt = $state({ x: 0, y: 0 });
	let reduced = $state(false);
	let controls: HTMLElement[] = [];

	function measure(index: number) {
		const el = controls[index];
		if (!el) return;
		const r = el.getBoundingClientRect();
		const radius = getComputedStyle(el).borderRadius;
		box = { x: r.x, y: r.y, w: r.width, h: r.height, r: radius };

		// the card sits under the controls, pulled back inside the viewport on
		// narrow screens
		const width = Math.min(330, window.innerWidth - 28);
		cardAt = {
			x: Math.max(14, Math.min(r.x, window.innerWidth - width - 14)),
			y: r.bottom + 16
		};
	}

	function finish() {
		active = false;
		try {
			localStorage.setItem(KEY, '1');
		} catch {
			/* storage disabled */
		}
	}

	function next() {
		if (step === steps.length - 1) {
			finish();
			return;
		}
		step += 1;
		measure(step);
	}

	// clicking the highlighted button counts as trying it: move on
	function onControlClick(event: Event) {
		const index = controls.indexOf(event.currentTarget as HTMLElement);
		if (!active || index !== step) return;
		if (step < steps.length - 1) {
			step += 1;
			measure(step);
		}
	}

	function onKey(event: KeyboardEvent) {
		if (event.key === 'Escape' && active) finish();
	}

	onMount(() => {
		reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		let seen = false;
		try {
			seen = localStorage.getItem(KEY) === '1';
		} catch {
			/* storage disabled: show it, nothing to remember */
		}
		ready = true;
		if (seen) return;

		requestAnimationFrame(() => {
			controls = [...document.querySelectorAll('.corner-controls button')] as HTMLElement[];
			if (controls.length < 2) return;
			controls.forEach((el) => el.addEventListener('click', onControlClick));
			active = true;
			measure(0);
			window.addEventListener('keydown', onKey);
			window.addEventListener('resize', () => measure(step));
		});

		return () => {
			controls.forEach((el) => el.removeEventListener('click', onControlClick));
			window.removeEventListener('keydown', onKey);
		};
	});
</script>

{#if ready && active && box}
	<div class="tour" aria-live="polite">
		<div
			class="spot"
			class:pulse={!reduced}
			style={`left:${box.x - 6}px; top:${box.y - 6}px; width:${box.w + 12}px; height:${box.h + 12}px; border-radius:calc(${box.r} + 4px)`}
		></div>

		<div
			class="card"
			role="dialog"
			aria-label="Quick tour"
			style={`top:${cardAt.y}px; left:${cardAt.x}px`}
		>
			<p class="eyebrow">
				Quick tour <span>{step + 1}/{steps.length}</span>
			</p>
			<h4>{steps[step].title}</h4>
			<p class="body">{steps[step].body}</p>
			<div class="row">
				<button class="btn primary small" type="button" onclick={next}>{steps[step].next}</button>
				<button class="skip" type="button" onclick={finish}>Skip</button>
			</div>
		</div>
	</div>
{/if}

<style>
	/* pointer-transparent: the visitor can still click the real controls */
	.tour {
		position: fixed;
		inset: 0;
		z-index: 60;
		pointer-events: none;
	}

	.spot {
		position: absolute;
		box-shadow:
			0 0 0 9999px rgba(15, 8, 28, 0.55),
			0 0 0 2px var(--brand);
		transition: all 0.28s cubic-bezier(0.2, 0.9, 0.25, 1);
	}

	.spot.pulse {
		animation: spot-pulse 2000ms ease-in-out infinite;
	}

	.card {
		position: absolute;
		top: 0;
		left: 0;
		width: min(330px, calc(100vw - 28px));
		padding: 15px 16px 16px;
		border: 1px solid var(--border-strong);
		border-radius: var(--radius-surface);
		background: var(--surface);
		color: var(--ink);
		box-shadow: var(--shadow);
		pointer-events: auto;
	}

	.card .eyebrow {
		display: flex;
		justify-content: space-between;
		gap: 10px;
		font-family: var(--font-mono);
		font-size: 10px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--brand-ink);
		margin-bottom: 8px;
	}

	.card .eyebrow span {
		color: var(--muted);
	}

	.card h4 {
		font-family: var(--font-display);
		font-size: 16.5px;
		font-weight: 700;
		margin-bottom: 6px;
	}

	.card .body {
		font-size: 13.8px;
		line-height: 1.5;
		color: var(--ink-soft);
	}

	.card .row {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-top: 13px;
	}

	.btn.small {
		min-height: 34px;
		padding: 0 14px;
		font-size: 13.5px;
	}

	.skip {
		border: 0;
		background: transparent;
		color: var(--muted);
		font: inherit;
		font-size: 13px;
		text-decoration: underline;
		text-underline-offset: 3px;
		cursor: pointer;
	}

	.skip:hover {
		color: var(--ink-soft);
	}

	@keyframes spot-pulse {
		0%,
		100% {
			box-shadow:
				0 0 0 9999px rgba(15, 8, 28, 0.55),
				0 0 0 2px var(--brand);
		}
		50% {
			box-shadow:
				0 0 0 9999px rgba(15, 8, 28, 0.55),
				0 0 0 5px var(--brand-wash);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.spot {
			transition: none;
		}
	}
</style>
