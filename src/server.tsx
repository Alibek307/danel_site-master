import 'urlpattern-polyfill';

import {
  createStartHandler,
  defaultStreamHandler,
  getWebRequest,
} from '@tanstack/react-start/server';

import { createRouter } from './router';
import { paraglideMiddleware } from './paraglide/server.js';
import { overwriteGetLocale } from './paraglide/runtime.js';

export default createStartHandler({
  createRouter: () => createRouter(getWebRequest().url),
})((event) =>
  paraglideMiddleware(getWebRequest(), ({ locale }) => {
    overwriteGetLocale(() => locale);
    return defaultStreamHandler(event);
  }),
);
