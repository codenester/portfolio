<script lang="ts">
	import { onMount } from 'svelte';

	// "How it fits together" for Techniverse.Echosys: a button in the case card
	// that opens a modal with an animated diagram of the module model.
	//
	// The story: modules assemble into a small product, keep arriving until it is
	// a full platform, then the whole thing splits into pieces that each stay
	// alive (each carrying its own Shared, Auth and Identity), then one module is
	// left standing alone, and finally everything merges back into one form.
	//
	// Two layouts: the wide one for desktop, and a narrow one for phones. The
	// narrow one is a genuine re-layout (fewer, bigger cards, stacked frames), not
	// a scaled-down wide one, because at 313px wide the wide diagram is unreadable.
	let { cta, title, lead }: { cta: string; title: string; lead: string } = $props();

	type Pt = { x: number; y: number };
	type Rect = { x: number; y: number; w: number; h: number };
	type Band = { cards: number[]; frame: Rect; dx: number; dy: number; core: Pt; pulse: Pt; shrunk?: { frame: Rect; core: Pt; pulse?: Pt } };
	type Brick = { label: string; note: string; x: number; y: number; w: number; h: number };
	type Link = { x1: number; y1: number; x2: number; y2: number; arrow: boolean };
	type Layout = {
		vb: [number, number];
		cardW: number;
		cardH: number;
		cards: Pt[];
		names: string[];
		smallCards: number[];
		small: Rect;
		big: Rect;
		bands: Band[];
		solo: { index: number; dy: number; frame: Rect; core: Pt; pulse: Pt; note?: Pt };
		bus: Rect;
		busLabel: Pt;
		links: Link[];
		bricks: Brick[];
		labels: Pt;
		caption: { x: number; y: number; lines: string[] };
		text: { card: number; brick: number; note: number; cap: number; bus: number; label: number };
	};

	const bricks = (x: number, y: number, w: number, h: number, dy: number): Brick[] =>
		[
			{ label: 'Shared', note: 'kernel pieces' },
			{ label: 'Auth', note: 'sign-in, tokens' },
			{ label: 'Identity', note: 'who the user is' }
		].map((b, i) => ({ ...b, x, y: y + i * dy, w, h }));

	const wide: Layout = {
		vb: [660, 490],
		cardW: 88,
		cardH: 48,
		names: [
			'Sales',
			'Logistics',
			'Inventory',
			'POS',
			'Finance',
			'Pricing',
			'HR',
			'Loyalty',
			'Procurement',
			'Reports'
		],
		cards: [
			{ x: 86, y: 66 },
			{ x: 86, y: 126 },
			{ x: 186, y: 66 },
			{ x: 186, y: 126 },
			{ x: 286, y: 66 },
			{ x: 286, y: 126 },
			{ x: 386, y: 66 },
			{ x: 386, y: 126 },
			{ x: 486, y: 66 },
			{ x: 486, y: 126 }
		],
		smallCards: [0, 2, 4],
		small: { x: 78, y: 52, w: 304, h: 80 },
		big: { x: 10, y: 52, w: 640, h: 148 },
		bands: [
			{
				cards: [0, 1, 2, 3],
				frame: { x: 78, y: 52, w: 198, h: 148 },
				dx: -26,
				dy: 0,
				core: { x: 113, y: 181 },
				pulse: { x: 266, y: 62 }
			},
			{
				cards: [4, 5],
				frame: { x: 282, y: 52, w: 96, h: 148 },
				dx: 0,
				dy: 0,
				core: { x: 295, y: 181 },
				pulse: { x: 368, y: 62 },
				// once Pricing leaves, this boundary closes around Finance alone
				shrunk: { frame: { x: 282, y: 52, w: 96, h: 98 }, core: { x: 295, y: 130 } }
			},
			{
				cards: [6, 7, 8, 9],
				frame: { x: 382, y: 52, w: 198, h: 148 },
				dx: 30,
				dy: 0,
				core: { x: 417, y: 181 },
				pulse: { x: 570, y: 62 }
			}
		],
		solo: { index: 5, dy: 110, frame: { x: 274, y: 220, w: 112, h: 80 }, core: { x: 295, y: 285 }, pulse: { x: 376, y: 230 }, note: { x: 396, y: 254 } },
		bus: { x: 60, y: 320, w: 540, h: 22 },
		busLabel: { x: 78, y: 335 },
		links: [
			{ x1: 180, y1: 316, x2: 180, y2: 204, arrow: true },
			{ x1: 480, y1: 316, x2: 480, y2: 204, arrow: true },
			{ x1: 180, y1: 376, x2: 180, y2: 346, arrow: false },
			{ x1: 330, y1: 376, x2: 330, y2: 346, arrow: false },
			{ x1: 480, y1: 376, x2: 480, y2: 346, arrow: false }
		],
		bricks: [
			{ label: 'Shared', note: 'kernel pieces', x: 90, y: 380, w: 150, h: 58 },
			{ label: 'Auth', note: 'sign-in, tokens', x: 255, y: 380, w: 150, h: 58 },
			{ label: 'Identity', note: 'who the user is', x: 420, y: 380, w: 150, h: 58 }
		],
		labels: { x: 330, y: 30 },
		caption: { x: 330, y: 468, lines: ['every piece carries these three, which is why it keeps running'] },
		text: { card: 9.5, brick: 14, note: 8.5, cap: 10, bus: 9, label: 15 }
	};

	const narrow: Layout = {
		vb: [380, 660],
		cardW: 160,
		cardH: 46,
		names: ['Sales', 'Inventory', 'Finance', 'HR', 'Procurement', 'Logistics'],
		cards: [
			{ x: 22, y: 82 },
			{ x: 198, y: 82 },
			{ x: 22, y: 142 },
			{ x: 198, y: 142 },
			{ x: 22, y: 202 },
			{ x: 198, y: 202 }
		],
		smallCards: [0, 1],
		small: { x: 12, y: 74, w: 356, h: 62 },
		big: { x: 12, y: 74, w: 356, h: 186 },
		bands: [
			{ cards: [0, 1], frame: { x: 12, y: 74, w: 356, h: 74 }, dx: 0, dy: -30, core: { x: 22, y: 132 }, pulse: { x: 358, y: 86 } },
			{ cards: [2, 3], frame: { x: 12, y: 134, w: 356, h: 74 }, dx: 0, dy: 0, core: { x: 22, y: 192 }, pulse: { x: 358, y: 146 } },
			{ cards: [4, 5], frame: { x: 12, y: 194, w: 356, h: 74 }, dx: 0, dy: 30, core: { x: 22, y: 252 }, pulse: { x: 358, y: 206 }, shrunk: { frame: { x: 12, y: 194, w: 180, h: 74 }, core: { x: 22, y: 252 }, pulse: { x: 180, y: 206 } } }
		],
		solo: { index: 5, dy: 136, frame: { x: 188, y: 320, w: 182, h: 80 }, core: { x: 198, y: 386 }, pulse: { x: 362, y: 330 } },
		bus: { x: 40, y: 414, w: 300, h: 20 },
		busLabel: { x: 52, y: 428 },
		links: [
			{ x1: 60, y1: 410, x2: 60, y2: 304, arrow: true },
			{ x1: 100, y1: 450, x2: 100, y2: 438, arrow: false },
			{ x1: 190, y1: 450, x2: 190, y2: 438, arrow: false },
			{ x1: 280, y1: 450, x2: 280, y2: 438, arrow: false }
		],
		bricks: bricks(20, 450, 340, 48, 56),
		labels: { x: 190, y: 26 },
		caption: { x: 190, y: 638, lines: ['every piece carries these three,', 'which is why it keeps running'] },
		text: { card: 13, brick: 15, note: 10, cap: 10.5, bus: 10, label: 14 }
	};

	const core = [0, 1, 2];

	let dialog = $state<HTMLDialogElement | null>(null);
	let open = $state(false);
	let cycle = $state(0);
	let reduced = $state(false);
	let isNarrow = $state(false);

	const L = $derived(isNarrow ? narrow : wide);

	// card delays: the small product lands early, the rest keep arriving
	const cardDelay = $derived(
		L.cards.map((_, i) => {
			const early = L.smallCards.indexOf(i);
			return early === -1 ? 3600 + (i - L.smallCards.length) * 200 : 1000 + early * 120;
		})
	);
	const bandOf = $derived(L.cards.map((_, i) => L.bands.findIndex((b) => b.cards.includes(i))));

	onMount(() => {
		reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const mq = window.matchMedia('(max-width: 620px)');
		isNarrow = mq.matches;
		const onMq = (event: MediaQueryListEvent) => (isNarrow = event.matches);
		mq.addEventListener('change', onMq);
		return () => mq.removeEventListener('change', onMq);
	});

	$effect(() => {
		if (!open || reduced) return;
		const id = setInterval(() => (cycle += 1), 18500);
		return () => clearInterval(id);
	});

	$effect(() => {
		document.body.style.overflow = open ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	});

	function show() {
		dialog?.showModal();
		open = true;
	}

	function hide() {
		dialog?.close();
	}
