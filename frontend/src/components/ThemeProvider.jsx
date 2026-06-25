import { useEffect } from 'react';
import useThemeStore from '../store/themeStore';

/**
 * ThemeProvider: Apply CSS variables lên <html> element
 * dựa theo theme đang active trong store.
 */
export default function ThemeProvider({ children }) {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'pastel') {
      // ── Pastel Light Theme ──
      root.setAttribute('data-theme', 'pastel');

      root.style.setProperty('--color-bg-base',        '#F0F4FF');
      root.style.setProperty('--color-bg-surface',     'rgba(255, 255, 255, 0.6)');
      root.style.setProperty('--color-bg-elevated',    'rgba(255, 255, 255, 0.8)');
      
      root.style.setProperty('--color-bg-header',      'rgba(255, 255, 255, 0.7)');
      root.style.setProperty('--color-bg-card',        'rgba(255, 255, 255, 0.6)');
      root.style.setProperty('--color-bg-card-hover',  'rgba(255, 255, 255, 0.9)');
      root.style.setProperty('--color-bg-input',       'rgba(255, 255, 255, 0.8)');
      root.style.setProperty('--color-bg-modal',       '#FFFFFF');

      root.style.setProperty('--color-border',         'rgba(255, 255, 255, 0.6)');
      root.style.setProperty('--color-border-light',   'rgba(255, 255, 255, 0.3)');

      root.style.setProperty('--color-text-primary',   '#1E1B4B');
      root.style.setProperty('--color-text-secondary', '#4338CA');
      root.style.setProperty('--color-text-muted',     '#6366F1');
      root.style.setProperty('--color-text-invert',    '#FFFFFF');

      root.style.setProperty('--color-accent',         '#6366F1');
      root.style.setProperty('--color-accent-hover',   '#4F46E5');
      root.style.setProperty('--color-accent-light',   'rgba(99, 102, 241, 0.15)');
      root.style.setProperty('--color-accent-glow',    'rgba(99, 102, 241, 0.3)');

      root.style.setProperty('--color-neon-var',       '#6366F1');
      root.style.setProperty('--color-neon-var-hover', '#4F46E5');

      root.style.setProperty('--gradient-hero',
        'linear-gradient(135deg, #D4E3FF 0%, #E8DCFB 50%, #F5D9F5 100%)');
      root.style.setProperty('--gradient-card',
        'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 100%)');

      root.style.setProperty('--shadow-card',          '0 8px 32px 0 rgba(79, 70, 229, 0.08)');
      root.style.setProperty('--shadow-header',        '0 4px 20px 0 rgba(79, 70, 229, 0.06)');

    } else {
      // ── Dark Football Theme (mặc định) ────────────────────
      root.setAttribute('data-theme', 'dark');

      root.style.setProperty('--color-bg-base',        '#070e17');
      root.style.setProperty('--color-bg-surface',     '#0A192F');
      root.style.setProperty('--color-bg-elevated',    '#112240');
      root.style.setProperty('--color-bg-header',      '#0A192F');
      root.style.setProperty('--color-bg-card',        '#112240');
      root.style.setProperty('--color-bg-card-hover',  '#172b4d');
      root.style.setProperty('--color-bg-input',       '#112240');
      root.style.setProperty('--color-bg-modal',       '#0A192F');

      root.style.setProperty('--color-border',         '#1e3a5f');
      root.style.setProperty('--color-border-light',   '#1a3155');

      root.style.setProperty('--color-text-primary',   '#e2e8f0');
      root.style.setProperty('--color-text-secondary', '#94a3b8');
      root.style.setProperty('--color-text-muted',     '#64748b');
      root.style.setProperty('--color-text-invert',    '#070e17');

      root.style.setProperty('--color-accent',         '#39FF14');
      root.style.setProperty('--color-accent-hover',   '#32E612');
      root.style.setProperty('--color-accent-light',   'rgba(57,255,20,0.12)');
      root.style.setProperty('--color-accent-glow',    'rgba(57,255,20,0.25)');

      root.style.setProperty('--color-neon',           '#39FF14');
      root.style.setProperty('--color-neon-hover',     '#32E612');

      root.style.setProperty('--gradient-hero',
        'linear-gradient(135deg, #070e17 0%, #0A192F 50%, #112240 100%)');
      root.style.setProperty('--gradient-card',
        'linear-gradient(135deg, #112240 0%, #0A192F 100%)');

      root.style.setProperty('--shadow-card',          '0 4px 24px rgba(0,0,0,0.40)');
      root.style.setProperty('--shadow-header',        '0 2px 16px rgba(0,0,0,0.30)');
    }
  }, [theme]);

  return children;
}
