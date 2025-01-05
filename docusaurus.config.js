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
            href: 'https://releem.com',
            label: 'Back to Releem',
            position: 'right',
          },
          {
            href: 'https://github.com/releem/releem-docs',
            label: 'GitHub',
            position: 'right',
          },
          {
            href: 'https://www.linkedin.com/company/releem', // Replace with your LinkedIn URL
            label: 'LinkedIn',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Welcome',
                to: '/',
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
};

export default config;