import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppTheme, THEMES, ThemeConfig } from '../types/theme';

interface ThemeContextType {
  theme: AppTheme;
  themeConfig: ThemeConfig;
  setTheme: (theme: AppTheme) => void;
  isDark: boolean;
  isCute: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AppTheme>(() => {
    try {
      const saved = localStorage.getItem('nikahplan_theme') as AppTheme;
      if (saved && THEMES[saved]) return saved;
      return 'romantic';
    } catch {
      return 'romantic';
    }
  });

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('nikahplan_theme', newTheme);
    } catch {
      // ignore
    }
  };

  const themeConfig = THEMES[theme] || THEMES.romantic;
  const isDark = themeConfig.isDark;
  const isCute = theme === 'cute';

  useEffect(() => {
    // Sync class or attribute to document root
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme, isDark]);

  return (
    <ThemeContext.Provider value={{ theme, themeConfig, setTheme, isDark, isCute }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
