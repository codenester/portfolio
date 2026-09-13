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
