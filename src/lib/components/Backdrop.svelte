<script lang="ts">
	/**
	 * Hero backdrop: inline SVG "business object" line pattern —
	 * POS terminal, barcode, receipt, database, cart, box, truck, chart —
	 * drawn in the theme tints, behind two soft brand washes.
	 * Deliberately vector + theme-tinted (no raster art).
	 */
</script>

<svg
	class="bg-art"
	viewBox="0 0 1440 900"
	preserveAspectRatio="xMidYMid slice"
	aria-hidden="true"
	focusable="false"
>
	<defs>
		<radialGradient id="wash-a" cx="18%" cy="8%" r="62%">
			<stop offset="0%" stop-color="var(--brand)" stop-opacity="0.18" />
			<stop offset="100%" stop-color="var(--brand)" stop-opacity="0" />
		</radialGradient>
		<radialGradient id="wash-b" cx="88%" cy="24%" r="58%">
			<stop offset="0%" stop-color="var(--brand-strong)" stop-opacity="0.16" />
			<stop offset="100%" stop-color="var(--brand-strong)" stop-opacity="0" />
		</radialGradient>

		<pattern id="objects" width="150" height="150" patternUnits="userSpaceOnUse">
			<g
				fill="none"
				stroke="var(--art-faint)"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<!-- POS terminal -->
				<g transform="translate(14 16)">
					<rect x="0" y="0" width="24" height="16" rx="1.5" />
					<path d="M4 5 H15 M4 9 H12" />
					<path d="M8 16 V22 M2 22 H14" />
				</g>
				<!-- barcode -->
				<g transform="translate(84 20)">
					<path d="M0 0 V16 M4 0 V16 M9 0 V16 M13 0 V16 M16 0 V16 M21 0 V16" />
				</g>
				<!-- receipt -->
				<g transform="translate(18 92)">
					<path d="M0 0 H20 V20 L15 17 L10 20 L5 17 L0 20 Z" />
					<path d="M5 6 H15 M5 11 H12" />
				</g>
				<!-- database -->
				<g transform="translate(92 88)">
					<ellipse cx="10" cy="4" rx="10" ry="4" />
					<path d="M0 4 V18 A10 4 0 0 0 20 18 V4" />
					<path d="M0 11 A10 4 0 0 0 20 11" />
				</g>
			</g>
			<g
				fill="none"
				stroke="var(--art-fainter)"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<!-- cart -->
				<g transform="translate(56 58)">
					<path d="M0 2 H3 L6 14 H18 L21 5 H4" />
					<circle cx="8" cy="18" r="1.6" />
					<circle cx="17" cy="18" r="1.6" />
				</g>
				<!-- box -->
				<g transform="translate(112 130)">
					<path d="M0 4 L10 0 L20 4 V14 L10 18 L0 14 Z" />
					<path d="M0 4 L10 8 L20 4 M10 8 V18" />
				</g>
				<!-- truck -->
				<g transform="translate(52 124)">
					<path d="M0 4 H13 V15 H0 Z M13 8 H19 L22 12 V15 H13" />
					<circle cx="5" cy="18" r="2" />
					<circle cx="17" cy="18" r="2" />
				</g>
			</g>
		</pattern>
	</defs>

	<rect width="1440" height="900" fill="url(#wash-a)" />
	<rect width="1440" height="900" fill="url(#wash-b)" />
	<rect
		x="0"
		y="0"
		width="1440"
		height="900"
		fill="url(#objects)"
		opacity="0.9"
		style="mask-image: linear-gradient(to bottom, #000 0%, transparent 88%); -webkit-mask-image: linear-gradient(to bottom, #000 0%, transparent 88%);"
	/>
</svg>
