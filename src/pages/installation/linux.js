import React, {useEffect} from 'react';
import Layout from '@theme/Layout';
import {resolveLegacyLinuxRedirect} from '../../components/legacyLinuxRedirect.mjs';

export default function LegacyLinuxInstallationRoute() {
  useEffect(() => {
    const destination = resolveLegacyLinuxRedirect({
      search: window.location.search,
      hash: window.location.hash,
    });
    window.location.replace(destination);
  }, []);

  return (
    <Layout title="Installation" description="Choose a Releem installation guide.">
      <main className="container margin-vert--lg">
        <h1>Choose an installation guide</h1>
        <p>
          This compatibility page will take you to the installation guide for
          your database. If it does not continue, open <a href="/installation">Install Releem</a>.
        </p>
      </main>
    </Layout>
  );
}

