/* ========================================
   Toggle — Custom toggle switch.
   ======================================== */

import React, { useCallback } from 'react';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

export const Toggle = React.memo(function Toggle({ label, checked, onChange }: ToggleProps) {
  const handleClick = useCallback(() => {
    onChange();
  }, [onChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onChange();
      }
    },
    [onChange],
  );

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <span
        style={{
          fontSize: 'var(--text-sm)',
          color: 'hsl(var(--foreground))',
        }}
      >
        {label}
      </span>
      <div
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        style={{
          position: 'relative',
          width: 52,
          height: 32,
          borderRadius: 'var(--radius-full)',
          background: checked ? 'hsl(var(--md-primary))' : 'hsl(var(--md-surface-variant))',
          border: checked ? 'none' : '2px solid hsl(var(--md-outline))',
          boxSizing: 'border-box',
          cursor: 'pointer',
          transition: 'background var(--duration-short) var(--ease-standard)',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: checked ? 4 : 8,
            left: checked ? 24 : 6,
            width: checked ? 24 : 16,
            height: checked ? 24 : 16,
            borderRadius: 'var(--radius-full)',
            background: checked ? 'hsl(var(--md-on-primary))' : 'hsl(var(--md-outline))',
            boxShadow: 'var(--elevation-1)',
            transition:
              'left var(--duration-medium) var(--ease-emphasized), top var(--duration-medium) var(--ease-emphasized), width var(--duration-medium) var(--ease-emphasized), height var(--duration-medium) var(--ease-emphasized)',
          }}
        />
      </div>
    </div>
  );
});
