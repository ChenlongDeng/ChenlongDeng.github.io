import { create } from 'zustand';

export type Theme = 'light' | 'dark';

function getSystemPrefersDark(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function getInitialTheme(): { theme: Theme; isManual: boolean } {
  // If we're on the server, default to light (will be corrected on client)
  if (typeof window === 'undefined') return { theme: 'light', isManual: false };
  
  // Always use current system preference (never save or restore from localStorage)
  return {
    theme: getSystemPrefersDark() ? 'dark' : 'light',
    isManual: false
  };
}

interface ThemeStore {
  theme: Theme;
  isManual: boolean; // Whether user manually set the theme (only for current session)
  setTheme: (theme: Theme, isManual?: boolean) => void;
  toggleTheme: () => void; // toggles between light/dark
  setSystemTheme: (theme: Theme) => void; // Set theme from system (not manual)
}

export const useThemeStore = create<ThemeStore>()((set, get) => {
  const initial = getInitialTheme();
  return {
    // Initialize with system preference (always, no persistence)
    theme: initial.theme,
    isManual: initial.isManual,
    setTheme: (theme: Theme, isManual: boolean = true) => {
      set({ theme, isManual });
      updateTheme(theme);
    },
    setSystemTheme: (theme: Theme) => {
      // Set theme from system without marking as manual
      set({ theme, isManual: false });
      updateTheme(theme);
    },
    toggleTheme: () => {
      const current = get().theme;
      const newTheme = current === 'dark' ? 'light' : 'dark';
      // Toggle is always a manual action (but won't persist)
      set({ theme: newTheme, isManual: true });
      updateTheme(newTheme);
    },
  };
});

export function resolveTheme(theme: Theme): 'light' | 'dark' {
  return theme;
}

function updateTheme(theme: Theme) {
  // Update DOM
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
  root.setAttribute('data-theme', theme);
}
