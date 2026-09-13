// Static file server for the prerendered site in build/.
//
// The site is fully prerendered (adapter-static), so serving files is the whole
// job. No dependencies on purpose: Railway injects PORT and expects a process
// that binds 0.0.0.0 and answers within its healthcheck window.
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { extname, join, normalize, resolve, sep } from 'node:path';

const ROOT = resolve(process.cwd(), 'build');
const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '0.0.0.0';

const TYPES = {
	'.html': 'text/html; charset=utf-8',
	'.css': 'text/css; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.mjs': 'text/javascript; charset=utf-8',
	'.json': 'application/json; charset=utf-8',
	'.webmanifest': 'application/manifest+json',
	'.svg': 'image/svg+xml',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.png': 'image/png',
	'.webp': 'image/webp',
	'.avif': 'image/avif',
	'.ico': 'image/x-icon',
	'.pdf': 'application/pdf',
	'.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'.txt': 'text/plain; charset=utf-8',
	'.xml': 'application/xml; charset=utf-8',
	'.woff2': 'font/woff2',
	'.woff': 'font/woff'
};

const COMPRESSIBLE = /^(text\/|application\/(javascript|json|xml|manifest))|image\/svg/;
const GZIP_LIMIT = 512 * 1024;
const gzipCache = new Map();

function cacheControl(pathname, file) {
	// Vite writes content-hashed filenames under /_app/immutable, so those can be
	// cached forever. HTML must revalidate or visitors keep an old shell — decide
	// from the FILE, not the URL: `/` serves index.html and has no extension.
	if (pathname.startsWith('/_app/immutable/')) return 'public, max-age=31536000, immutable';
	if (extname(file) === '.html') return 'no-cache';
	return 'public, max-age=3600';
}

async function find(pathname) {
	const safe = resolve(ROOT, '.' + normalize(pathname));
	if (safe !== ROOT && !safe.startsWith(ROOT + sep)) return null; // traversal attempt

	const candidates = [safe];
	if (pathname.endsWith('/')) candidates.push(join(safe, 'index.html'));
	else if (!extname(safe)) candidates.push(safe + '.html', join(safe, 'index.html'));

	for (const candidate of candidates) {
		try {
			const info = await stat(candidate);
			if (info.isFile()) return { file: candidate, info };
		} catch {
			// try the next candidate
		}
	}
	return null;
}

function gzipped(file, info) {
	const key = `${file}:${info.mtimeMs}:${info.size}`;
	const cached = gzipCache.get(key);
	if (cached) return cached;
	return null;
}

const server = createServer(async (req, res) => {
	if (req.method !== 'GET' && req.method !== 'HEAD') {
		res.writeHead(405, { allow: 'GET, HEAD', 'content-type': 'text/plain; charset=utf-8' });
		res.end('Method Not Allowed');
		return;
	}

	const { pathname } = new URL(req.url, 'http://localhost');

	if (pathname === '/healthz') {
		res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' });
		res.end('ok');
		return;
	}

	const direct = await find(pathname);
	const found = direct ?? (await find('/404.html'));
	if (!found) {
		res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
		res.end('Not Found');
		return;
	}

	const status = direct ? 200 : 404;
	const type = TYPES[extname(found.file)] ?? 'application/octet-stream';
	const etag = `W/"${found.info.size}-${Math.round(found.info.mtimeMs)}"`;

	const headers = {
		'content-type': type,
		'cache-control': status === 404 ? 'no-cache' : cacheControl(pathname, found.file),
		etag
	};

	if (req.headers['if-none-match'] === etag) {
		res.writeHead(304, headers);
		res.end();
		return;
	}

	if (
		req.method === 'GET' &&
		COMPRESSIBLE.test(type) &&
		found.info.size < GZIP_LIMIT &&
		/\bgzip\b/.test(String(req.headers['accept-encoding'] ?? ''))
	) {
		let body = gzipped(found.file, found.info);
		if (!body) {
			body = gzipSync(await readFile(found.file));
			gzipCache.set(`${found.file}:${found.info.mtimeMs}:${found.info.size}`, body);
		}
		headers['content-encoding'] = 'gzip';
		headers.vary = 'accept-encoding';
		headers['content-length'] = String(body.length);
		res.writeHead(status, headers);
		res.end(body);
		return;
	}

	headers['content-length'] = String(found.info.size);
	res.writeHead(status, headers);
	if (req.method === 'HEAD') {
		res.end();
		return;
	}
	createReadStream(found.file).pipe(res);
});

server.listen(PORT, HOST, () => {
	console.log(`serving ${ROOT} on http://${HOST}:${PORT}`);
});
