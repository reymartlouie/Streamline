import React, { createContext, useContext, useState } from 'react';

type ThemeMode = 'dark' | 'light';

interface ThemeContextType {
  mode: ThemeMode;
  toggle: () => void;
  colors: typeof darkColors;
}

const darkColors = {
  bg: '#191919',
  bgElevated: '#222222',
  bgCard: '#2a2a2a',
  text: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.5)',
  textMuted: 'rgba(255,255,255,0.25)',
  border: 'rgba(255,255,255,0.07)',
  borderStrong: 'rgba(255,255,255,0.12)',
  inputBg: 'rgba(255,255,255,0.06)',
  accent: '#6BA3D6',
  accentDark: '#4A85BE',
  accentMuted: 'rgba(107,163,214,0.15)',
  accentBorder: 'rgba(107,163,214,0.3)',
  tabBar: '#191919',
  placeholder: 'rgba(255,255,255,0.28)',
};

const lightColors = {
  bg: '#F5F5F7',
  bgElevated: '#FFFFFF',
  bgCard: '#FFFFFF',
  text: '#111111',
  textSecondary: 'rgba(0,0,0,0.5)',
  textMuted: 'rgba(0,0,0,0.3)',
  border: 'rgba(0,0,0,0.07)',
  borderStrong: 'rgba(0,0,0,0.12)',
  inputBg: 'rgba(0,0,0,0.04)',
  accent: '#4A85BE',
  accentDark: '#2E6A9E',
  accentMuted: 'rgba(74,133,190,0.1)',
  accentBorder: 'rgba(74,133,190,0.25)',
  tabBar: '#FFFFFF',
  placeholder: 'rgba(0,0,0,0.3)',
};

const ThemeContext = createContext<ThemeContextType>({
  mode: 'dark',
  toggle: () => {},
  colors: darkColors,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('dark');
  const toggle = () => setMode((m) => (m === 'dark' ? 'light' : 'dark'));
  const colors = mode === 'dark' ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ mode, toggle, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}