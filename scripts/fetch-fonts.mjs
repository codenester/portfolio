// Fetches the two webfonts this site uses and stores them in static/fonts/.
//
// Why local: the site advertises zero third party runtime requests, and a
// <link> to fonts.googleapis.com breaks that on every page load, adds a DNS
// lookup plus a render-blocking stylesheet on a third origin, and puts the
// typography behind someone else's uptime. Google serves these families as
// variable woff2, so one file per family covers every weight the site uses.
//
// Usage: node scripts/fetch-fonts.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'static/fonts');

// family -> [min weight, max weight] used by src/app.css
const FAMILIES = {
	Manrope: { slug: 'manrope', weights: '400 700' },
	'Space Grotesk': { slug: 'space-grotesk', weights: '500 700' }
};

// a modern desktop UA is required, otherwise Google serves ttf instead of woff2
const UA =
	'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';

const cssUrl =
	'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Manrope:wght@400;500;600;700&display=swap';

const css = await fetch(cssUrl, { headers: { 'user-agent': UA } }).then((r) => {
	if (!r.ok) throw new Error(`font css: HTTP ${r.status}`);
	return r.text();
});

const blocks = [...css.matchAll(/@font-face\s*\{([^}]*)\}/g)].map((m) => m[1]);
mkdirSync(OUT_DIR, { recursive: true });

const faces = [];
for (const [family, meta] of Object.entries(FAMILIES)) {
	// the latin subset is the block whose unicode-range starts at U+0000-00FF
	const block = blocks.find(
		(b) => b.includes(`'${family}'`) && /unicode-range:[^;]*U\+0000-00FF/.test(b)
	);
	if (!block) throw new Error(`no latin subset for ${family}`);
	const url = block.match(/url\((https:\/\/[^)]+)\)/)?.[1];
	if (!url) throw new Error(`no url in the ${family} latin block`);

	const bytes = Buffer.from(
		await fetch(url, { headers: { 'user-agent': UA } }).then((r) => {
			if (!r.ok) throw new Error(`${family} woff2: HTTP ${r.status}`);
			return r.arrayBuffer();
		})
	);
	writeFileSync(join(OUT_DIR, `${meta.slug}.woff2`), bytes);
	console.log(`static/fonts/${meta.slug}.woff2  ${bytes.length} bytes`);

	faces.push(
		`@font-face {\n\tfont-family: '${family}';\n\tfont-style: normal;\n\tfont-weight: ${meta.weights};\n\tfont-display: swap;\n\tsrc: url('/fonts/${meta.slug}.woff2') format('woff2');\n}`
	);
}

console.log('\nPaste into src/app.css:\n');
console.log(faces.join('\n'));
