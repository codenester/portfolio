<script lang="ts">
	/**
	 * Angular bracket-cradle mark with an R between the brackets.
	 * Straight strokes only — no smooth closed curve with a centred blob
	 * (that reads as a body part / mouth; see the design notes in the
	 * sveltekit-spa skill).
	 */
	let { size = 34 }: { size?: number } = $props();

	const id = 'rs-grad';
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 48 48"
	role="img"
	aria-label="Rithea Sreng"
	class="mark"
>
	<defs>
		<linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
			<stop offset="0%" stop-color="var(--brand)" />
			<stop offset="100%" stop-color="var(--brand-strong)" />
		</linearGradient>
	</defs>

	<g
		fill="none"
		stroke={`url(#${id})`}
		stroke-width="3.4"
		stroke-linecap="square"
		stroke-linejoin="miter"
	>
		<!-- left bracket -->
		<path d="M14 11 L6 24 L14 37" />
		<!-- right bracket -->
		<path d="M34 11 L42 24 L34 37" />
		<!-- geometric R -->
		<path d="M20 36 V13 H26 L30 17 V23 L26 27 H20" />
		<path d="M26 27 L31 36" />
	</g>
</svg>

<style>
	.mark {
		display: block;
		flex: none;
	}
</style>
