/* ========================================
   SidebarHeader — Logo, theme toggle,
   undo/redo, mobile close button.
   ======================================== */

import React, { useState, useEffect, useCallback } from 'react';

type Theme = 'system' | 'light' | 'dark';

const THEME_KEY = 'coverforge-theme';
const THEME_CYCLE: Theme[] = ['system', 'light', 'dark'];

function getStoredTheme(): Theme {
  if (typeof document === 'undefined') return 'system';
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return 'system';
}

function getSystemIsDark(): boolean {
  if (typeof document === 'undefined') return true;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.setAttribute('data-theme', 'dark');
    root.classList.add('dark');
    root.classList.remove('light');
  } else if (theme === 'light') {
    root.setAttribute('data-theme', 'light');
    root.classList.add('light');
    root.classList.remove('dark');
  } else {
    // System mode — let CSS @media (prefers-color-scheme) handle it
    root.removeAttribute('data-theme');
    root.classList.remove('dark', 'light');
  }
}

interface SidebarHeaderProps {
  canUndo: boolean;
  canRedo: boolean;
  undoCount: number;
  redoCount: number;
  onUndo: () => void;
  onRedo: () => void;
  onMobileClose?: () => void;
}

export const SidebarHeader = React.memo(function SidebarHeader({
  canUndo, canRedo, undoCount, redoCount,
  onUndo, onRedo, onMobileClose,
}: SidebarHeaderProps) {
  const [theme, setTheme] = useState<Theme>(getStoredTheme);
  const [systemIsDark, setSystemIsDark] = useState(getSystemIsDark);

  // Listen for system color-scheme changes (for icon updates when in "system" mode)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemIsDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Apply theme classes/attributes to <html> whenever theme changes
  useEffect(() => {
    applyTheme(theme);
    if (theme === 'system') {
      localStorage.removeItem(THEME_KEY);
    } else {
      localStorage.setItem(THEME_KEY, theme);
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const idx = THEME_CYCLE.indexOf(t);
      return THEME_CYCLE[(idx + 1) % THEME_CYCLE.length];
    });
  }, []);

  // The visually active theme — used for the icon shown in the button
  const effectiveIsDark = theme === 'system' ? systemIsDark : theme === 'dark';

  const nextTheme = THEME_CYCLE[(THEME_CYCLE.indexOf(theme) + 1) % THEME_CYCLE.length];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-6)',
      padding: 'var(--space-6) var(--space-5) var(--space-4)',
      borderBottom: '1px solid hsl(var(--border))',
      flexShrink: 0,
    }}>
      {/* Logo row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{
            width: 28, height: 28,
            background: 'hsl(var(--primary))',
            borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 'var(--font-bold)',
            color: 'hsl(var(--primary-foreground))',
            letterSpacing: '-0.02em',
          }}>
            C
          </div>
          <span style={{
            fontSize: 'var(--text-md)',
            fontWeight: 'var(--font-semibold)',
            color: 'hsl(var(--foreground))',
            letterSpacing: 'var(--tracking-tight)',
          }}>
            CoverForge
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
          <button
            onClick={toggleTheme}
            className="cf-btn--icon"
            title={`Theme: ${theme === 'system' ? 'Auto (follow system)' : theme === 'light' ? 'Light' : 'Dark'} — click for ${nextTheme === 'system' ? 'auto' : nextTheme}`}
            aria-label="Toggle theme"
          >
            {theme === 'system' ? (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="14" height="9" rx="1.5" />
                <path d="M5 14h6M8 12v2" />
              </svg>
            ) : effectiveIsDark ? (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="8" r="4.5" />
                <path d="M8 1v1.5M8 13.5V15M15 8h-1.5M2.5 8H1M13 3l-1 1M4 12l-1 1M13 13l-1-1M4 4L3 3" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="8" r="4.5" />
              </svg>
            )}
          </button>
          {onMobileClose && (
            <button
              onClick={onMobileClose}
              className="cf-btn--icon cf-mobile-close"
              aria-label="Close sidebar"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Undo/Redo row */}
      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
        <button
          onClick={onUndo} disabled={!canUndo}
          className="cf-btn--icon"
          title="Undo (Ctrl+Z)" aria-label="Undo"
          style={{ position: 'relative' }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h7a4 4 0 0 1 0 8H6" />
            <polyline points="6,3 3,6 6,9" />
          </svg>
          {undoCount > 0 && (
            <span className="cf-badge" style={{ position: 'absolute', top: -2, right: -2, minWidth: 14, height: 14, fontSize: 9, lineHeight: 1 }}>
              {undoCount}
            </span>
          )}
        </button>
        <button
          onClick={onRedo} disabled={!canRedo}
          className="cf-btn--icon"
          title="Redo (Ctrl+Shift+Z)" aria-label="Redo"
          style={{ position: 'relative' }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 6H6a4 4 0 0 0 0 8h4" />
            <polyline points="10,3 13,6 10,9" />
          </svg>
          {redoCount > 0 && (
            <span className="cf-badge" style={{ position: 'absolute', top: -2, right: -2, minWidth: 14, height: 14, fontSize: 9, lineHeight: 1 }}>
              {redoCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
});
