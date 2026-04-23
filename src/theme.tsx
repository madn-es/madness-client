import { createContext, useContext, useState, type ReactNode } from 'react';

// HSL 기반 테마. 그라디언트/보더 색 모두 여기서 파생.
export interface Theme {
  hue: number;        // 0-360
  saturation: number; // 0-100
  lightness: number;  // 0-100 (기본 밝기)
}

// 기본값: 흰색 (채도 0)
export const defaultTheme: Theme = {
  hue: 0,
  saturation: 0,
  lightness: 80,
};

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Partial<Theme>) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: defaultTheme,
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setState] = useState<Theme>(defaultTheme);
  const setTheme = (partial: Partial<Theme>) =>
    setState(t => ({ ...t, ...partial }));
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

// 유틸: HSL → HEX
export function hslToHex(h: number, s: number, l: number): string {
  const sNorm = s / 100;
  const lNorm = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sNorm * Math.min(lNorm, 1 - lNorm);
  const f = (n: number) => {
    const color = lNorm - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// 테마 accent 색 (보더, 포커스 등에 사용)
export function getAccent(theme: Theme): string {
  return hslToHex(theme.hue, theme.saturation, theme.lightness);
}
