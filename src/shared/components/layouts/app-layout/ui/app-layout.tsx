import { SidebarInset, SidebarProvider, SidebarTrigger, Toaster } from '@/shared/components';
import { PropsWithChildren } from 'react';
import { AppSidebar } from './sidebar';
import { MobileHeader } from '../../mobile-header';
import { DesktopHeader } from '../../desktop-header';
import { Footer } from '../../footer';
import { useIsMobile } from '@/shared/hooks';
import { PageWrapper } from '../../page-wrapper';

export function AppLayout({ children }: PropsWithChildren) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <SidebarProvider
        style={
          {
            '--sidebar-width': 'calc(var(--spacing) * 55)',
            '--header-height': 'calc(var(--spacing) * 12)',
          } as React.CSSProperties
        }>
        <AppSidebar />
        <SidebarInset className="p-0 flex flex-col min-h-screen">
          <MobileHeader />
          <div className="pt-14 flex-1">
            <PageWrapper>
              {children}
            </PageWrapper>
          </div>
          <Footer />
        </SidebarInset>
        <Toaster />
      </SidebarProvider>
      
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <DesktopHeader />
      <main className="flex-1">
        <PageWrapper>
          {children}
        </PageWrapper>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

