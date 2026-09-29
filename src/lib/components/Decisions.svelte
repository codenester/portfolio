<script lang="ts">
	import { decisions } from '$lib/content/site';
</script>

<section class="section" id="decisions">
	<div class="wrap">
		<h2>{decisions.title}</h2>
		<p class="lead">{decisions.lead}</p>

		<div class="cards">
			{#each decisions.items as item (item.name)}
				<article class="card">
					<h3>{item.name}</h3>
					<dl>
						<dt>The problem</dt>
						<dd>{item.problem}</dd>
						<dt>The decision</dt>
						<dd>{item.decision}</dd>
						<dt>What it cost</dt>
						<dd>{item.cost}</dd>
					</dl>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.lead {
		max-width: 62ch;
		margin: 10px 0 26px;
		font-size: 16.5px;
		line-height: 1.6;
		color: var(--muted);
	}

	.cards {
		display: grid;
		gap: 18px;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	}

	.card {
		border: 1px solid var(--border);
		border-radius: var(--radius-surface);
		padding: 20px 22px;
		background: color-mix(in srgb, var(--brand) 4%, transparent);
	}

	.card h3 {
		margin: 0 0 14px;
		font-size: 16.5px;
		line-height: 1.3;
	}

	dl {
		margin: 0;
	}

	dt {
		font-family: var(--font-mono);
		font-size: 11px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--brand);
		margin: 0 0 3px;
	}

	dd {
		margin: 0 0 14px;
		font-size: 14.5px;
		line-height: 1.6;
		color: var(--muted);
	}

	dd:last-child {
		margin-bottom: 0;
	}
</style>
