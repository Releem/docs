const linux = '/installation/postgresql/linux';
const docker = '/installation/postgresql/docker';
const aws = '/installation/postgresql/aws-rds';

// The published legacy page combined Linux, Docker, and RDS/Aurora in tabs.
// Fragments never reach Netlify, so this route must remain a client bridge.
const destinations = new Map([
  ['automatic-installation-for-self-managed-postgresql-servers', `${linux}#automatic-installation`],
  ['manual-installation-for-self-managed-postgresql-servers', `${linux}#manual-installation`],
  ['automatic-installation', `${linux}#automatic-installation`],
  ['manual-installation', `${linux}#manual-installation`],
  ['installation-steps', `${linux}#manual-installation`],
  ['installation-steps-1', `${linux}#automatic-installation`],
  ['installation-steps-2', `${linux}#manual-installation`],
  ['prerequisites', `${linux}#prerequisites`],
  ['prerequisites-1', `${linux}#prerequisites`],
  ['installation-in-a-docker-container-on-self-managed-postgresql-servers', docker],
  ['cloud-managed-aws-rds-and-aurora-postgresql-installation', aws],
  ['parameter-groups', `${aws}#prepare-the-db-parameter-group`],
  ['common-issues-for-aws-rds-and-aurora-postgresql', `${aws}#troubleshooting`],
  ['notes', `${linux}#installer-parameters`],
]);

export function resolveLegacyPostgresqlRedirect({search = '', hash = ''} = {}) {
  const anchor = hash.replace(/^#/u, '');
  const destination = destinations.get(anchor) ??
    (anchor ? `${linux}#${anchor}` : `${linux}#manual-installation`);
  const url = new URL(destination, 'https://docs.releem.com');
  url.search = new URLSearchParams(search).toString();
  return `${url.pathname}${url.search}${url.hash}`;
}
