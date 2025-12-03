/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    {
      type: 'doc',
      id: 'welcome',
      label: 'Welcome',
    },
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/step-1-register-for-an-account',
        'getting-started/step-2-add-server',
        'getting-started/step-4-dashboard',
        'getting-started/step-3-getting-and-applying-recommendations',
        'getting-started/query-analytics',
        'getting-started/query-optimization',
        'getting-started/schema-optimization',
        'getting-started/deadlock-monitoring',
        'getting-started/step-5-health-checks',
        'getting-started/security-checks',
        'getting-started/process-list',
        'getting-started/step-7-weekly-reports',
        'getting-started/how-to-check-if-releem-agent-is-working',
      ],
    },
    {
      type: 'category',
      label: 'Releem Agent',
      items: [
        {
          type: 'category',
          label: 'Installation',
          items: [
            'releem-agent/installation-guides/self-managed-servers-automatic-installation',
            'releem-agent/installation-guides/self-managed-servers-manual-installation-linux',
            'releem-agent/installation-guides/self-managed-servers-manual-installation-windows',
            'releem-agent/installation-guides/self-managed-servers-docker-installation',
            'releem-agent/installation-guides/installation-in-kubernetes',
            'releem-agent/installation-guides/cloud-managed-aws-rds-automatic-installation',
            'releem-agent/installation-guides/cloud-managed-gcp-cloud-sql-automatic-installation',
            'releem-agent/installation-guides/clusters',
          ],
        },
        'releem-agent/configuration',
        'releem-agent/mysql-permissions',
        'releem-agent/migration',
        'releem-agent/update',
        'releem-agent/uninstallation',
        'releem-agent/how-to-check-logs',
      ],
    },
    {
      type: 'category',
      label: 'Configuration Tuning',
      items: [
        'configuration-tuning/mysql-tuning-process',
        'configuration-tuning/initial-mysql-configuration',
        'configuration-tuning/how-to-apply-configuration-using-portal',
        'configuration-tuning/how-to-apply-configuration-using-agent',
        'configuration-tuning/how-to-apply-configuration-using-cron',
        {
          type: 'category',
          label: 'How to Apply Configuration Manually',
          items: [
            'configuration-tuning/how-to-apply-configuration-manually/linux',
            'configuration-tuning/how-to-apply-configuration-manually/windows',
            'configuration-tuning/how-to-apply-configuration-manually/docker',
            'configuration-tuning/how-to-apply-configuration-manually/aws-rds',
            'configuration-tuning/how-to-apply-configuration-manually/gcp-cloud-sql',
          ],
        },
        'configuration-tuning/how-to-rollback-to-previous-configuration',
        'configuration-tuning/limit-memory-for-mysql',
        'configuration-tuning/example-of-configuration',
      ],
    },
    {
      type: 'category',
      label: 'SQL Query Optimization',
      items: [
        'query-optimization/enable-sql-query-optimization',
        'query-optimization/disable-sql-query-optimization',
        'query-optimization/prepared-statements-issue',
      ],
    },
    {
      type: 'category',
      label: 'Billing',
      items: [
        'billing/update-payment-information',
        'billing/cancellation',
      ],
    },
    {
      type: 'doc',
      id: 'frequently-asked-questions',
      label: 'Frequently Asked Questions',
    },
  ],
};

export default sidebars;