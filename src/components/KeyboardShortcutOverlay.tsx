/* ========================================
   KeyboardShortcutOverlay — Modal overlay
   listing all keyboard shortcuts.
   Shown on '?' key, dismissed on Esc.
   ======================================== */

import React, { useEffect, useCallback } from 'react';
import { useI18n } from '../i18n';
import type { TranslationKey } from '../i18n/messages';

const SHORTCUT_LIST: { keys: string; label: TranslationKey }[] = [
  { keys: '⌘E', label: 'shortcuts.export' },
  { keys: '⌘Z', label: 'shortcuts.undo' },
  { keys: '⌘⇧Z', label: 'shortcuts.redo' },
  { keys: '⌘D', label: 'shortcuts.toggleDecorations' },
  { keys: '⌘B', label: 'shortcuts.toggleBackground' },
  { keys: '1–9', label: 'shortcuts.setAlignment' },
  { keys: '?', label: 'shortcuts.showShortcuts' },
  { keys: 'Esc', label: 'shortcuts.closeOverlay' },
];

interface KeyboardShortcutOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutOverlay = React.memo(function KeyboardShortcutOverlay({
  isOpen,
  onClose,
}: KeyboardShortcutOverlayProps) {
  const { t } = useI18n();
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose],
  );

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
        background: 'hsl(var(--md-scrim) / 0.5)',
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
          background: 'hsl(var(--md-surface-container-high))',
          border: 'none',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-8)',
          minWidth: 400,
          maxWidth: '90vw',
          boxShadow: 'var(--elevation-3)',
          animation: 'cf-scale-in 0.2s var(--ease-emphasized-decelerate)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--space-6)',
          }}
        >
          <h2
            style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-semibold)',
              color: 'hsl(var(--foreground))',
            }}
          >
            {t('common.shortcutsTitle')}
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
            aria-label={t('common.close')}
          >
            ✕
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
          }}
        >
          {SHORTCUT_LIST.map(({ keys, label }) => (
            <div
              key={label}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--space-2) var(--space-3)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <span
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'hsl(var(--muted-foreground))',
                }}
              >
                {t(label)}
              </span>
              <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                {keys.split('').map((char, i) => (
                  <kbd key={i} className="cf-kbd">
                    {char}
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
