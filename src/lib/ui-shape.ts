/**
 * Corner-style preference: rect → rounded → pill.
 * Overrides the semantic radius variables in app.css via data-shape.
 */

export type Shape = 'rect' | 'rounded' | 'pill';

export const SHAPE_KEY = 'rithea.shape';

const ORDER: Shape[] = ['rect', 'rounded', 'pill'];

export function readShape(): Shape {
	try {
		const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(SHAPE_KEY) : null;
		if (stored === 'rect' || stored === 'rounded' || stored === 'pill') return stored;
	} catch {
		/* ignore */
	}
	return 'rounded';
}

export function applyShape(shape: Shape, persist = true): void {
	if (typeof document === 'undefined') return;
	document.documentElement.dataset.shape = shape;
	if (!persist) return;
	try {
		localStorage.setItem(SHAPE_KEY, shape);
	} catch {
		/* ignore */
	}
}

export function nextShape(current: Shape): Shape {
	return ORDER[(ORDER.indexOf(current) + 1) % ORDER.length];
}
