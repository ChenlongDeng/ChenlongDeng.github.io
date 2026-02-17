'use client';

import { useEffect, useState } from 'react';
import { useThemeStore, resolveTheme } from '@/lib/stores/themeStore';

function getSystemPrefersDark(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function updateTheme(theme: 'light' | 'dark') {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
  root.setAttribute('data-theme', theme);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setSystemTheme, isManual } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // On mount, only use system preference if user hasn't manually set theme
    const currentState = useThemeStore.getState();
    if (!currentState.isManual) {
      const systemTheme = getSystemPrefersDark() ? 'dark' : 'light';
      if (currentState.theme !== systemTheme) {
        setSystemTheme(systemTheme);
      } else {
        updateTheme(currentState.theme);
      }
    } else {
      // User has manually set theme, just apply it
      updateTheme(currentState.theme);
    }
  }, []); // Only run on mount

  // Listen to system theme changes (only if user hasn't manually set a theme)
  useEffect(() => {
    if (!mounted) return;

    // Only listen to system changes if user hasn't manually set a theme
    if (!isManual && typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
        // Check if user has manually set theme (may have changed since listener was set)
        const currentState = useThemeStore.getState();
        if (currentState.isManual) return; // User manually set theme, don't follow system
        
        const prefersDark = 'matches' in e ? e.matches : (e as MediaQueryList).matches;
        const systemTheme = prefersDark ? 'dark' : 'light';
        
        // Update theme from system
        if (currentState.theme !== systemTheme) {
          currentState.setSystemTheme(systemTheme);
        }
      };

      // Handle both addEventListener (modern) and addListener (Safari <14)
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      } else if ('addListener' in mediaQuery) {
        const mq = mediaQuery as MediaQueryList & { addListener: (listener: (e: MediaQueryListEvent) => void) => void; removeListener: (listener: (e: MediaQueryListEvent) => void) => void };
        mq.addListener(handleChange);
        return () => mq.removeListener(handleChange);
      }
    }
  }, [mounted, isManual]);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    const apply = () => {
      const effective = resolveTheme(theme);
      root.classList.remove('light', 'dark');
      root.classList.add(effective);
      root.setAttribute('data-theme', effective);
    };

    apply();
  }, [theme, mounted]);

  // Prevent flash of unstyled content
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return <>{children}</>;
} 
