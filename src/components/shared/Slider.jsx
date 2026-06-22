/* ========================================
   Slider — Range input with numeric display.
   Uses rAF-batched onChange for performance.
   ======================================== */

import React, { useState, useRef, useCallback, useEffect } from 'react';

export const Slider = React.memo(function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}) {
  const [localValue, setLocalValue] = useState(value);
  const rafRef = useRef(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = useCallback((e) => {
    const val = Number(e.target.value);
    setLocalValue(val);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      onChange(val);
    });
  }, [onChange]);

  return (
    <div className="cf-input-group">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span className="cf-input-label">{label}</span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          color: 'hsl(var(--muted-foreground) / 0.6)',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {localValue}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={localValue}
        onChange={handleChange}
      />
    </div>
  );
});
