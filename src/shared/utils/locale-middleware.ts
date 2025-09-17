import { AsyncLocalStorage } from 'node:async_hooks';
import { createMiddleware } from '@tanstack/react-start';
import { resolveLocale } from './resolve-locale';
import { baseLocale, Locale, overwriteGetLocale } from 'src/paraglide/runtime';

export const localeMiddleware = createMiddleware({ type: 'function' })
  .client(async (context) =>
    context.next({
      sendContext: {
        locale: await resolveLocale(),
      },
    }),
  )
  .server((context) => {
    const storage = new AsyncLocalStorage<Locale>();
    overwriteGetLocale(() => storage.getStore() ?? baseLocale);

    return storage.run(context.context.locale, context.next);
  });
