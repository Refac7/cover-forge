/* ========================================
   KeyboardShortcutOverlay — Modal overlay
   listing all keyboard shortcuts.
   Shown on '?' key, dismissed on Esc.
   ======================================== */

import React, { useEffect, useCallback } from 'react';

const SHORTCUT_LIST = [
  { keys: '⌘E', description: 'Export PNG' },
  { keys: '⌘Z', description: 'Undo' },
  { keys: '⌘⇧Z', description: 'Redo' },
  { keys: '⌘D', description: 'Toggle decorations' },
  { keys: '⌘B', description: 'Toggle background type' },
  { keys: '1–9', description: 'Set text alignment' },
  { keys: '?', description: 'Show shortcuts' },
  { keys: 'Esc', description: 'Close overlay' },
];

interface KeyboardShortcutOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutOverlay = React.memo(function KeyboardShortcutOverlay({
  isOpen,
  onClose,
}: KeyboardShortcutOverlayProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 'var(--z-modal)',
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'cf-fade-in 0.15s var(--ease-out)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'hsl(var(--card))',
          border: '1px solid hsl(var(--border))',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-8)',
          minWidth: 400,
          maxWidth: '90vw',
          boxShadow: 'var(--shadow-xl)',
          animation: 'cf-scale-in 0.2s var(--ease-out)',
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-6)',
        }}>
          <h2 style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--font-semibold)',
            color: 'hsl(var(--foreground))',
          }}>
            Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            className="cf-btn--icon"
            style={{
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'var(--text-lg)',
            }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {SHORTCUT_LIST.map(({ keys, description }) => (
            <div
              key={description}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--space-2) var(--space-3)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <span style={{
                fontSize: 'var(--text-sm)',
                color: 'hsl(var(--muted-foreground))',
              }}>
                {description}
              </span>
              <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                {keys.split('').map((char, i) => (
                  <kbd key={i} className="cf-kbd">
                    {char === '⇧' ? '⇧' : char === '⌘' ? '⌘' : char}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
});
