const supportedDatabases = new Set(['mysql', 'mariadb', 'postgresql']);

const methodAnchors = new Map([
  ['mysql-automatic-installation', 'automatic-installation'],
  ['mysql-manual-installation', 'manual-installation'],
  ['mariadb-automatic-installation', 'automatic-installation'],
  ['mariadb-manual-installation', 'manual-installation'],
  ['postgresql-automatic-installation', 'automatic-installation'],
  ['postgresql-manual-installation', 'manual-installation'],
]);

const engineAnchors = new Set([
  'mysql-installation',
  'mariadb-installation',
  'postgresql-installation',
]);

export function resolveLegacyLinuxRedirect({search = '', hash = ''} = {}) {
  const params = new URLSearchParams(search);
  const database = params.get('database');
  params.delete('database');

  const databaseIsSupported = supportedDatabases.has(database);
  const base = databaseIsSupported
    ? `/installation/${database}/linux`
    : '/installation';
  const query = params.toString();
  const rawHash = hash.replace(/^#/u, '');
  const legacyAnchorDatabase = rawHash.match(/^(mysql|mariadb|postgresql)-/u)?.[1];
  let mappedHash = rawHash;

  if (legacyAnchorDatabase) {
    mappedHash = databaseIsSupported && legacyAnchorDatabase === database
      ? methodAnchors.get(rawHash) ?? (engineAnchors.has(rawHash) ? '' : rawHash)
      : '';
  }

  return `${base}${query ? `?${query}` : ''}${mappedHash ? `#${mappedHash}` : ''}`;
}
