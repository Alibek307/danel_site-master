import type { Thing, WithContext } from 'schema-dts';
import type { ScriptTags } from './types';

/**
 * Creates a JSON-LD script tag with proper context
 *
 * @param schema - Schema.org object without @context
 * @returns Array of script tags with JSON-LD
 */
export function getJsonLd<T extends Thing>(schema: T): Exclude<ScriptTags, undefined> {
  const structuredData: WithContext<T> = {
    '@context': 'https://schema.org',
    ...(schema as any),
  };

  return [
    {
      type: 'application/ld+json',
      children: JSON.stringify(structuredData, null, 0),
    },
  ];
}
