import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

export interface AppSettings {
  theme: Theme;
  language: string;
  sidebarCollapsed: boolean;
}

export interface AppSettingsStore {
  settings: AppSettings;
  
  // Theme actions
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  
  // Language actions
  setLanguage: (language: string) => void;
  
  // Sidebar actions
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  
  // Utilities
  getResolvedTheme: () => 'light' | 'dark';
}

const defaultSettings: AppSettings = {
  theme: 'system',
  language: 'ru',
  sidebarCollapsed: false,
};

export const useAppSettingsStore = create<AppSettingsStore>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      
      setTheme: (theme) =>
        set((state) => ({
          settings: { ...state.settings, theme },
        })),
      
      toggleTheme: () => {
        const currentTheme = get().settings.theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
      },
      
      setLanguage: (language) =>
        set((state) => ({
          settings: { ...state.settings, language },
        })),
      
      setSidebarCollapsed: (collapsed) =>
        set((state) => ({
          settings: { ...state.settings, sidebarCollapsed: collapsed },
        })),
      
      toggleSidebar: () => {
        const currentCollapsed = get().settings.sidebarCollapsed;
        get().setSidebarCollapsed(!currentCollapsed);
      },
      
      getResolvedTheme: () => {
        const theme = get().settings.theme;
        if (theme === 'system') {
          // SSR-safe проверка
          if (typeof window === 'undefined') {
            return 'light'; // fallback для SSR
          }
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return theme;
      },
    }),
    {
      name: 'jasalab-app-settings',
      version: 1,
    }
  )
);