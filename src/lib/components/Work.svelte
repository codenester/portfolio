<script lang="ts">
	import { cases, ui } from '$lib/content/site';
	import ModuleFlow from '$lib/components/ModuleFlow.svelte';
	import Icon from '$lib/components/Icon.svelte';
</script>

<section class="section" id="work">
	<div class="wrap">
		<div class="section-head">
			<h2><Icon name="work" size={17} />{ui.work.title}</h2>
			<p>{ui.work.lead}</p>
		</div>

		{#each cases as study (study.id)}
			<article class="case">
				<div>
					<p class="kind">{study.kind}</p>
					<h3>{study.title}</h3>
					<div class="meta">
						<span><strong>{study.org}</strong></span>
						<span>{study.period}</span>
						<span>{study.role}</span>
					</div>
					{#if study.explore}
						<ModuleFlow cta={study.explore.cta} title={study.explore.title} lead={study.explore.lead} />
					{/if}
				</div>

				<div class="case-body">
					<div class="block">
						<span class="label">{ui.work.problem}</span>
						<p>{study.problem}</p>
					</div>

					<div class="block">
						<span class="label">{ui.work.approach}</span>
						<ol>
							{#each study.approach as step, i (i)}
								<li>{step}</li>
							{/each}
						</ol>
					</div>

					<div class="block">
						<span class="label">{ui.work.result}</span>
						<p class="result">{study.result}</p>
					</div>

					<div class="block">
						<span class="label">{ui.work.stack}</span>
						<div class="chips">
							{#each study.stack as tech (tech)}
								<span class="chip">{tech}</span>
							{/each}
						</div>
					</div>
				</div>
			</article>
		{/each}
	</div>
</section>
