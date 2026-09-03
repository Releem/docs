/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    {
      type: 'category',
      label: 'Get Started',
      link: {type: 'doc', id: 'get-started/releem-overview'},
      items: [
        'get-started/register-for-an-account',
        {
          type: 'doc',
          id: 'get-started/connect-your-database-server',
          label: 'Connect Your Database Server',
        },
        {
          type: 'doc',
          id: 'get-started/troubleshoot-releem-agent',
          label: 'Troubleshoot the Releem Agent',
        },
      ],
    },
    {
      type: 'category',
      label: 'Supported Databases',
      link: {type: 'doc', id: 'supported-databases/mysql/required-permissions'},
      items: [
        {
          type: 'doc',
          id: 'supported-databases/mariadb/required-permissions',
          label: 'MariaDB Permissions',
        },
        {
          type: 'doc',
          id: 'supported-databases/postgresql/required-permissions',
          label: 'PostgreSQL Permissions',
        },
      ],
    },
    {
      type: 'category',
      label: 'Installation',
      items: [
        {
          type: 'doc',
          id: 'installation/linux',
          label: 'Linux',
        },
        'installation/installation-methods/windows',
        'installation/installation-methods/docker',
        'installation/installation-methods/kubernetes',
        {
          type: 'category',
          label: 'Managed databases',
          items: [
            'installation/installation-methods/aws-rds',
            'installation/installation-methods/gcp-cloud-sql',
            'installation/installation-methods/azure-database-for-mysql',
          ],
        },
        'installation/installation-methods/clusters',
        'installation/installation-methods/whm-cpanel',
        {
          type: 'category',
          label: 'Manage the Releem Agent',
          items: [
            'installation/manage-the-releem-agent/configuration',
            'installation/manage-the-releem-agent/logs',
            'installation/manage-the-releem-agent/migrate',
            'installation/manage-the-releem-agent/update',
            'installation/manage-the-releem-agent/uninstall',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Dashboard',
      link: {type: 'doc', id: 'dashboard/overview'},
      items: [
        'dashboard/query-analytics',
        {
          type: 'doc',
          id: 'dashboard/schema-checks',
          label: 'Schema Checks',
        },
        'dashboard/deadlocks',
        'dashboard/health-checks',
        'dashboard/security-checks',
        'dashboard/process-list',
        {
          type: 'doc',
          id: 'dashboard/reports',
          label: 'Reports',
        },
      ],
    },
    {
      type: 'category',
      label: 'Recommendations',
      link: {
        type: 'doc',
        id: 'recommendations/overview',
      },
      items: [
        {
          type: 'category',
          label: 'Configuration Tuning',
          items: [
            'recommendations/configuration-tuning/mysql-tuning-process',
            'recommendations/configuration-tuning/initial-mysql-configuration',
            'recommendations/configuration-tuning/apply-using-portal',
            'recommendations/configuration-tuning/apply-using-agent',
            'recommendations/configuration-tuning/apply-using-cron',
            'recommendations/configuration-tuning/apply-manually/linux',
            'recommendations/configuration-tuning/apply-manually/windows',
            'recommendations/configuration-tuning/apply-manually/docker',
            'recommendations/configuration-tuning/apply-manually/aws-rds',
            'recommendations/configuration-tuning/apply-manually/gcp-cloud-sql',
            'recommendations/configuration-tuning/rollback',
            'recommendations/configuration-tuning/limit-mysql-memory',
            'recommendations/configuration-tuning/configuration-example',
          ],
        },
        {
          type: 'category',
          label: 'Query Optimization',
          link: {
            type: 'doc',
            id: 'recommendations/query-optimization/overview',
          },
          items: [
            'recommendations/query-optimization/enable',
            'recommendations/query-optimization/disable',
            'recommendations/query-optimization/prepared-statements',
            'recommendations/query-optimization/automatic-schema-changes',
            'recommendations/query-optimization/schema-change-troubleshooting',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Account',
      link: {type: 'doc', id: 'account/overview'},
      items: [
        {
          type: 'category',
          label: 'Access',
          items: ['account/access/users-and-roles'],
        },
        {
          type: 'category',
          label: 'Billing',
          items: [
            'account/billing/payment-information',
            'account/billing/cancel-subscription',
          ],
        },
      ],
    },
    {
      type: 'doc',
      id: 'faq',
      label: 'FAQ',
    },
  ],
};

export default sidebars;
