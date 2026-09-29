<script lang="ts">
	import { stats } from '$lib/content/site';

	/**
	 * The proof band. It sits directly under the hero because it is the fastest honest
	 * answer to "has this person run anything": four figures, each one traceable to work
	 * he has described elsewhere on the page, none of them estimated.
	 */
</script>

<section class="stats" aria-label="The platform, in numbers">
	<div class="wrap stats-grid">
		{#each stats as stat (stat.label)}
			<div class="stat">
				<p class="stat-value">{stat.value}</p>
				<p class="stat-label">{stat.label}</p>
				<p class="stat-note">{stat.note}</p>
			</div>
		{/each}
	</div>
</section>

<style>
	.stats {
		/* negative space above, because the hero already ends with its own padding */
		padding: 6px 0 26px;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
	}

	/* Internal rules instead of four separate cards: a band reads as one piece of
	   evidence rather than four unrelated tiles, and it cannot look like a pricing
	   table, which is what a card per number starts to resemble. */
	.stat {
		padding: 20px 22px;
		border-left: 1px solid var(--border);
	}

	.stat:first-child {
		border-left: 0;
		padding-left: 0;
	}

	.stat-value {
		margin: 0;
		font-family: var(--font-display);
		font-size: clamp(24px, 2.6vw, 34px);
		font-weight: 700;
		line-height: 1.05;
		letter-spacing: -0.02em;
		color: var(--ink);
	}

	.stat-label {
		margin: 4px 0 0;
		font-size: 15px;
		color: var(--ink);
	}

	.stat-note {
		margin: 6px 0 0;
		font-family: var(--font-mono);
		font-size: 11.5px;
		line-height: 1.45;
		color: var(--muted);
	}

	@media (max-width: 820px) {
		.stats-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		/* with two columns the third item starts a new row, so it must lose the
		   left rule that only made sense inline in a single row of four */
		.stat:nth-child(3) {
			border-left: 0;
			padding-left: 0;
		}

		.stat:nth-child(n + 3) {
			border-top: 1px solid var(--border);
		}
	}

	@media (max-width: 520px) {
		.stats-grid {
			grid-template-columns: 1fr;
		}

		.stat,
		.stat:nth-child(3) {
			border-left: 0;
			padding-left: 0;
			border-top: 1px solid var(--border);
		}

		.stat:first-child {
			border-top: 0;
		}
	}
</style>
