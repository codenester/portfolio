<script lang="ts">
	import { about, profile, style, ui } from '$lib/content/site';

	// If /img/profile.jpg is not in place yet the frame falls back to the
	// monogram instead of showing a broken image.
	let photoOk = $state(true);
</script>

<section class="section" id="about">
	<div class="wrap about-head">
		<figure class="portrait">
			<div class="frame">
				{#if photoOk}
					<!-- phones get the wider frame (crop 1): the opening of the bio sits
					     over the lower part of the photo, so more picture has to be in view -->
					<picture>
						<source media="(max-width: 780px)" srcset="/img/profile-frame.jpg" />
						<img
							src="/img/profile.jpg"
							alt={`Portrait of ${profile.nameLatin}`}
							width="560"
							height="700"
							decoding="async"
							onerror={() => (photoOk = false)}
						/>
					</picture>
				{:else}
					<div class="fallback" aria-hidden="true">RS</div>
				{/if}
				<!-- seats the photo in the dark palette: invisible in light mode -->
				<span class="shade" aria-hidden="true"></span>
			</div>

			<!-- on phones this is the block that sits on the photo; on desktop it is
			     the first column of the bio, with .about-rest continuing it -->
			<div class="about-body">
				<h2>{ui.about.title}</h2>
				<p class="lead">{about.paragraphs[0]}</p>
			</div>

			<figcaption>{about.caption}</figcaption>
		</figure>

		<div class="about-rest">
			{#each about.paragraphs.slice(1) as paragraph (paragraph)}
				<p class="lead">{paragraph}</p>
			{/each}
		</div>
	</div>

	<div class="wrap">
		<div class="rows">
			{#each style as item (item.title)}
				<div class="row">
					<p class="k">{item.title}</p>
					<p class="v">{item.body}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
