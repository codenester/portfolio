/**
 * Theme preference: light (pinky violet) / dark (deep violet).
 * Stored in localStorage; the chosen attribute is applied to <html>.
 * Mirrored by the inline bootstrap script in src/app.html so the first
 * paint is already correct (no flash of the wrong palette).
 *
 * A first visit (nothing stored) always starts DARK — the site does not
 * follow the OS colour scheme. The visitor's own toggle wins from then on.
 */

export type Theme = 'light' | 'dark';

export const THEME_KEY = 'rithea.theme';

/**
 * The R mark ships twice, one file per palette (see scripts/make-mark-icons.py):
 * the bright magenta reads on the dark background, the deeper violet on the
 * light one. The mark is linked once, from +layout.svelte, as #site-icon with
 * the dark file as its prerendered default (the same default the bootstrap
 * script picks for a first visit).
 */
const SITE_ICON: Record<Theme, string> = {
	dark: '/icon/icon-dark.png',
	light: '/icon/icon-light.png'
};

/**
 * The browser chrome colour, one per palette: the dark violet against the dark
 * page, the near white against the light one. Mirrored by the bootstrap script in
 * src/app.html, which sets both this and the icon before the first paint.
 */
const CHROME_COLOR: Record<Theme, string> = {
	dark: '#150d1c',
	light: '#faf6fb'
};

function syncChromeColor(theme: Theme): void {
	const meta = document.getElementById('theme-color');
	if (meta instanceof HTMLMetaElement && meta.content !== CHROME_COLOR[theme]) {
		meta.content = CHROME_COLOR[theme];
	}
}

function syncSiteIcon(theme: Theme): void {
	const link = document.getElementById('site-icon');
	if (link instanceof HTMLLinkElement && link.getAttribute('href') !== SITE_ICON[theme]) {
		link.href = SITE_ICON[theme];
	}
}

export function readTheme(): Theme {
	try {
		const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(THEME_KEY) : null;
		if (stored === 'light' || stored === 'dark') return stored;
	} catch {
		/* private mode / storage disabled */
	}
	return 'dark';
}

export function applyTheme(theme: Theme, persist = true): void {
	if (typeof document === 'undefined') return;
	document.documentElement.dataset.theme = theme;
	syncSiteIcon(theme);
	syncChromeColor(theme);
	if (!persist) return;
	try {
		localStorage.setItem(THEME_KEY, theme);
	} catch {
		/* ignore */
	}
}

export function nextTheme(current: Theme): Theme {
	return current === 'dark' ? 'light' : 'dark';
}
