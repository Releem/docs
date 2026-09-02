/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    {
      type: 'category',
      label: 'Get Started',
      link: {type: 'doc', id: 'releem-overview'},
      items: [
        'getting-started/step-1-register-for-an-account',
        {
          type: 'doc',
          id: 'getting-started/step-2-add-server',
          label: 'Connect Your Database Server',
        },
        {
          type: 'doc',
          id: 'getting-started/how-to-check-if-releem-agent-is-working',
          label: 'Troubleshoot the Releem Agent',
        },
      ],
    },
    {
      type: 'category',
      label: 'Supported Databases',
      link: {type: 'doc', id: 'releem-agent/mysql-permissions'},
      items: [
        'releem-agent/installation-guides/postgresql-manual-linux',
      ],
    },
    {
      type: 'category',
      label: 'Installation',
      link: {
        type: 'doc',
        id: 'releem-agent/installation-guides/self-managed-servers-automatic-installation',
      },
      items: [
        {
          type: 'category',
          label: 'Installation Methods',
          items: [
            'releem-agent/installation-guides/self-managed-servers-manual-installation-linux',
            'releem-agent/installation-guides/self-managed-servers-manual-installation-windows',
            'releem-agent/installation-guides/self-managed-servers-docker-installation',
            'releem-agent/installation-guides/installation-in-kubernetes',
            'releem-agent/installation-guides/cloud-managed-aws-rds-automatic-installation',
            'releem-agent/installation-guides/cloud-managed-gcp-cloud-sql-automatic-installation',
            'releem-agent/installation-guides/cloud-managed-azure-mysql-automatic-installation',
            'releem-agent/installation-guides/clusters',
            'releem-agent/installation-guides/whm-cpanel',
          ],
        },
        {
          type: 'category',
          label: 'Manage the Releem Agent',
          items: [
            'releem-agent/configuration',
            'releem-agent/how-to-check-logs',
            'releem-agent/migration',
            'releem-agent/update',
            'releem-agent/uninstallation',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Dashboard',
      link: {type: 'doc', id: 'getting-started/step-4-dashboard'},
      items: [
        'getting-started/query-analytics',
        {
          type: 'doc',
          id: 'getting-started/schema-optimization',
          label: 'Schema Checks',
        },
        'getting-started/deadlock-monitoring',
        'getting-started/step-5-health-checks',
        'getting-started/security-checks',
        'getting-started/process-list',
        {
          type: 'doc',
          id: 'getting-started/step-7-weekly-reports',
          label: 'Reports',
        },
      ],
    },
    {
      type: 'category',
      label: 'Recommendations',
      link: {
        type: 'doc',
        id: 'getting-started/step-3-getting-and-applying-recommendations',
      },
      items: [
        {
          type: 'category',
          label: 'Configuration Tuning',
          items: [
            'configuration-tuning/mysql-tuning-process',
            'configuration-tuning/initial-mysql-configuration',
            'configuration-tuning/how-to-apply-configuration-using-portal',
            'configuration-tuning/how-to-apply-configuration-using-agent',
            'configuration-tuning/how-to-apply-configuration-using-cron',
            'configuration-tuning/how-to-apply-configuration-manually/linux',
            'configuration-tuning/how-to-apply-configuration-manually/windows',
            'configuration-tuning/how-to-apply-configuration-manually/docker',
            'configuration-tuning/how-to-apply-configuration-manually/aws-rds',
            'configuration-tuning/how-to-apply-configuration-manually/gcp-cloud-sql',
            'configuration-tuning/how-to-rollback-to-previous-configuration',
            'configuration-tuning/limit-memory-for-mysql',
            'configuration-tuning/example-of-configuration',
          ],
        },
        {
          type: 'category',
          label: 'Query Optimization',
          link: {
            type: 'doc',
            id: 'getting-started/query-optimization',
          },
          items: [
            'query-optimization/enable-sql-query-optimization',
            'query-optimization/disable-sql-query-optimization',
            'query-optimization/prepared-statements-issue',
            'query-optimization/automatic-schema-changes',
            'query-optimization/schema-change-troubleshooting',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Account',
      link: {type: 'doc', id: 'server-settings/your-server-settings'},
      items: [
        {
          type: 'category',
          label: 'Access',
          items: ['server-settings/invite-users-and-assign-roles'],
        },
        {
          type: 'category',
          label: 'Billing',
          items: [
            'billing/update-payment-information',
            'billing/cancellation',
          ],
        },
      ],
    },
    {
      type: 'doc',
      id: 'frequently-asked-questions',
      label: 'FAQ',
    },
  ],
};

export default sidebars;
