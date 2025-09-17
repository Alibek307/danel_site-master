import type { AnyRouteMatch } from '@tanstack/react-router';

/**
 * Base meta parameters for all pages
 */
export interface BaseMetaParams {
  title: string;
  description: string;
  keywords: string;
  image?: string;
  canonicalUrl?: string;
}

/**
 * Base meta tags result
 */
export type MetaTags = AnyRouteMatch['meta'];

/**
 * Script tags result
 */
export type ScriptTags = AnyRouteMatch['scripts'];

/**
 * Combined SEO result interface
 */
export interface SEOResult {
  meta: MetaTags;
  scripts: ScriptTags;
}
