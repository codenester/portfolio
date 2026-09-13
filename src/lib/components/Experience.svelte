<script lang="ts">
	import { jobs, ui } from '$lib/content/site';
</script>

<section class="section" id="experience">
	<div class="wrap">
		<div class="section-head">
			<h2>{ui.experience.title}</h2>
		</div>

		<ol class="timeline">
			{#each jobs as job (job.org + job.period)}
				<li class="job" class:current={job.current}>
					<p class="when">
						<span class="period">{job.period}</span>
						{#if job.current}
							<span class="now">{ui.experience.present}</span>
						{/if}
					</p>

					<h3>{job.role}</h3>
					<p class="org">{job.org}</p>

					<ul class="points">
						{#each job.points as point, i (i)}
							<li>{point}</li>
						{/each}
					</ul>

					<div class="chips">
						{#each job.stack as tech (tech)}
							<span class="chip">{tech}</span>
						{/each}
					</div>
				</li>
			{/each}
		</ol>
	</div>
</section>
