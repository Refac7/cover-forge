/* ========================================
   SidebarHeader — Logo, theme toggle,
   undo/redo, mobile close button.
   ======================================== */

import React, { useState, useEffect, useCallback } from 'react';

export const SidebarHeader = React.memo(function SidebarHeader({
  canUndo, canRedo, undoCount, redoCount,
  onUndo, onRedo, onMobileClose,
}) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof document !== 'undefined') {
      const stored = localStorage.getItem('coverforge-theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.setAttribute('data-theme', 'dark');
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.setAttribute('data-theme', 'light');
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('coverforge-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = useCallback(() => setIsDark((d) => !d), []);

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
            title={isDark ? 'Light mode' : 'Dark mode'}
            aria-label="Toggle theme"
          >
            {isDark ? '☀' : '☾'}
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
