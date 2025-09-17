import { SidebarInset, SidebarProvider, SidebarTrigger, Toaster } from '@/shared/components';
import { PropsWithChildren } from 'react';
import { AppSidebar } from './sidebar';
import { MobileHeader } from '../../mobile-header';
import { DesktopHeader } from '../../desktop-header';
import { useIsMobile } from '@/shared/hooks';

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
        <SidebarInset className="p-0">
          <MobileHeader />
          <div className="pt-14">
            {children}
          </div>
        </SidebarInset>
        <Toaster />
      </SidebarProvider>
    );
  }

  return (
    <div className="min-h-screen">
      <DesktopHeader />
      <main className="pt-28 p-2">
        {children}
      </main>
      <Toaster />
    </div>
  );
}
