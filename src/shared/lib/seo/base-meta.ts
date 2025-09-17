import { getLocale } from 'src/paraglide/runtime';
import type { BaseMetaParams, MetaTags } from './types';

/**
 * Generate base meta tags for all pages
 *
 * @param params - Base meta parameters
 * @returns Array of meta tags
 */
export const getBaseMeta = ({
  title,
  description,
  keywords,
  image,
  canonicalUrl,
}: BaseMetaParams): MetaTags => {
  const metaTags: MetaTags = [
    { title },
    { name: 'description', content: description },
    { name: 'keywords', content: keywords },
    { name: 'author', content: 'Danel' },
    { name: 'publisher', content: 'Danel' },
    { name: 'application-name', content: 'Danel' },
    // { name: 'theme-color', content: '#ffffff' },

    // Open Graph meta tags
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:site_name', content: 'Danel' },
    { property: 'og:locale', content: getLocale() },
  ];

  // Add canonical URL if provided
  if (canonicalUrl) {
    metaTags.push({ name: 'canonical', content: canonicalUrl });
  }

  // Add image meta tags if provided
  if (image) {
    metaTags.push(
      { property: 'og:image', content: image },
      { property: 'og:image:type', content: 'image/png' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: title },
    );
  }

  return metaTags;
};
