<script lang="ts">
	/**
	 * Honest sketch of the POS architecture I designed: stores, the
	 * distribution gateway, dedicated API instances per store group, and the
	 * two database layers — with the SAP/ERP integration path called out
	 * underneath. Straight lines, one accent, no decoration.
	 */

	const stages: { stage: string; note: string }[] = [
		{
			stage: 'Stores 01 – 20+',
			note: 'per-store client'
		},
		{
			stage: 'Distribution gateway',
			note: 'routes by store'
		},
		{
			stage: 'Dedicated API instances',
			note: 'grouped stores'
		},
		{
			stage: 'Per-store DB',
			note: 'local SQLite · offline-first'
		},
		{
			stage: 'Central DB',
			note: 'vouchers · customers'
		}
	];

	const integration = 'SAP · ERP & business systems: SFTP, APIs, sync';
</script>

<svg viewBox="0 0 452 336" role="img" aria-label="POS platform architecture">
	<defs>
		<marker id="flow-arrow" viewBox="0 0 8 8" refX="6.5" refY="4" markerWidth="6" markerHeight="6" orient="auto">
			<path d="M0 0 L8 4 L0 8 z" fill="var(--brand)" />
		</marker>
	</defs>

	<g fill="none" stroke="var(--brand)" stroke-width="1.1" marker-end="url(#flow-arrow)">
		{#each [0, 1, 2, 3] as i (i)}
			<path d={`M34 ${52 + i * 52} V${66 + i * 52}`} />
		{/each}
		<!-- integration path: out of the gateway, down the right margin, into the box -->
		<path d="M212 124 H442 V305 H434" stroke-dasharray="3 3" />
	</g>

	{#each stages as stage, i (stage.stage)}
		<g transform={`translate(20 ${16 + i * 52})`}>
			<rect
				width="192"
				height="36"
				rx="4"
				fill="color-mix(in srgb, var(--brand) 7%, transparent)"
				stroke="var(--brand)"
				stroke-width="1.1"
			/>
			<text
				x="11"
				y="23"
				class="map-title"
				font-size="12.5"
				font-weight="600"
				fill="var(--ink)"
			>
				{stage.stage}
			</text>
			<text
				x="228"
				y="23"
				class="map-note"
				font-size="9.5"
				fill="var(--muted)"
			>
				{stage.note}
			</text>
		</g>
	{/each}

	<g transform="translate(20 288)">
		<rect
			width="404"
			height="34"
			rx="4"
			fill="none"
			stroke="var(--brand)"
			stroke-width="1.1"
			stroke-dasharray="4 3"
		/>
		<text x="12" y="21" class="map-note" font-size="9.5" fill="var(--muted)">
			{integration}
		</text>
	</g>
</svg>

<style>
	/* These have to be CSS classes, not SVG presentation attributes: an attribute
	   value cannot resolve var(--font-*), so the text fell back to a default face. */
	.map-title {
		font-family: var(--font-display);
	}

	.map-note {
		font-family: var(--font-mono);
	}
</style>
