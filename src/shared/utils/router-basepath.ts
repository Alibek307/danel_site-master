import { isLocale, Locale, strategy } from 'src/paraglide/runtime';

export function extractLocale(url: string): Locale | undefined {
  const urlObj = new URL(url, 'https://www.jasalab.com');
  const pathSegments = urlObj.pathname.split('/').filter(Boolean);
  if (pathSegments.length > 0) {
    const potentialLocale = pathSegments[0];
    if (isLocale(potentialLocale)) {
      return potentialLocale;
    }
  }
}

export function getRouterBasepath(pathname?: string): string | undefined {
  const extractedLocale = extractLocale(pathname ?? '/');
  return strategy.includes('url') && extractedLocale ? `/${extractedLocale}` : undefined;
}
