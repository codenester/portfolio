<script lang="ts">
	import { cases, ui } from '$lib/content/site';
	import ModuleFlow from '$lib/components/ModuleFlow.svelte';
	import Icon from '$lib/components/Icon.svelte';

	// A terminal-style filename per case: 01-pos-architecture.log. Purely a
	// visual device (the id is already a URL-safe slug), no new content.
	function fileName(id: string, index: number): string {
		const n = String(index + 1).padStart(2, '0');
		return `${n}-${id}.log`;
	}
</script>

<section class="section" id="work">
	<div class="wrap">
		<div class="section-head">
			<h2><Icon name="work" size={17} />{ui.work.title}</h2>
			<p>{ui.work.lead}</p>
		</div>

		{#each cases as study, i (study.id)}
			<article class="case">
				<div class="case-term">
					<div class="term-bar">
						<span class="dot"></span>
						<span class="dot"></span>
						<span class="dot"></span>
						<span class="term-file">{fileName(study.id, i)}</span>
					</div>
					<div class="term-prompt">
						<span class="term-user">rithea@sreng</span><span class="term-dim">:~/work$</span> cat
						{fileName(study.id, i)}
					</div>
				</div>

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
						<span class="label">$ {ui.work.problem}</span>
						<p>{study.problem}</p>
					</div>

					<div class="block">
						<span class="label">$ {ui.work.approach}</span>
						<ol>
							{#each study.approach as step, j (j)}
								<li>{step}</li>
							{/each}
						</ol>
					</div>

					<div class="block">
						<span class="label">$ {ui.work.result}</span>
						<p class="result">{study.result}</p>
					</div>

					<div class="block">
						<span class="label">$ {ui.work.stack}</span>
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
