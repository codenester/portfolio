<script lang="ts">
	import { built } from '$lib/content/site';
</script>

<section class="section" id="built">
	<div class="wrap">
		<h2>{built.title}</h2>
		<p class="lead">{built.lead}</p>

		<ul class="list">
			{#each built.items as item (item.name)}
				<li>
					<h3>{item.name}</h3>
					<p>{item.body}</p>
				</li>
			{/each}
		</ul>
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

	.list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 18px 22px;
	}

	.list li {
		border-left: 2px solid var(--brand);
		padding-left: 16px;
	}

	.list h3 {
		margin: 0 0 5px;
		font-size: 16px;
		line-height: 1.3;
	}

	.list p {
		margin: 0;
		font-size: 14.5px;
		line-height: 1.62;
		color: var(--muted);
	}
</style>
