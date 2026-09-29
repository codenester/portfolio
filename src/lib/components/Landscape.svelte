<script lang="ts">
	/**
	 * The span, not the depth. Three of my five visual ideas were pictures of the same
	 * supermarket platform, which would quietly turn a seven year career into one project.
	 * This is the opposite: every domain he has actually shipped software for, side by side,
	 * so the page reads as range.
	 *
	 * Types are named rather than counted: no client is identified, no figure is quoted, and
	 * nothing here appears that the case studies above do not already describe.
	 */
	const systems: { name: string; kind: string; note: string }[] = [
		{ name: 'Retail point of sale', kind: 'platform', note: 'the chain POS he runs today, offline first' },
		{ name: 'Supermarket ERP suite', kind: 'platform', note: 'purchasing, stock, billing, reporting' },
		{ name: 'Delivery and shipment tracking', kind: 'system', note: 'orders through to delivered' },
		{ name: 'Ecommerce', kind: 'system', note: 'built from zero, ordering to fulfilment' },
		{ name: 'Customer loyalty', kind: 'system', note: 'points, vouchers and redemption' },
		{ name: 'SAP integration layer', kind: 'integration', note: 'sales, billing, inventory, invoices' },
		{ name: 'Retail reporting dashboards', kind: 'reporting', note: 'what head office reads each day' },
		{ name: 'Techniverse.Ecosys', kind: 'own project', note: 'a platform you assemble from modules' }
	];
</script>

<section class="section landscape" aria-label="The kinds of system built">
	<div class="wrap">
		<h2>The range of systems</h2>
		<p class="lead">
			Not one platform, built once. Retail, ERP, logistics, commerce and the integration between
			them, in both generations of the stack.
		</p>

		<ul class="grid">
			{#each systems as item (item.name)}
				<li>
					<span class="kind">{item.kind}</span>
					<span class="name">{item.name}</span>
					<span class="note">{item.note}</span>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	.landscape {
		padding-top: 54px;
	}

	.lead {
		max-width: 62ch;
		margin: 10px 0 28px;
		font-size: 16.5px;
		line-height: 1.6;
		color: var(--muted);
	}

	.grid {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 16px;
	}

	.grid li {
		border: 1px solid var(--border);
		border-radius: var(--radius-surface);
		padding: 14px 16px;
	}

	.kind {
		display: block;
		font-family: var(--font-mono);
		font-size: 10.5px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--brand);
	}

	.name {
		display: block;
		margin-top: 6px;
		font-size: 15.5px;
		color: var(--ink);
	}

	.note {
		display: block;
		margin-top: 4px;
		font-size: 13.5px;
		line-height: 1.45;
		color: var(--muted);
	}
</style>
