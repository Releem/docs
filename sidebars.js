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
        'getting-started/step-3-getting-and-applying-recommendations',
        'getting-started/step-4-dashboard',
        'getting-started/step-5-health-checks',
        'getting-started/step-6-query-analytics-optimization',
        'getting-started/step-7-weekly-reports',
        'getting-started/how-to-check-if-releem-agent-is-working',
      ],
    },
    {
      type: 'category',
      label: 'Configuration Tuning',
      items: [
        'configuration-tuning/mysql-tuning-process',
        'configuration-tuning/how-to-apply-configuration-using-portal',
        'configuration-tuning/how-to-apply-configuration-using-agent',
        'configuration-tuning/how-to-rollback-to-previous-configuration',
        'configuration-tuning/example-of-configuration',
      ],
    },
    {
      type: 'category',
      label: 'Releem Agent',
      items: [
        'releem-agent/self-managed-servers-automatic-installation',
        'releem-agent/self-managed-servers-manual-installation-linux',
        'releem-agent/self-managed-servers-manual-installation-windows',
        'releem-agent/self-managed-servers-docker-installation',
        'releem-agent/installation-in-kubernetes',
        'releem-agent/enable-sql-query-optimization',
        'releem-agent/cloud-managed-aws-rds-automatic-installation',
        'releem-agent/mysql-permissions',
        'releem-agent/limit-memory-for-mysql',
        'releem-agent/update-linux',
        'releem-agent/update-windows',
        'releem-agent/update-for-docker',
        'releem-agent/update-for-aws',
        'releem-agent/uninstallation',
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