import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAppSettingsStore, type Theme } from '@/shared/stores/app-settings-store';

type ThemeProviderContextType = {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeProviderContext = createContext<ThemeProviderContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  ...props
}: ThemeProviderProps) {
  const { settings, setTheme, toggleTheme, getResolvedTheme } = useAppSettingsStore();
  const theme = settings.theme || defaultTheme;
  const resolvedTheme = getResolvedTheme();

  useEffect(() => {
    // SSR-safe проверка
    if (typeof window === 'undefined') return;
    
    const root = window.document.documentElement;
    
    // Удаляем существующие классы темы
    root.classList.remove('light', 'dark');
    
    // Добавляем класс для разрешенной темы
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  // Слушаем изменения системной темы
  useEffect(() => {
    // SSR-safe проверка
    if (typeof window === 'undefined') return;
    
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = () => {
        // Принудительно обновляем тему при изменении системных настроек
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(getResolvedTheme());
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme, getResolvedTheme]);

  const value: ThemeProviderContextType = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}