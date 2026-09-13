<script lang="ts">
	import Backdrop from './Backdrop.svelte';
	import ArchitectureMap from './ArchitectureMap.svelte';
	import { facts, profile, ui } from '$lib/content/site';
</script>

<section class="hero" id="top">
	<Backdrop />

	<div class="wrap hero-inner">
		<div>
			<p class="eyebrow">{profile.eyebrow}</p>
			<h1>{profile.name}</h1>
			<p class="role">{profile.role}</p>
			<p class="pitch">{profile.pitch}</p>

			<div class="cta-row">
				<a class="btn primary" href="#work">
					{ui.hero.seeWork}
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M5 12h14M13 6l6 6-6 6" />
					</svg>
				</a>
				<a class="btn" href="#contact">{ui.hero.contactMe}</a>
			</div>
		</div>

		<div class="spec">
			<div class="spec-bar" aria-hidden="true">
				<span class="dot"></span>
				<span class="dot"></span>
				<span class="dot"></span>
				<span class="spec-file">spec.yml</span>
			</div>

			<div class="spec-body">
				<p class="spec-line" aria-hidden="true">
					rithea@sreng<span class="dim">:~/portfolio$</span> cat spec.yml
				</p>

				<dl class="spec-rows" aria-label={ui.hero.atAGlance}>
					{#each facts as fact (fact.label)}
						<div class="spec-row">
							<dt>{fact.label.toLowerCase().replaceAll(' ', '_')}</dt>
							<dd><span class="eq" aria-hidden="true">=</span>{fact.value}</dd>
						</div>
					{/each}
				</dl>

				<div class="arch">
					<p class="spec-line" aria-hidden="true">
						rithea@sreng<span class="dim">:~/portfolio$</span> cat architecture.svg
					</p>
					<ArchitectureMap />
				</div>

				<p class="spec-cursor" aria-hidden="true"><span class="caret"></span></p>
			</div>
		</div>
	</div>
</section>
