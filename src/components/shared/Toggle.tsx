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

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange();
    }
  }, [onChange]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <span style={{
        fontSize: 'var(--text-sm)',
        color: 'hsl(var(--foreground))',
      }}>{label}</span>
      <div
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        style={{
          position: 'relative',
          width: 40,
          height: 22,
          borderRadius: 'var(--radius-full)',
          background: checked ? 'hsl(var(--primary))' : 'hsl(var(--border))',
          cursor: 'pointer',
          transition: 'background var(--duration-fast) var(--ease-out)',
          flexShrink: 0,
        }}
      >
        <div style={{
          position: 'absolute',
          top: 2,
          left: checked ? 20 : 2,
          width: 18,
          height: 18,
          borderRadius: 'var(--radius-full)',
          background: '#fff',
          boxShadow: 'var(--shadow-sm)',
          transition: 'left var(--duration-fast) var(--ease-spring)',
        }} />
      </div>
    </div>
  );
});
