import type { LayoutLoad } from './$types';

/**
 * Fully static: every route is prerendered at build time
 * (adapter-static → build/, deployable to any static host).
 */
export const prerender = true;
export const trailingSlash = 'never';

export const load: LayoutLoad = async () => ({});
