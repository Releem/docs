export const configurationTuningRoute =
  '/recommendations/configuration-tuning';

export const expectedConfigurationTuningSidebar = {
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
      href: `${configurationTuningRoute}/mysql-tuning-process`,
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
};

export const expectedConfigurationTuningVisibleLabels = [
  ['recommendations/configuration-tuning/mysql-tuning-process', 'Configuration Tuning'],
  ['recommendations/configuration-tuning/mysql-tuning-process', 'Overview'],
  ['recommendations/configuration-tuning/initial-mysql-configuration', 'Initial configuration'],
  ['recommendations/configuration-tuning/apply-configuration', 'Apply configuration'],
  ['recommendations/configuration-tuning/apply-using-portal', 'Using the Portal'],
  ['recommendations/configuration-tuning/apply-using-agent', 'Using the Agent'],
  ['recommendations/configuration-tuning/apply-manually/index', 'Manually'],
  ['recommendations/configuration-tuning/apply-manually/mysql', 'MySQL'],
  ['recommendations/configuration-tuning/apply-manually/mariadb', 'MariaDB'],
  ['recommendations/configuration-tuning/apply-manually/postgresql', 'PostgreSQL'],
  ['recommendations/configuration-tuning/apply-using-cron', 'On a Schedule'],
  ['recommendations/configuration-tuning/rollback', 'Rollback'],
  ['recommendations/configuration-tuning/limit-mysql-memory', 'Memory limit'],
  ['recommendations/configuration-tuning/configuration-example', 'Configuration example'],
];
