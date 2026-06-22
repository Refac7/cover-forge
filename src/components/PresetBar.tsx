/* ========================================
   PresetBar — Horizontal scrollable chip list
   of built-in + user presets.
   ======================================== */

import React, { useCallback } from 'react';
import { usePresets } from '../hooks/usePresets';
import type { CoverConfig, Preset } from '../types';

interface PresetBarProps {
  currentValues: CoverConfig;
  onApply: (values: Partial<CoverConfig>) => void;
}

export const PresetBar = React.memo(function PresetBar({ currentValues, onApply }: PresetBarProps) {
  const { allPresets } = usePresets();

  const handleClick = useCallback((preset: Preset) => {
    onApply(preset.values);
  }, [onApply]);

  if (allPresets.length === 0) return null;

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--space-2)',
    }}>
      {allPresets.map((preset) => (
        <button
          key={preset.id}
          className="cf-preset"
          onClick={() => handleClick(preset)}
          title={`Apply "${preset.name}" preset`}
        >
          <span style={{ fontSize: 11 }}>{preset.icon}</span>
          {preset.name}
        </button>
      ))}
    </div>
  );
});
