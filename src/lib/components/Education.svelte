<script lang="ts">
	import { education, profile, ui } from '$lib/content/site';
</script>

<section class="section" id="education">
	<div class="wrap">
		<div class="section-head">
			<h2>{ui.education.title}</h2>
		</div>
		<div class="rows">
			{#each education as item (item.title)}
				<div class="row">
					<p class="k">{item.title}</p>
					<div class="v">
						<p>{item.org}</p>
						<p class="mono-line">{item.year}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="section" id="contact">
	<div class="wrap">
		<div class="contact-card">
			<div>
				<h2>{ui.contact.title}</h2>
				<p class="lead">{ui.contact.lead}</p>
				<div class="cta-stack">
					<a class="btn primary" href="/cv/Rithea-Sreng-CV.pdf" download
						>{ui.contact.cv}</a
					>
				</div>
			</div>

			<div class="contact-list">
				<a href={`mailto:${profile.email}`}>
					<span class="k">{ui.contact.email}</span>
					<span>{profile.email}</span>
				</a>
				<a href={`tel:${profile.phoneHref}`}>
					<span class="k">{ui.contact.phone}</span>
					<span>{profile.phone}</span>
				</a>
				<a href={profile.linkedin} rel="me noopener" target="_blank">
					<span class="k">{ui.contact.linkedin}</span>
					<span>{profile.linkedinLabel}</span>
				</a>
				<span>
					<span class="k">{ui.contact.location}</span>
					<span>{profile.location}</span>
				</span>
			</div>
		</div>
	</div>
</section>
