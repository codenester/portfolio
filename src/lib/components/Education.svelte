<script lang="ts">
	import { education, profile, ui } from '$lib/content/site';
	import Icon from '$lib/components/Icon.svelte';
</script>

<section class="section" id="education">
	<div class="wrap">
		<div class="section-head">
			<h2><Icon name="cert" size={17} />{ui.education.title}</h2>
		</div>
		<div class="rows">
			{#each education as item (item.title)}
				<div class="row">
					<p class="k"><Icon name={item.icon} size={15} />{item.title}</p>
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
				<h2><Icon name="chat" size={17} />{ui.contact.title}</h2>
				<p class="lead">{ui.contact.lead}</p>
				<div class="cta-stack">
					<a class="btn primary" href="/cv/Rithea-Sreng-CV.pdf" download>
						<span class="doc pdf"><Icon name="pdf" size={20} /></span>
						{ui.contact.cv}
					</a>
					<a class="btn" href="/cv/Rithea-Sreng-CV.docx" download>
						<span class="doc word"><Icon name="word" size={20} /></span>
						{ui.contact.cvDocx}
					</a>
				</div>
			</div>

			<div class="contact-list">
				<a href={`mailto:${profile.email}`}>
					<span class="k"><Icon name="mail" size={13} />{ui.contact.email}</span>
					<span>{profile.email}</span>
				</a>
				<a href={`tel:${profile.phoneHref}`}>
					<span class="k"><Icon name="phone" size={13} />{ui.contact.phone}</span>
					<span>{profile.phone}</span>
				</a>
				<a href={profile.linkedin} rel="me noopener" target="_blank">
					<span class="k"><Icon name="linkedin" size={13} />{ui.contact.linkedin}</span>
					<span>{profile.linkedinLabel}</span>
				</a>
				<span>
					<span class="k"><Icon name="pin" size={13} />{ui.contact.location}</span>
					<span>{profile.location}</span>
				</span>
			</div>
		</div>
	</div>
</section>
