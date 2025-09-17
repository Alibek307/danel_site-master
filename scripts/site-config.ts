/**
 * Site configuration for SEO file generation
 * Contains all routes, languages, and metadata
 */

import { LinkProps } from '@tanstack/react-router';
import { Locale, locales } from 'src/paraglide/runtime';

type SiteConfig = {
  baseUrl: string;
  languages: readonly Locale[];
  defaultLanguage: Locale;

  routes: Partial<
    Record<
      Exclude<LinkProps['to'], undefined | '.' | '..'>,
      {
        priority: number;
        changefreq: 'weekly' | 'monthly';
        lastmod: string;
      }
    >
  >;

  languagePriorityMultipliers: Record<Locale, number>;
  robots: {
    userAgent: string;
    allow: string;
    crawlDelay: number;
    sitemapUrl: string;
  };
};

const siteConfig: SiteConfig = {
  baseUrl: 'https://www.jasalab.com',
  languages: locales,
  defaultLanguage: 'ru',

  // Route configuration with priorities and change frequencies
  routes: {
    // Main pages
    '/': {
      priority: 1.0,
      changefreq: 'weekly',
      lastmod: '2025-08-09',
    },

    // QR Code section
    '/qr': {
      priority: 0.9,
      changefreq: 'monthly',
      lastmod: '2025-08-09',
    },
    '/qr/url': {
      priority: 0.8,
      changefreq: 'monthly',
      lastmod: '2025-08-09',
    },
    '/qr/text': {
      priority: 0.8,
      changefreq: 'monthly',
      lastmod: '2025-08-09',
    },
    '/qr/email': {
      priority: 0.8,
      changefreq: 'monthly',
      lastmod: '2025-08-09',
    },
    '/qr/phone': {
      priority: 0.8,
      changefreq: 'monthly',
      lastmod: '2025-08-09',
    },
    '/qr/vcard': {
      priority: 0.8,
      changefreq: 'monthly',
      lastmod: '2025-08-09',
    },
    '/qr/what-is-qr-code': {
      priority: 0.8,
      changefreq: 'monthly',
      lastmod: '2025-08-09',
    },
    '/qr/how-to-generate': {
      priority: 0.8,
      changefreq: 'monthly',
      lastmod: '2025-08-09',
    },

    // Generators section
    '/generators': {
      priority: 0.9,
      changefreq: 'monthly',
      lastmod: '2025-08-09',
    },
    '/generators/password': {
      priority: 0.8,
      changefreq: 'monthly',
      lastmod: '2025-08-09',
    },

    // Random section
    '/random': {
      priority: 0.9,
      changefreq: 'monthly',
      lastmod: '2025-08-10',
    },
    '/random/number': {
      priority: 0.8,
      changefreq: 'monthly',
      lastmod: '2025-08-10',
    },

    // Base64 section
    '/base64': {
      priority: 0.9,
      changefreq: 'monthly',
      lastmod: '2025-08-09',
    },
    '/base64/encode': {
      priority: 0.8,
      changefreq: 'monthly',
      lastmod: '2025-08-09',
    },
    '/base64/decode': {
      priority: 0.8,
      changefreq: 'monthly',
      lastmod: '2025-08-09',
    },
    '/base64/what-is-base64': {
      priority: 0.8,
      changefreq: 'monthly',
      lastmod: '2025-08-09',
    },
    '/base64/how-to-use': {
      priority: 0.8,
      changefreq: 'monthly',
      lastmod: '2025-08-09',
    },

    // UUID section
    '/uuid': {
      priority: 0.9,
      changefreq: 'monthly',
      lastmod: '2025-08-09',
    },
    '/uuid/v1': {
      priority: 0.8,
      changefreq: 'monthly',
      lastmod: '2025-08-09',
    },
    '/uuid/v3': {
      priority: 0.8,
      changefreq: 'monthly',
      lastmod: '2025-08-09',
    },
    '/uuid/v4': {
      priority: 0.8,
      changefreq: 'monthly',
      lastmod: '2025-08-09',
    },
    '/uuid/v5': {
      priority: 0.8,
      changefreq: 'monthly',
      lastmod: '2025-08-09',
    },
    '/uuid/v6': {
      priority: 0.8,
      changefreq: 'monthly',
      lastmod: '2025-08-09',
    },
    '/uuid/v7': {
      priority: 0.8,
      changefreq: 'monthly',
      lastmod: '2025-08-09',
    },
    '/uuid/nil': {
      priority: 0.8,
      changefreq: 'monthly',
      lastmod: '2025-08-09',
    },
    '/uuid/guid': {
      priority: 0.8,
      changefreq: 'monthly',
      lastmod: '2025-08-09',
    },
    '/uuid/what-is-uuid': {
      priority: 0.8,
      changefreq: 'monthly',
      lastmod: '2025-08-09',
    },
    '/uuid/how-to-use': {
      priority: 0.8,
      changefreq: 'monthly',
      lastmod: '2025-08-09',
    },
  },

  // Priority adjustments for different languages
  languagePriorityMultipliers: {
    ru: 1.0, // Russian gets full priority
    kk: 0.9, // Kazakh gets slightly lower priority
  },

  // Robots.txt settings
  robots: {
    userAgent: '*',
    allow: '/',
    crawlDelay: 1,
    sitemapUrl: 'https://www.jasalab.com/sitemap.xml',
  },
};

export default siteConfig;
