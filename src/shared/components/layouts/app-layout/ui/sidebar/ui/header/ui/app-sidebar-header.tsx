import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  Shortcut,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/shared/components';
import { cn } from '@/shared/utils';
import { Link } from '@tanstack/react-router';
import { ChevronsUpDownIcon, PlusIcon, UserRoundIcon, UsersRoundIcon } from 'lucide-react';

export function AppSidebarHeader() {
  const { isMobile, setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem className="flex items-center gap-2">
          <SidebarTrigger className="min-w-8 min-h-8" />
          <SidebarMenuButton asChild className="group-data-[collapsible=icon]:hidden">
            <Link to="/" onClick={handleLinkClick} className="scroll-m-20 text-xl font-medium tracking-tight">
              Danel
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        {/* <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 min-size items-center justify-center rounded-lg">
                  <UserRoundIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Личный</span>
                  <span className="truncate text-xs">Группа</span>
                </div>
                <ChevronsUpDownIcon className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              align="start"
              side={isMobile ? 'bottom' : 'right'}
              sideOffset={4}>
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                Группы
              </DropdownMenuLabel>
              <DropdownMenuItem
                className={cn(
                  'gap-2 p-2',
                  'bg-primary-foreground text-accent-foreground', // Выделить при selected
                )}>
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <UserRoundIcon className="size-3.5 shrink-0" />
                </div>
                Личный
                <DropdownMenuShortcut>
                  <Shortcut shortcut="cmd+1" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem
                className={cn(
                  'gap-2 p-2',
                  //   'bg-primary-foreground text-accent-foreground', // Выделить при selected
                )}>
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <UsersRoundIcon className="size-3.5 shrink-0" />
                </div>
                Моя семья
                <DropdownMenuShortcut>
                  <Shortcut shortcut="cmd+2" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <PlusIcon className="size-4" />
                </div>
                <div className="text-muted-foreground font-medium">Добавить группу</div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem> */}
      </SidebarMenu>
    </SidebarHeader>
  );
}
