import type { MetaTags, ScriptTags, SEOResult } from './types';

/**
 * Combine meta tags and scripts into a single SEO result
 *
 * @param meta - Meta tags array
 * @param scripts - Script tags array
 * @returns Combined SEO result
 */
export const combineSEO = (meta: MetaTags, scripts: ScriptTags = []): SEOResult => {
  return {
    meta,
    scripts,
  };
};

/**
 * Combine multiple meta tag arrays
 *
 * @param metaArrays - Arrays of meta tags to combine
 * @returns Combined meta tags array
 */
export const combineMeta = (...metaArrays: MetaTags[]): MetaTags => {
  return metaArrays.flat();
};

/**
 * Combine multiple script tag arrays
 *
 * @param scriptArrays - Arrays of script tags to combine
 * @returns Combined script tags array
 */
export const combineScripts = (...scriptArrays: ScriptTags[]): ScriptTags => {
  return scriptArrays.flat();
};
