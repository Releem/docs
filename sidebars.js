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
      link: {type: 'doc', id: 'supported-databases/index'},
      items: [
        {
          type: 'doc',
          id: 'supported-databases/mysql/required-permissions',
          label: 'MySQL Permissions',
        },
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
      link: {type: 'doc', id: 'installation/index'},
      items: [
        {
          type: 'category',
          label: 'MySQL',
          link: {type: 'doc', id: 'installation/mysql/index'},
          items: [
            'installation/mysql/linux',
            'installation/mysql/windows',
            'installation/mysql/docker',
            'installation/mysql/aws-rds',
            'installation/mysql/gcp-cloud-sql',
            'installation/mysql/azure-database-for-mysql',
            'installation/mysql/clusters',
            'installation/mysql/whm-cpanel',
          ],
        },
        {
          type: 'category',
          label: 'MariaDB',
          link: {type: 'doc', id: 'installation/mariadb/index'},
          items: [
            'installation/mariadb/linux',
            'installation/mariadb/windows',
            'installation/mariadb/docker',
            'installation/mariadb/kubernetes',
            'installation/mariadb/clusters',
          ],
        },
        {
          type: 'category',
          label: 'PostgreSQL',
          link: {type: 'doc', id: 'installation/postgresql/index'},
          items: [
            'installation/postgresql/linux',
          ],
        },
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
          link: {
            type: 'doc',
            id: 'recommendations/configuration-tuning/mysql-tuning-process',
          },
          items: [
            {
              type: 'link',
              label: 'Overview',
              href: '/recommendations/configuration-tuning/mysql-tuning-process',
            },
            {
              type: 'doc',
              id: 'recommendations/configuration-tuning/initial-mysql-configuration',
              label: 'Initial configuration',
            },
            {
              type: 'category',
              label: 'Apply configuration',
              link: {
                type: 'doc',
                id: 'recommendations/configuration-tuning/apply-configuration',
              },
              items: [
                {
                  type: 'doc',
                  id: 'recommendations/configuration-tuning/apply-using-portal',
                  label: 'Using the Portal',
                },
                {
                  type: 'doc',
                  id: 'recommendations/configuration-tuning/apply-using-agent',
                  label: 'Using the Agent',
                },
                {
                  type: 'category',
                  label: 'Manually',
                  link: {
                    type: 'doc',
                    id: 'recommendations/configuration-tuning/apply-manually/index',
                  },
                  items: [
                    {
                      type: 'doc',
                      id: 'recommendations/configuration-tuning/apply-manually/mysql',
                      label: 'MySQL',
                    },
                    {
                      type: 'doc',
                      id: 'recommendations/configuration-tuning/apply-manually/mariadb',
                      label: 'MariaDB',
                    },
                    {
                      type: 'doc',
                      id: 'recommendations/configuration-tuning/apply-manually/postgresql',
                      label: 'PostgreSQL',
                    },
                  ],
                },
                {
                  type: 'doc',
                  id: 'recommendations/configuration-tuning/apply-using-cron',
                  label: 'On a Schedule',
                },
              ],
            },
            {
              type: 'doc',
              id: 'recommendations/configuration-tuning/rollback',
              label: 'Rollback',
            },
            {
              type: 'doc',
              id: 'recommendations/configuration-tuning/limit-mysql-memory',
              label: 'Memory limit',
            },
            {
              type: 'doc',
              id: 'recommendations/configuration-tuning/configuration-example',
              label: 'Configuration example',
            },
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
