import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components';
import { Monitor, Moon, Sun, Languages } from 'lucide-react';
import { useTheme } from '@/shared/providers/theme-provider';
import { useIsMobile } from '@/shared/hooks';
import { getLocale, locales, setLocale } from 'src/paraglide/runtime';
import { m } from 'src/paraglide/messages';

// Theme configuration
const themeConfig = {
  light: { icon: Sun, label: () => m.ui_theme_light() },
  dark: { icon: Moon, label: () => m.ui_theme_dark() },
  system: { icon: Monitor, label: () => m.ui_theme_system() },
} as const;

// Language labels (native names)
const languageLabels = {
  kk: 'Казакша',
  ru: 'Русский',
} as const;

export function AppSidebarFooter() {
  const { theme, setTheme } = useTheme();
  const currentLocale = getLocale();
  const isMobile = useIsMobile();

  // Get theme configuration
  const currentThemeConfig = themeConfig[theme] || themeConfig.system;
  const ThemeIcon = currentThemeConfig.icon;
  const themeLabel = currentThemeConfig.label();

  // Get language label (native name)
  const getLanguageLabel = (locale: string) => {
    return languageLabels[locale as keyof typeof languageLabels] || locale.toUpperCase();
  };

  const handleLanguageChange = (locale: string) => {
    setLocale(locale as any);
  };

  return (
    <SidebarFooter>
      <SidebarMenu>
        {/* Language Switcher */}
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton tooltip={getLanguageLabel(currentLocale)}>
                <Languages />
                <span>{getLanguageLabel(currentLocale)}</span>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side={isMobile ? 'bottom' : 'right'} sideOffset={4}>
              {locales.map((locale) => (
                <DropdownMenuItem
                  key={locale}
                  onClick={() => handleLanguageChange(locale)}
                  className={currentLocale === locale ? 'bg-accent' : ''}>
                  <span className="flex items-center justify-center text-xs font-medium">
                    {locale.toUpperCase()}
                  </span>
                  {getLanguageLabel(locale)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>

        {/* Theme Switcher */}
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton tooltip={themeLabel}>
                <ThemeIcon />
                <span>{themeLabel}</span>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side={isMobile ? 'bottom' : 'right'} sideOffset={4}>
              {Object.entries(themeConfig).map(([themeKey, config]) => {
                const Icon = config.icon;
                const label = config.label();
                return (
                  <DropdownMenuItem
                    key={themeKey}
                    onClick={() => setTheme(themeKey as any)}
                    className={theme === themeKey ? 'bg-accent' : ''}>
                    <Icon />
                    {label}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
