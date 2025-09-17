import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import { paraglideVitePlugin as paraglide } from '@inlang/paraglide-js';

export default defineConfig({
  server: {
    port: 3000,
  },
  ssr: {
    noExternal: ['urlpattern-polyfill', '@fontsource/rubik'],
  },
  plugins: [
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    paraglide({
      project: './project.inlang',
      outdir: './src/paraglide',
      outputStructure: 'message-modules',
      cookieName: 'PARAGLIDE_LOCALE',
      strategy: ['cookie', 'url', 'preferredLanguage', 'baseLocale'],
      urlPatterns: [
        {
          pattern: '/:path(.*)?',
          localized: [
            ['kk', '/kk/:path(.*)?'],
            ['ru', '/:path(.*)?'],
          ],
        },
      ],
    }),
    tanstackStart({
      target: 'vercel',
      customViteReactPlugin: true,
    }),
  ],
});
