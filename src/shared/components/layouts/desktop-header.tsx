import { Link, useLocation } from '@tanstack/react-router';
import { Monitor, Moon, Sun, Languages } from 'lucide-react';
import { useTheme } from '@/shared/providers/theme-provider';
import { getLocale, locales, setLocale } from 'src/paraglide/runtime';
import { m } from 'src/paraglide/messages';
import { ProfileMenu } from '../auth/profile-menu';
import { useCategories } from '@/shared/hooks/useProduct';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Button,
  CartSheet,
} from '@/shared/components';

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

export function DesktopHeader() {
  const { theme, setTheme } = useTheme();
  const currentLocale = getLocale();
  const location = useLocation();

  // Загружаем категорию из API
  const { data: categories = [], isLoading } = useCategories();

  // Проверяем, находимся ли мы на главной странице
  const isHomePage = location.pathname === '/' || location.pathname === '//kk';

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
    <>
      {/* Main header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto flex items-center justify-between py-3">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-xl font-medium tracking-tight hover:text-primary transition-colors"
            >
              Danel
            </Link>
          </div>

          {/* Right side - Controls */}
          <div className="flex items-center gap-2">

            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Languages className="w-4 h-4" />
                  <span className="hidden sm:inline">{getLanguageLabel(currentLocale)}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={4}>
                {locales.map((locale) => (
                  <DropdownMenuItem
                    key={locale}
                    onClick={() => handleLanguageChange(locale)}
                    className={currentLocale === locale ? 'bg-accent' : ''}
                  >
                    <span className="flex items-center justify-center text-xs font-medium mr-2">
                      {locale.toUpperCase()}
                    </span>
                    {getLanguageLabel(locale)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <ThemeIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">{themeLabel}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={4}>
                {Object.entries(themeConfig).map(([themeKey, config]) => {
                  const Icon = config.icon;
                  const label = config.label();
                  return (
                    <DropdownMenuItem
                      key={themeKey}
                      onClick={() => setTheme(themeKey as any)}
                      className={theme === themeKey ? 'bg-accent' : ''}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {label}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile Menu */}
            <ProfileMenu />
          </div>
        </div>
      </header>

      {/* Sticky navigation bar - показывать только на главной странице */}
      {isHomePage && (
        <nav className="fixed top-[57px] left-0 right-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="container mx-auto flex items-center py-3 relative">
            {/* Categories navigation - из API */}
            {isLoading ? (
              <div className='text-sm text-muted-foreground'>Загрузка...</div>
            ) : (
              <div className="flex gap-6">
                {categories.map((category) => (
                  <a
                    key={category.id}
                    href={`#category-${category.id}`}
                    className="text-sm font-medium hover:text-primary transition-colors px-2 py-1 rounded-md hover:bg-accent scroll-smooth"
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.getElementById(`category-${category.id}`);
                      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                  >
                    {category.name}
                  </a>
                ))}
              </div>
            )}
            {/* Cart button - positioned to the right */}
            <div className="absolute right-0">
              <CartSheet />
            </div>
          </div>
        </nav>
      )}
    </>
  );
}