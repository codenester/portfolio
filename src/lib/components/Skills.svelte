<script lang="ts">
	import { languages, skillGroups, ui } from '$lib/content/site';
	import Icon from '$lib/components/Icon.svelte';
</script>

<section class="section" id="skills">
	<div class="wrap">
		<div class="section-head">
			<h2><Icon name="code" size={17} />{ui.skills.title}</h2>
		</div>

		<div class="rows">
			{#each skillGroups as group (group.label)}
				<div class="row">
					<p class="k"><Icon name={group.icon} size={15} />{group.label}</p>
					<div class="v">
						<div class="chips">
							{#each group.items as item (item)}
								<span class="chip">{item}</span>
							{/each}
						</div>
					</div>
				</div>
			{/each}

			<div class="row">
				<p class="k"><Icon name="translate" size={15} />{ui.skills.languages}</p>
				<div class="v">
					{#each languages as language (language.name)}
						<p>{language.name} · {language.level}</p>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>
