/// <reference types="vite/client" />
import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from '@tanstack/react-router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import * as React from 'react';
import type { QueryClient } from '@tanstack/react-query';
import { DefaultCatchBoundary } from '@/shared/components/common/default-catch-boundary';
import { NotFound } from '@/shared/components/common/not-found';
import appCss from '@/shared/styles/app.css?url';
import { getBaseMeta } from '@/shared/lib/seo';
import { AppLayout, Toaster } from '@/shared/components';
import { ThemeProvider } from '@/shared/providers/theme-provider';
import { m } from 'src/paraglide/messages';
import { getLocale } from 'src/paraglide/runtime';
import { localizeHref } from 'src/paraglide/runtime';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => {
    const baseMeta = getBaseMeta({
      title: m.seo_home_title(),
      description: m.seo_home_description(),
      keywords: m.seo_home_keywords(),
      // canonicalUrl: localizeHref('https://www.jasalab.com/'),
    });

    return {
      meta: [
        {
          charSet: 'utf-8',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          name: 'robots',
          content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
        },
        {
          name: 'googlebot',
          content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
        },
        {
          name: 'bingbot',
          content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
        },
        {
          name: 'format-detection',
          content: 'telephone=no, email=no, address=no',
        },
        {
          name: 'referrer',
          content: 'origin-when-cross-origin',
        },
        ...(baseMeta || []),
      ],
      links: [
        { rel: 'stylesheet', href: appCss },
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/favicon.svg',
        },
        // {
        //   rel: 'apple-touch-icon',
        //   sizes: '180x180',
        //   href: '/apple-touch-icon.png',
        // },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
      scripts: [
        {
          children: `(function () {
              try {
                const stored = localStorage.getItem('jasalab-app-settings');
                const settings = stored ? JSON.parse(stored) : {};
                const theme = settings?.state?.settings?.theme || 'system';
                const resolvedTheme =
                  theme === 'system'
                    ? window.matchMedia('(prefers-color-scheme: dark)').matches
                      ? 'dark'
                      : 'light'
                    : theme;

                document.documentElement.classList.remove('light', 'dark');
                document.documentElement.classList.add(resolvedTheme);
              } catch (e) {
                document.documentElement.classList.add('light');
              }
            })()`,
        },
      ],
    };
  },
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang={getLocale()} suppressHydrationWarning>
      <head>
        <HeadContent />
        {/* <GoogleAnalytics measurementId="G-W75CX7Z6KB" /> */}
      </head>
      <body>
        <ThemeProvider defaultTheme="light" storageKey="jasalab-ui-theme">
          <Toaster />
          <AppLayout>{children}</AppLayout>

          {/* <TanStackRouterDevtools position="bottom-left" />
          <ReactQueryDevtools buttonPosition="bottom-right" /> */}
        </ThemeProvider>

        <Scripts />
      </body>
    </html>
  );
}
