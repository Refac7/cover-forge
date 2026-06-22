/* ========================================
   ColorPicker — Inline color swatch with hidden
   native picker. Compact and intentional.
   ======================================== */

import React, { useCallback } from 'react';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

export const ColorPicker = React.memo(function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 'var(--space-2) var(--space-3)',
      background: 'hsl(var(--card))',
      border: '1px solid hsl(var(--border))',
      borderRadius: 'var(--radius-md)',
      transition: 'border-color var(--duration-fast) var(--ease-out)',
    }}>
      <span style={{
        fontSize: 'var(--text-sm)',
        color: 'hsl(var(--foreground))',
      }}>{label}</span>
      <div style={{
        position: 'relative',
        width: 24,
        height: 24,
        borderRadius: 'var(--radius-sm)',
        border: '1px solid hsl(var(--border))',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        <input
          type="color"
          value={value}
          onChange={handleChange}
          aria-label={label}
        />
        <div style={{
          width: '100%',
          height: '100%',
          backgroundColor: value,
          pointerEvents: 'none',
        }} />
      </div>
    </div>
  );
});
