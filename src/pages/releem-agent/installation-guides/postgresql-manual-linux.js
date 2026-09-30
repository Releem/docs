import React, {useEffect} from 'react';
import Layout from '@theme/Layout';
import {resolveLegacyPostgresqlRedirect} from '../../../components/legacyPostgresqlRedirect.mjs';

export default function LegacyPostgresqlInstallationRoute() {
  useEffect(() => {
    window.location.replace(resolveLegacyPostgresqlRedirect({
      search: window.location.search,
      hash: window.location.hash,
    }));
  }, []);

  return (
    <Layout title="PostgreSQL installation">
      <main className="container margin-vert--lg">
        <h1>PostgreSQL installation</h1>
        <p>
          Opening the installation guide for your environment. If it does not
          continue, choose <a href="/installation/postgresql">PostgreSQL installation options</a>.
        </p>
      </main>
    </Layout>
  );
}
