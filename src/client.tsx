import { hydrateRoot } from 'react-dom/client';
import { StartClient } from '@tanstack/react-start';
import { createRouter } from './router';
import { getLocale, overwriteGetLocale, strategy } from './paraglide/runtime.js';

// import '@fontsource/rubik/300.css';
import '@fontsource/rubik/400.css';
import '@fontsource/rubik/500.css';
import '@fontsource/rubik/600.css';
import '@fontsource/rubik/700.css';
import '@fontsource/rubik/800.css';
import '@fontsource/rubik/900.css';

const router = createRouter(window.location.pathname);

/**
 * BEGINING
 * This is to make sure locale is not pulled from a cookie to prevent weird behaviour when the language was changed manually in the cookie or in another tab. If you don't rely on cookies for locale, you can remove this line.
 */
if (strategy.includes('cookie')) {
  const inMemoryLocale = getLocale();
  overwriteGetLocale(() => inMemoryLocale);
}
/**
 * END
 */

hydrateRoot(document, <StartClient router={router} />);
