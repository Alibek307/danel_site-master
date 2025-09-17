#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import siteConfig from './site-config';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate sitemap.xml from site configuration
 */
function generateSitemap() {
  const { baseUrl, languages, defaultLanguage, routes, languagePriorityMultipliers } = siteConfig;

  const sitemapEntries: any[] = [];

  // Generate entries for each route in each language
  Object.entries(routes).forEach(([route, config]) => {
    languages.forEach((lang) => {
      const isDefault = lang === defaultLanguage;
      const url = isDefault ? `${baseUrl}${route}` : `${baseUrl}/${lang}${route}`;

      // Calculate priority based on language multiplier
      const priority = (config.priority * (languagePriorityMultipliers[lang] || 1.0)).toFixed(1);

      // Generate hreflang links for all languages
      const hreflangLinks = languages
        .map((hrefLang) => {
          const hrefUrl =
            hrefLang === defaultLanguage ? `${baseUrl}${route}` : `${baseUrl}/${hrefLang}${route}`;
          return `    <xhtml:link rel="alternate" hreflang="${hrefLang}" href="${hrefUrl}" />`;
        })
        .join('\n');

      const entry = `  <url>
    <loc>${url}</loc>
    <lastmod>${config.lastmod}</lastmod>
    <changefreq>${config.changefreq}</changefreq>
    <priority>${priority}</priority>
${hreflangLinks}
  </url>`;

      sitemapEntries.push(entry);
    });
  });

  // Generate the complete sitemap XML
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  
${sitemapEntries.join('\n\n')}

</urlset>`;

  return sitemapXml;
}

/**
 * Write sitemap to public directory
 */
export function writeSitemap() {
  try {
    const sitemapContent = generateSitemap();
    const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml');

    fs.writeFileSync(outputPath, sitemapContent, 'utf8');

    console.log('✅ sitemap.xml generated successfully');
    console.log(`📍 Location: ${outputPath}`);

    // Count total URLs
    const urlCount = Object.keys(siteConfig.routes).length * siteConfig.languages.length;
    console.log(`📊 Generated ${urlCount} URLs for ${siteConfig.languages.length} languages`);
  } catch (error: any) {
    console.error('❌ Error generating sitemap:', error.message);
    process.exit(1);
  }
}
