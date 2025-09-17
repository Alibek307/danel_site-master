import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/shared/components';
import { AppSidebarHeader } from './header';
import { AppSidebarFooter } from './footer';
import { ChefHat, Salad, Flame, Cookie, Cake } from 'lucide-react';

// Categories for mobile navigation
const categories = [
  { id: 'pies', name: 'Пироги', href: '#pies', icon: ChefHat },
  { id: 'salads', name: 'Салаты', href: '#salads', icon: Salad },
  { id: 'hot', name: 'Горячее', href: '#hot', icon: Flame },
  { id: 'snacks', name: 'Закуски', href: '#snacks', icon: Cookie },
  { id: 'cakes', name: 'Торты', href: '#cakes', icon: Cake },
];

export function AppSidebar() {
  const { isMobile, setOpenMobile } = useSidebar();

  const handleLinkClick = (href: string) => {
    if (isMobile) {
      setOpenMobile(false);
    }
    
    // Smooth scroll to section
    const element = document.getElementById(href.substring(1));
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Sidebar collapsible="icon" variant="inset">
      <AppSidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <SidebarMenuItem key={category.id}>
                    <SidebarMenuButton asChild tooltip={category.name}>
                      <a 
                        href={category.href}
                        onClick={(e) => {
                          e.preventDefault();
                          handleLinkClick(category.href);
                        }}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{category.name}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <AppSidebarFooter />
    </Sidebar>
  );
}