</script>

<button class="btn ghost flow-cta" type="button" onclick={show}>
	<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
		<rect x="3" y="3" width="8" height="8" rx="1.5" />
		<rect x="13" y="3" width="8" height="8" rx="1.5" />
		<rect x="3" y="13" width="8" height="8" rx="1.5" />
		<rect x="13" y="13" width="8" height="8" rx="1.5" />
	</svg>
	{cta}
</button>

<dialog
	class="flow-modal"
	bind:this={dialog}
	onclose={() => (open = false)}
	onclick={(event) => {
		if (event.target === dialog) hide();
	}}
>
	<div class="modal-head">
		<div>
			<p class="eyebrow">Platform concept flow</p>
			<h3>{title}</h3>
		</div>
		<button class="close" type="button" onclick={hide} aria-label="Close">
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
				<path d="M6 6l12 12M18 6L6 18" />
			</svg>
		</button>
	</div>

	<p class="lead">{lead}</p>

	{#key cycle + (isNarrow ? 'n' : 'w')}
		<div class="stage">
			<svg
				viewBox={`0 0 ${L.vb[0]} ${L.vb[1]}`}
				style={`--t-card:${L.text.card}px; --t-brick:${L.text.brick}px; --t-note:${L.text.note}px; --t-cap:${L.text.cap}px; --t-bus:${L.text.bus}px; --t-label:${L.text.label}px`}
				role="img"
				aria-label="Loose modules assembling into a product, splitting into pieces that each stay alive, one module left standing alone, then everything merging back into one form"
			>
				<defs>
					<marker id="mf-arrow" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="7" markerHeight="7" orient="auto">
						<path d="M1 1 L7 4 L1 7 z" fill="var(--brand)" />
					</marker>
				</defs>

				<g class="scene">
					<!-- what state we are in -->
					<text class="lbl small-prod" x={L.labels.x} y={L.labels.y} text-anchor="middle">a small product: a few modules</text>
					<text class="lbl full" x={L.labels.x} y={L.labels.y} text-anchor="middle">a full platform: keep adding modules</text>
					<text class="lbl whole" x={L.labels.x} y={L.labels.y} text-anchor="middle">one platform, running as one</text>
					<text class="lbl split" x={L.labels.x} y={L.labels.y} text-anchor="middle">split in three: every piece still alive</text>
					<text class="lbl alone" x={L.labels.x} y={L.labels.y} text-anchor="middle">split again: one module, still alive</text>

					<!-- the small product, and the body it grows into -->
					<rect class="frame small-frame" x={L.small.x} y={L.small.y} width={L.small.w} height={L.small.h} rx="14" />
					<rect class="frame body" x={L.big.x} y={L.big.y} width={L.big.w} height={L.big.h} rx="16" />

					<!-- the pieces, drawn only while split -->
					{#each L.bands as b, i (i)}
						<g
							class="piece"
							class:shrink={!!b.shrunk}
							style={`--sx:${b.dx}px; --sy:${b.dy}px; --ctx:${b.shrunk ? b.shrunk.core.x : b.core.x}px; --cty:${b.shrunk ? b.shrunk.core.y : b.core.y}px; --ctx0:${b.core.x}px; --cty0:${b.core.y}px; --ppx:${(b.shrunk && b.shrunk.pulse ? b.shrunk.pulse.x : b.pulse.x) - b.pulse.x}px; --ppy:${(b.shrunk && b.shrunk.pulse ? b.shrunk.pulse.y : b.pulse.y) - b.pulse.y}px`}
						>
							<rect class="frame" x={b.frame.x} y={b.frame.y} width={b.frame.w} height={b.frame.h} rx="14" />
							{#if b.shrunk}
								<rect class="frame shrunk" x={b.shrunk.frame.x} y={b.shrunk.frame.y} width={b.shrunk.frame.w} height={b.shrunk.frame.h} rx="14" />
							{/if}
							<g class="pulse-wrap">
								<circle class="pulse" cx={b.pulse.x} cy={b.pulse.y} r="3.4" />
							</g>
							<g class="core" transform={`translate(${b.core.x}, ${b.core.y})`}>
								{#each core as c (c)}
									<rect x={c * 25} y="0" width="20" height="9" rx="3" />
								{/each}
							</g>
						</g>
					{/each}

					<!-- the single module that stands alone -->
					<g class="solo-frame">
						<rect class="frame" x={L.solo.frame.x} y={L.solo.frame.y} width={L.solo.frame.w} height={L.solo.frame.h} rx="12" />
						<circle class="pulse" cx={L.solo.pulse.x} cy={L.solo.pulse.y} r="3.4" />
						<g class="solo-core" transform={`translate(${L.solo.core.x}, ${L.solo.core.y})`}>
							{#each core as c (c)}
								<rect x={c * 25} y="0" width="20" height="9" rx="3" />
							{/each}
						</g>
						{#if L.solo.note}
							<text class="solo-note" x={L.solo.note.x} y={L.solo.note.y}>runs on its own</text>
						{/if}
					</g>

					<!-- modules: cells of the form, and of every piece -->
					<g class="mods">
						{#each L.cards as c, i (L.names[i])}
							<g
								class="mod"
								class:solo={i === L.solo.index}
								style={`--sx:${L.bands[bandOf[i]].dx}px; --sy:${L.bands[bandOf[i]].dy}px; --drop:${L.solo.dy}px; --d:${cardDelay[i]}ms; --out:${7000 + i * 60}ms; --back:${13800 + (L.cards.length - 1 - i) * 60}ms`}
							>
								<rect x={c.x} y={c.y} width={L.cardW} height={L.cardH} rx="9" />
								<circle class="port" cx={c.x + L.cardW - 11} cy={c.y + 11} r="2.4" />
								<text x={c.x + L.cardW / 2} y={c.y + L.cardH / 2 + 4} text-anchor="middle">{L.names[i]}</text>
							</g>
						{/each}
					</g>

					<!-- the service bus every piece plugs into -->
					<rect class="bus" x={L.bus.x} y={L.bus.y} width={L.bus.w} height={L.bus.h} rx={L.bus.h / 2} />
					<text class="bus-label" x={L.busLabel.x} y={L.busLabel.y}>service bus</text>

					<!-- dependencies: pieces lean on the bus, and only on the three -->
					<g class="links">
						{#each L.links as l, i (i)}
							<line class="link" x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} marker-end={l.arrow ? 'url(#mf-arrow)' : undefined} />
						{/each}
					</g>

					<!-- the three every piece carries -->
					<g class="base">
						{#each L.bricks as b (b.label)}
							<g class="brick">
								<rect x={b.x} y={b.y} width={b.w} height={b.h} rx="10" />
								<text class="brick-label" x={b.x + b.w / 2} y={b.y + b.h / 2 - 2} text-anchor="middle">{b.label}</text>
								<text class="brick-note" x={b.x + b.w / 2} y={b.y + b.h / 2 + 15} text-anchor="middle">{b.note}</text>
							</g>
						{/each}
					</g>

					<text class="cap" x={L.caption.x} y={L.caption.y} text-anchor="middle">
						{#each L.caption.lines as line, i (i)}
							<tspan x={L.caption.x} dy={i === 0 ? 0 : 17}>{line}</tspan>
						{/each}
					</text>
				</g>
			</svg>
		</div>
	{/key}
</dialog>

<style>
	.flow-cta {
		margin-top: 18px;
	}

	/* ------------------------------------------------------------------ */
	/* modal                                                              */
	/* ------------------------------------------------------------------ */

	.flow-modal {
		width: min(800px, calc(100vw - 20px));
		max-height: calc(100vh - 24px);
		padding: clamp(14px, 2.4vw, 28px);
		border: 1px solid var(--border-strong);
		border-radius: var(--radius-surface);
		background: var(--surface);
		color: var(--ink);
		box-shadow: 0 24px 70px rgba(0, 0, 0, 0.45);
		overflow: auto;
	}

	.flow-modal::backdrop {
		background: rgba(21, 13, 28, 0.62);
		backdrop-filter: blur(5px);
	}

	.modal-head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 18px;
	}

	.modal-head .eyebrow {
		font-family: var(--font-mono);
		font-size: 10.5px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--muted);
		margin-bottom: 6px;
	}

	.modal-head h3 {
		font-size: clamp(18px, 2.2vw, 24px);
	}

	.close {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 34px;
		height: 34px;
		flex: none;
		border: 1px solid var(--border-strong);
		border-radius: var(--radius-control);
		background: transparent;
		color: var(--ink-soft);
		cursor: pointer;
		transition: background 0.16s, color 0.16s, border-color 0.16s;
	}

	.close:hover {
		background: var(--brand-wash);
		color: var(--brand-ink);
		border-color: var(--brand);
	}

	.lead {
		margin-top: 10px;
		max-width: 68ch;
		color: var(--ink-soft);
		font-size: clamp(13.5px, 1.6vw, 15px);
	}

	.stage {
		margin-top: 8px;
	}

	.stage svg {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
	}

	/* ------------------------------------------------------------------ */
	/* the diagram (text sizes come from the active layout)               */
	/* ------------------------------------------------------------------ */

	.stage text {
		font-family: var(--font-mono);
		font-size: var(--t-cap);
		letter-spacing: 0.1em;
		text-transform: uppercase;
		fill: var(--muted);
	}

	.lbl {
		font-family: var(--font-display);
		font-size: var(--t-label);
		font-weight: 600;
		letter-spacing: 0.01em;
		text-transform: none;
		fill: var(--ink);
	}

	.frame {
		fill: color-mix(in srgb, var(--brand) 5%, transparent);
		stroke: var(--brand);
		stroke-width: 1.4;
		stroke-dasharray: 7 6;
	}

	.piece > .frame {
		fill: color-mix(in srgb, var(--brand) 9%, transparent);
	}

	.link {
		stroke: var(--brand);
		stroke-width: 1.1;
		stroke-dasharray: 4 5;
		opacity: 0.75;
		transform-box: fill-box;
		transform-origin: 50% 100%;
	}

	.mod rect {
		fill: var(--surface-2);
		stroke: var(--border-strong);
		stroke-width: 1;
	}

	.mod text {
		fill: var(--ink-soft);
		font-size: var(--t-card);
	}

	.mod .port {
		fill: var(--brand);
		opacity: 0.9;
	}

	.pulse {
		fill: var(--brand);
		transform-box: fill-box;
		transform-origin: center;
		animation: pulse 2200ms ease-in-out infinite;
	}

	.piece .core rect,
	.solo-core rect {
		fill: color-mix(in srgb, var(--brand) 45%, var(--surface));
		stroke: var(--brand);
		stroke-width: 0.8;
	}

	.bus {
		fill: color-mix(in srgb, var(--brand) 12%, var(--surface));
		stroke: var(--brand);
		stroke-width: 1;
	}

	.bus-label {
		fill: var(--brand-ink);
		font-size: var(--t-bus);
		letter-spacing: 0.14em;
	}

	.base rect {
		fill: color-mix(in srgb, var(--brand) 15%, var(--surface));
		stroke: var(--brand);
		stroke-width: 1.2;
	}

	.brick-label {
		font-family: var(--font-display);
		font-size: var(--t-brick);
		font-weight: 600;
		letter-spacing: 0.01em;
		text-transform: none;
		fill: var(--ink);
	}

	.brick-note {
		font-size: var(--t-note);
		letter-spacing: 0.08em;
		fill: var(--muted);
	}

	/* ------------------------------------------------------------------ */
	/* timeline: single shot, ~18.5s, then the SVG is re-keyed and replays */
	/*                                                                     */
	/* 0.1s  the three shared modules            brick-in                  */
	/* 0.8s  service bus + links                 bus-in / link-grow        */
	/* 1.0s  a few modules, small product        card-in / frame-draw      */
	/* 3.6s  the rest arrive, full platform      card-in / frame-draw      */
	/* 7.0s  split, pieces drift apart           drift                     */
	/* 8.4s  each piece shows its own core       fade-in                   */
	/* 9.6s  one module left, boundary closes   drop / frame-draw / shrink  */
	/* 13.4s everything merges back              rejoin / rise             */
	/* 16.6s fade, loop                                                    */
	/*                                                                     */
	/* Chained animations rely on fill FORWARDS for the later steps: `both` */
	/* would back-fill their start state during the delay and put elements  */
	/* in the wrong state before their turn.                               */
	/* ------------------------------------------------------------------ */

	.base .brick {
		animation: brick-in 620ms cubic-bezier(0.2, 0.9, 0.25, 1) both;
		opacity: 0;
	}
	.base .brick:nth-child(1) {
		animation-delay: 60ms;
	}
	.base .brick:nth-child(2) {
		animation-delay: 200ms;
	}
	.base .brick:nth-child(3) {
		animation-delay: 340ms;
	}

	.bus {
		animation: bus-in 620ms cubic-bezier(0.2, 0.9, 0.25, 1) 520ms both;
		transform-box: fill-box;
		transform-origin: center;
	}
	.bus-label {
		animation: fade-in 400ms ease 900ms both;
	}

	.link {
		animation: link-grow 620ms cubic-bezier(0.2, 0.9, 0.25, 1) both;
		opacity: 0;
	}
	.link:nth-child(1) {
		animation-delay: 800ms;
	}
	.link:nth-child(2) {
		animation-delay: 900ms;
	}
	.link:nth-child(3) {
		animation-delay: 1000ms;
	}
	.link:nth-child(4) {
		animation-delay: 1100ms;
	}
	.link:nth-child(5) {
		animation-delay: 1200ms;
	}

	.cap {
		animation: fade-in 400ms ease 1600ms both;
	}

	/* the small product, then the body it grows into, then the pieces take over,
	   then the body returns when everything merges */
	.small-frame {
		animation:
			frame-draw 700ms ease 2200ms both,
			fade-out 500ms ease 5000ms forwards;
	}
	.body {
		animation:
			frame-draw 800ms ease 5200ms both,
			fade-out 500ms ease 7000ms forwards,
			frame-draw 700ms ease 14200ms forwards;
	}

	/* labels: one state to the next, assembling then splitting then merging */
	.small-prod {
		animation:
			fade-in 400ms ease 2400ms both,
			fade-out 400ms ease 5000ms forwards;
	}
	.full {
		animation:
			fade-in 400ms ease 5400ms both,
			fade-out 400ms ease 7000ms forwards;
	}
	.split {
		animation:
			fade-in 400ms ease 7200ms both,
			fade-out 400ms ease 9800ms forwards;
	}
	.alone {
		animation:
			fade-in 400ms ease 10000ms both,
			fade-out 400ms ease 12400ms forwards;
	}
	.whole {
		animation: fade-in 400ms ease 14400ms both;
	}

	/* the pieces: frames, drift, their own core */
	.piece {
		animation:
			drift 1100ms cubic-bezier(0.3, 0, 0.2, 1) 7000ms both,
			rejoin 1000ms cubic-bezier(0.3, 0, 0.2, 1) 13800ms forwards;
	}
	.piece:nth-of-type(2) {
		animation-delay: 7120ms, 13920ms;
	}
	.piece:nth-of-type(3) {
		animation-delay: 7240ms, 14040ms;
	}
	.piece > .frame {
		animation:
			frame-draw 600ms ease 7100ms both,
			fade-out 400ms ease 13600ms forwards;
	}
	.piece .pulse {
		opacity: 0;
		animation:
			fade-in 400ms ease 8400ms both,
			pulse 2200ms ease-in-out 8400ms infinite,
			fade-out 400ms ease 13400ms forwards;
	}
	.piece .core {
		animation:
			fade-in 400ms ease 8400ms both,
			fade-out 400ms ease 13400ms forwards;
	}

	/* a piece that lost its module: the old boundary fades, a smaller one draws
	   around what is left, and the core and the pulse move in with it */
	.piece.shrink > .frame:not(.shrunk) {
		animation:
			frame-draw 600ms ease 7100ms both,
			fade-out 300ms ease 9900ms forwards;
	}
	.piece.shrink > .frame.shrunk {
		animation:
			frame-draw 600ms ease 10000ms both,
			fade-out 400ms ease 13600ms forwards;
	}
	.piece.shrink .core {
		animation:
			fade-in 400ms ease 8400ms both,
			core-lift 600ms cubic-bezier(0.4, 0, 0.2, 1) 9900ms forwards,
			fade-out 400ms ease 13400ms forwards;
	}
	.piece.shrink .pulse-wrap {
		animation: pulse-move 600ms cubic-bezier(0.4, 0, 0.2, 1) 9900ms forwards;
	}

	/* one module left standing alone */
	.solo-frame {
		animation:
			frame-draw 600ms ease 9700ms both,
			fade-out 400ms ease 13600ms forwards;
	}
	.solo-frame .pulse {
		opacity: 0;
		animation:
			fade-in 400ms ease 10800ms both,
			pulse 2200ms ease-in-out 10800ms infinite,
			fade-out 400ms ease 13400ms forwards;
	}
	.solo-core {
		animation:
			fade-in 400ms ease 10800ms both,
			fade-out 400ms ease 13400ms forwards;
	}

	/* the claim the detached module makes: it left the product and it still runs */
	.solo-note {
		fill: var(--brand-ink);
		letter-spacing: 0.12em;
	}

	/* modules: in, apart with their piece, and back together */
	.mod {
		animation:
			card-in 600ms ease var(--d) both,
			drift 1100ms cubic-bezier(0.3, 0, 0.2, 1) var(--out) both,
			rejoin 1000ms cubic-bezier(0.3, 0, 0.2, 1) var(--back) forwards;
	}

	/* the one that goes all the way down to a single living module */
	.mod.solo {
		animation:
			card-in 600ms ease var(--d) both,
			drift 1100ms cubic-bezier(0.3, 0, 0.2, 1) var(--out) both,
			drop 1000ms cubic-bezier(0.4, 0, 0.2, 1) 9600ms forwards,
			rise 900ms cubic-bezier(0.4, 0, 0.2, 1) 13800ms forwards;
	}

	.scene {
		animation: scene-out 900ms ease 16600ms both;
	}

	@keyframes brick-in {
		from {
			opacity: 0;
			transform: translateY(14px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes bus-in {
		from {
			opacity: 0;
			transform: scaleX(0.55);
		}
		to {
			opacity: 1;
			transform: scaleX(1);
		}
	}

	@keyframes link-grow {
		from {
			opacity: 0;
			transform: scaleY(0.2);
		}
		to {
			opacity: 0.75;
			transform: scaleY(1);
		}
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes fade-out {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}

	@keyframes frame-draw {
		from {
			opacity: 0;
			stroke-dashoffset: 260;
		}
		to {
			opacity: 1;
			stroke-dashoffset: 0;
		}
	}

	@keyframes card-in {
		from {
			opacity: 0;
			transform: translateY(12px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes drift {
		from {
			transform: translate(0, 0);
		}
		to {
			transform: translate(var(--sx, 0px), var(--sy, 0px));
		}
	}

	@keyframes rejoin {
		from {
			transform: translate(var(--sx, 0px), var(--sy, 0px));
		}
		to {
			transform: translate(0, 0);
		}
	}

	@keyframes drop {
		from {
			transform: translate(0, 0);
		}
		to {
			transform: translate(0, var(--drop, 60px));
		}
	}

	@keyframes rise {
		from {
			transform: translate(0, var(--drop, 60px));
		}
		to {
			transform: translate(0, 0);
		}
	}

	/* the core chips of a piece move up as its boundary closes */
	@keyframes core-lift {
		from {
			transform: translate(var(--ctx0), var(--cty0));
		}
		to {
			transform: translate(var(--ctx), var(--cty));
		}
	}

	/* the piece's pulse slides to the corner of the smaller boundary */
	@keyframes pulse-move {
		from {
			transform: translate(0, 0);
		}
		to {
			transform: translate(var(--ppx, 0px), var(--ppy, 0px));
		}
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.45;
			transform: scale(0.85);
		}
		50% {
			opacity: 1;
			transform: scale(1.2);
		}
	}

	@keyframes scene-out {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}

	/* no motion: show the split state, which is the point of the diagram */
	@media (prefers-reduced-motion: reduce) {
		.base .brick,
		.bus,
		.bus-label,
		.cap,
		.link,
		.mod,
		.piece,
		.piece > .frame,
		.piece .core,
		.piece .pulse,
		.split,
		.scene {
			animation: none !important;
			opacity: 1 !important;
			stroke-dashoffset: 0 !important;
		}
		.mod,
		.piece {
			transform: translate(var(--sx, 0px), var(--sy, 0px)) !important;
		}
		.link {
			opacity: 0.75 !important;
		}
		/* the assemble and single-module beats are not shown without motion, so
		   hide that chrome and keep the three living pieces */
		.small-prod,
		.full,
		.whole,
		.alone,
		.small-frame,
		.body,
		.solo-frame,
		.solo-core {
			animation: none !important;
			opacity: 0 !important;
		}
		/* no motion means no detach, so the boundary stays as it was */
		.piece.shrink > .frame.shrunk {
			animation: none !important;
			opacity: 0 !important;
		}
		.pulse {
			animation: none !important;
			opacity: 1 !important;
		}
	}
</style>
