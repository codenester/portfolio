<script lang="ts">
	import { delivery } from '$lib/content/site';

	// Numbered because the order is the argument: plan, build, release, support, learn.
</script>

<section class="section" id="delivery">
	<div class="wrap">
		<h2>{delivery.title}</h2>
		<p class="lead">{delivery.lead}</p>

		<ol class="steps">
			{#each delivery.steps as step, i (step.name)}
				<li>
					<span class="num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
					<div>
						<h3>{step.name}</h3>
						<p>{step.body}</p>
					</div>
				</li>
			{/each}
		</ol>
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

	.steps {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0;
		border-top: 1px solid var(--border);
	}

	/* two up on a wide screen: five full width rows of heading plus paragraph is the wall
	   he pointed at. The numbering carries the order across the columns. */
	@media (min-width: 900px) {
		.steps {
			grid-template-columns: 1fr 1fr;
			column-gap: 34px;
		}
	}

	/* A rule per step rather than cards: five cards would read as a feature grid, and
	   this is a sequence, so the eye should be able to run straight down it. */
	.steps li {
		display: grid;
		grid-template-columns: 54px 1fr;
		gap: 14px;
		padding: 18px 0;
		border-bottom: 1px solid var(--border);
	}

	.num {
		font-family: var(--font-mono);
		font-size: 12.5px;
		line-height: 1.9;
		color: var(--brand);
	}

	.steps h3 {
		margin: 0 0 4px;
		font-size: 17px;
	}

	.steps p {
		margin: 0;
		max-width: 68ch;
		line-height: 1.6;
		color: var(--muted);
	}

	@media (max-width: 620px) {
		.steps li {
			grid-template-columns: 34px 1fr;
		}
	}
</style>
