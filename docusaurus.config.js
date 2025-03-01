import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Releem Documentation',
  tagline: 'MySQL Performance Monitoring and Tuning',
  favicon: 'img/favicon.ico',
  url: 'https://releem.com',
  baseUrl: '/',
  organizationName: 'releem',
  projectName: 'docs',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/releem/docs/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      algolia: {
        appId: 'IDY76XQOJH',
        apiKey: '0347af0f25e74089e29e937fad894d8e',
        indexName: 'Releem Documentation',
        contextualSearch: true,
      },
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'Releem Docs',
        logo: {
          alt: 'Releem Logo',
          src: 'img/releem-icon-top.png',
        },
        items: [
          {
            type: 'dropdown',
            label: 'PRODUCT',
            position: 'left',
            items: [
              {
                label: 'MYSQL CONFIGURATION TUNING',
                href: 'https://releem.com/mysql-configuration-tuning',
              },
              {
                label: 'SQL QUERY ANALYTICS',
                href: 'https://releem.com/query-analytics',
              },
              {
                label: 'SQL QUERY OPTIMIZATION',
                href: 'https://releem.com/blog/introducing-automatic-sql-query-optimization',
              },
              {
                label: 'SCHEMA OPTIMIZATION',
                href: 'https://releem.com/mysql-schema-optimization',
              },
              {
                label: 'MYSQL MONITORING',
                href: 'https://releem.com/mysql-monitoring',
              },
              {
                label: 'HEALTH CHECKS FOR MYSQL',
                href: 'https://releem.com/health-checks',
              },
              {
                label: 'MYSQL MEMORY CALCULATOR',
                href: 'https://releem.com/mysql-memory-calculator',
              },
              {
                label: 'FAQ',
                href: 'https://releem.com/faq',
              },
            ],
          },
          {
            type: 'dropdown',
            label: 'SOLUTIONS',
            position: 'left',
            items: [
              {
                label: 'FOR DEVELOPERS',
                href: 'https://releem.com/for-developers',
              },
              {
                label: 'FOR HOSTING PROVIDERS',
                href: 'https://releem.com/for-hosting',
              },
              {
                label: 'FOR AWS RDS',
                href: 'https://releem.com/rds',
              },
            ],
          },
          {
            label: 'PRICING',
            href: 'https://releem.com/pricing',
            position: 'left',
          },
          {
            href: 'https://app.releem.com',
            label: 'Free Trial',
            position: 'right',
            className: 'navbar-free-trial-button',
            target: '_self',
          },
          {
            type: 'search',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Study',
            items: [
              {
                label: 'Read our blog',
                href: 'https://releem.com/blog',
              },
              {
                label: 'Study the documentation',
                to: '/',
              },
              {
                href: 'https://releem.com',
                label: 'Back to Releem',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Twitter',
                href: 'https://twitter.com/releemhq',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/releem',
              },
              {
                href: 'https://www.linkedin.com/company/releem', // Replace with your LinkedIn URL
                label: 'LinkedIn',
                position: 'right',
              },
              {
                label: 'Slack',
                href: 'https://join.slack.com/t/releem-community/shared_invite/zt-1j3d0vosh-AJHbDiQrzVDvLat5eqQorQ',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Releem, Inc.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),

  scripts: [
    {
      src: 'https://plausible.io/js/script.outbound-links.tagged-events.js',
      defer: true,
      'data-domain': 'docs.releem.com',
    },
  ],
  headTags: [
    {
      tagName: 'script',
      innerHTML: 'window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }',
      attributes: {},
    },
  ],
};

export default config;