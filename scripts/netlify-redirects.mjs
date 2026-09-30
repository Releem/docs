import {writeFile} from 'node:fs/promises';
import path from 'node:path';
import {redirects} from '../redirects.mjs';

const normalizePath = (pathname) => pathname.replace(/\/$/u, '') || '/';

/** @returns {import('@docusaurus/types').Plugin} */
export default function netlifyRedirectsPlugin() {
  return {
    name: 'releem-netlify-redirects',
    async postBuild({outDir, routesPaths}) {
      const sources = redirects.map(({from}) => normalizePath(from));
      const sourcePaths = new Set(sources);
      const canonicalPaths = new Set(routesPaths.map(normalizePath));

      if (sourcePaths.size !== sources.length) {
        throw new Error('Netlify redirects contain duplicate source paths.');
      }

      const rules = redirects.map(({from, to}) => {
        if (!from.startsWith('/') || !to.startsWith('/') ||
            from.startsWith('//') || to.startsWith('//') ||
            /[\s?#*]/u.test(from) || /[\s*]/u.test(to)) {
          throw new Error(`Netlify redirects require exact local paths: ${from}`);
        }

        const destination = normalizePath(new URL(to, 'https://docs.releem.com').pathname);
        if (canonicalPaths.has(normalizePath(from))) {
          throw new Error(`Netlify redirect would override a current route: ${from}`);
        }
        if (sourcePaths.has(destination)) {
          throw new Error(`Netlify redirect would create a chain or loop: ${from}`);
        }
        if (!canonicalPaths.has(destination)) {
          throw new Error(`Netlify redirect target is not a current route: ${to}`);
        }

        // Force the HTTP redirect over Docusaurus's generated fallback page.
        return `${from}  ${to}  301!`;
      });

      await writeFile(path.join(outDir, '_redirects'), [
        '# Generated from redirects.mjs by the Releem Netlify redirects plugin.',
        '# Edit redirects.mjs, then rebuild. Do not edit this generated file.',
        '# /installation/linux retains its query-and-anchor compatibility page.',
        '# The legacy PostgreSQL installation URL retains its fragment-aware compatibility page.',
        ...rules,
        '',
      ].join('\n'), 'utf8');
    },
  };
}
