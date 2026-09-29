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
			note: 'local SQLite · offline-first'
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
			note: 'server level · one per store'
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
			<path d="M0 0 L8 4 L0 8 z" fill="var(--brand)" stroke="var(--brand)" stroke-width="1.5" stroke-linejoin="round" />
		</marker>
		<radialGradient id="pulse-halo">
			<stop offset="0%" stop-color="var(--brand)" stop-opacity="0.55" />
			<stop offset="100%" stop-color="var(--brand)" stop-opacity="0" />
		</radialGradient>
	</defs>

	<g fill="none" stroke="var(--brand)" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round" marker-end="url(#flow-arrow)">
		{#each [0, 1, 2, 3] as i (i)}
			<path d={`M34 ${52 + i * 52} V${66 + i * 52}`} />
		{/each}
		<!-- integration path: out of the gateway, down the right margin, into the box.
		     dashoffset=4 is not arbitrary: with a 3-on/3-off pattern, the path's own
		     length puts BOTH 90-degree turns (right-to-down, then down-to-left) inside
		     a gap by default, so stroke-linejoin has no solid dash sitting on the corner
		     to round — the line just breaks and resumes a few pixels past each turn,
		     reading as sharp even with linejoin: round set. Shifting the phase so a
		     dash spans both corners is what actually makes them curve. The phase stays
		     fixed: the motion on this path is a dot riding it, not the dashes marching,
		     because marching dashes would drag the corners back out of phase. -->
		<path d="M212 124 H442 V305 H434" stroke-dasharray="3 3" stroke-dashoffset="4" />
	</g>

	<!-- Motion layer, kept out of the group above so it inherits neither the
	     arrowhead marker nor the dashed pattern. -->
	<g class="motion" aria-hidden="true">
		{#each [0, 1, 2, 3] as i (i)}
			<g style={`--i: ${i}`}>
				<circle class="halo" cx="34" cy={52 + i * 52} r="7" fill="url(#pulse-halo)" stroke="none" />
				<circle class="pulse" cx="34" cy={52 + i * 52} r="2.8" fill="var(--brand)" stroke="none" />
			</g>
		{/each}
		<g class="sap">
			<circle class="halo" r="7" fill="url(#pulse-halo)" stroke="none" />
			<circle class="pulse" r="2.8" fill="var(--brand)" stroke="none" />
		</g>
	</g>

	{#each stages as stage, i (stage.stage)}
		<g transform={`translate(20 ${16 + i * 52})`}>
			<rect width="192" height="36" class="node" style={`--node-h: 36; --i: ${i}`} fill="color-mix(in srgb, var(--brand) 7%, transparent)" stroke="var(--brand)" stroke-width="1.1" />
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
		<!-- 7% tint like the stage boxes, not fill="none": the arrival flare animates fill-opacity, so on an unfilled rect the only thing that could react was a hairline dashed stroke, and the moment the dot landed went almost unseen -->
		<rect width="404" height="34" class="node node-end" style="--node-h: 34" fill="color-mix(in srgb, var(--brand) 7%, transparent)" stroke="var(--brand)" stroke-width="1.1" stroke-dasharray="4 3" />
		<text x="12" y="21" class="map-note" font-size="9.5" fill="var(--muted)">
			{integration}
		</text>
	</g>
</svg>

<style>
	/* These have to be CSS classes, not SVG presentation attributes: an attribute
	   value cannot resolve var(--font-*), so the text fell back to a default face. */

	/* rx as a CSS property can read var(--radius-control), the same variable
	   every button and corner control uses, so the diagram's corners follow
	   the shape switcher too. Getting this to actually MATCH a real button
	   (not an ellipse) needs two things a plain `rx: var(...)` does not do:
	   - clamp against the box's OWN half-height (--node-h, set inline per
	     rect since the two boxes are 36px and 34px tall), the same way
	     CSS border-radius clamps a rounded box's corner to min(radius, h/2);
	   - set ry equal to that same clamped value. Left alone, ry auto-derives
	     from height/2 independently of rx, so at pill scale rx clamps to
	     half-WIDTH (~96px) while ry clamps to half-HEIGHT (~17px) and the
	     shape becomes a full ellipse, not a pill: exactly the "oval" bug. */
	.node {
		--r: min(var(--radius-control), calc(var(--node-h) * 1px / 2));
		rx: var(--r);
		ry: var(--r);
	}

	.map-title {
		font-family: var(--font-display);
	}

	.map-note {
		font-family: var(--font-mono);
	}

	/* MOTION (his request, 29 Sep 2026, second pass): the first attempt moved
	   only tens of pixels between frames and he would still have called it dead.
	   What carries the effect now:
	   - the box being read FLARES: its stroke nearly triples in weight and the
	     7% tint underneath it goes solid, which is a change you cannot miss;
	   - a pulse with a halo drops out of that box into the one below;
	   - a dot rides the dashed SAP path to the integration layer, slow and once
	     per cycle, so the eye is not pulled two ways at once.
	   The first pass also failed because the box animation only touched opacity
	   on a 7% fill: a 55% opacity swing on a 7% tint is a two or three level
	   change in RGB, invisible in practice. Weight and scale move pixels; opacity
	   alone does not.
	   Stagger is --i, set inline per box, so the read sweeps downward in order.
	   All of it lives inside a no-preference query, so a visitor who has asked
	   for reduced motion gets the plain diagram. */
	@media (prefers-reduced-motion: no-preference) {
		.node {
			animation: node-flare 5.6s ease-in-out infinite;
			/* backwards, not the default none: during the stagger delay the box would
			   otherwise paint at its own full-strength base values, so on first load
			   every box appeared lit at once until its turn in the sweep arrived */
			animation-fill-mode: backwards;
			animation-delay: calc(var(--i, 0) * 0.45s);
		}

		/* The integration box is NOT a step in the sweep, it is where the dashed path
		   ends, so it must light when the dot lands rather than on its own turn in the
		   queue. It shares the same 4.4s clock as everything else; the sync comes from
		   the shared cycle, not from a delay. Its rule sits after .node because both
		   selectors have the same specificity and only source order separates them. */
		.node-end {
			animation: node-arrival 5.6s ease-in-out infinite;
			animation-fill-mode: backwards;
			animation-delay: 0s;
		}


		.halo,
		.pulse {
			animation: pulse-fall 5.6s ease-in-out infinite;
			animation-fill-mode: backwards;
			animation-delay: calc(var(--i, 0) * 0.45s);
		}

		.sap .halo,
		.sap .pulse {
			offset-path: path("M212 124 H442 V305 H434");
			/* 2.8s, not the 7.6s of the first pass: on a path this long a slow dot
			   reads as a stuck pixel rather than as flow, and the crossing has to
			   finish inside the time the eye spends on the diagram at all. */
			/* also 4.4s. A faster, separate cycle for the dot was exactly what put its
			   arrival and the box's flare on two different clocks. */
			animation: sap-travel 5.6s linear infinite;
			animation-fill-mode: backwards;
			opacity: 0;
		}
	}

	@keyframes node-flare {
		0%,
		18%,
		100% {
			stroke-opacity: 0.34;
			stroke-width: 1.1;
			fill-opacity: 0.4;
		}
		7% {
			stroke-opacity: 1;
			stroke-width: 1.95;
			fill-opacity: 1;
		}
	}

	@keyframes pulse-fall {
		0%,
		7% {
			opacity: 0;
			transform: translateY(0);
		}
		9.5% {
			opacity: 1;
		}
		20% {
			opacity: 1;
			transform: translateY(14px);
		}
		25%,
		100% {
			opacity: 0;
			transform: translateY(14px);
		}
	}

	@keyframes sap-travel {
		/* 23% is the instant the THIRD box flares: box one lights at 7% and each
		   later box 0.45s (8% of the cycle) after the one above it, so the API
		   layer is at 7 + 2*8 = 23%. The dashed path leaves the stack at that
		   box's level, so the dot setting off later than that read as a delay. */
		/* 26% is when the SECOND box's flash ends, and that is the beat he asked for:
		   box 2 (the gateway, where this dashed path leaves the stack) starts its own
		   timeline at 0.45s, is lit at 7% and returns to dim at 18%, so its flash dies
		   at 1.46s = 26% of the cycle. The dot now sets off exactly as that flash
		   fades, instead of running while the third box was still lit. */
		0%,
		26% {
			offset-distance: 0%;
			opacity: 0;
		}
		26.5% {
			opacity: 1;
		}
		53% {
			offset-distance: 100%;
			opacity: 1;
		}
		57% {
			opacity: 1;
		}
		65%,
		100% {
			offset-distance: 100%;
			opacity: 0;
		}
	}

	/* The destination box, lit at 95.5% against the dot's arrival at 95%. The first
	   version ramped from 88%, and because the easing interpolates between keyframes
	   the box started glowing about a third of a second before the dot landed — he saw
	   it as the flare running early. The ramp now starts at 93.5%, so the onset is a
	   fraction of a second ahead of the hit and the peak lands just after it. */
	@keyframes node-arrival {
		0%,
		50%,
		75%,
		100% {
			stroke-opacity: 0.34;
			stroke-width: 1.1;
			fill-opacity: 0.4;
		}
		/* quick rise, then HELD lit from 80% to 92%: about 0.8s of light plus a short
		   fade, against the 0.22s the whole thing used to get at the end of the cycle */
		53% {
			stroke-opacity: 1;
			stroke-width: 1.95;
			fill-opacity: 1;
		}
		/* held to 69%: about 0.9s of light, the same length as before, just ending
		   earlier so the light clears well before the sweep comes round again */
		69% {
			stroke-opacity: 1;
			stroke-width: 1.95;
			fill-opacity: 1;
		}
	}
</style>
