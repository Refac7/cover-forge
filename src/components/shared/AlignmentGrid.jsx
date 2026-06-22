/* ========================================
   AlignmentGrid — 3×3 labeled visual grid.
   Uses ALIGNMENT_KEYS and ALIGNMENT_LABELS
   from constants (single source of truth).
   ======================================== */

import React from 'react';
import { ALIGNMENT_KEYS, ALIGNMENT_LABELS } from '../../store/constants.js';

const DOT_POSITIONS = {
  'top-left':      { top: '25%', left: '25%' },
  'top-center':    { top: '25%', left: '50%' },
  'top-right':     { top: '25%', left: '75%' },
  'center-left':   { top: '50%', left: '25%' },
  'center':        { top: '50%', left: '50%' },
  'center-right':  { top: '50%', left: '75%' },
  'bottom-left':   { top: '75%', left: '25%' },
  'bottom-center': { top: '75%', left: '50%' },
  'bottom-right':  { top: '75%', left: '75%' },
};

export const AlignmentGrid = React.memo(function AlignmentGrid({ value, onChange }) {
  return (
    <div
      role="radiogroup"
      aria-label="Text alignment"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 36px)',
        gridTemplateRows: 'repeat(3, 36px)',
        gap: 'var(--space-1)',
      }}
    >
      {ALIGNMENT_KEYS.map((key, idx) => {
        const isActive = value === key;
        const dot = DOT_POSITIONS[key];
        const label = ALIGNMENT_LABELS[key] || key;
        const shortcut = idx + 1;

        return (
          <button
            key={key}
            role="radio"
            aria-checked={isActive}
            aria-label={`${label} (${shortcut})`}
            title={`${label} [${shortcut}]`}
            onClick={() => onChange(key)}
            style={{
              position: 'relative',
              width: 36,
              height: 36,
              background: isActive ? 'hsl(var(--primary) / 0.1)' : 'hsl(var(--card))',
              border: `1px solid ${isActive ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              transition:
                'background var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out)',
            }}
          >
            <span style={{
              position: 'absolute',
              width: 6,
              height: 6,
              borderRadius: 'var(--radius-full)',
              background: isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground) / 0.6)',
              transform: 'translate(-50%, -50%)',
              transition: 'background var(--duration-fast) var(--ease-out)',
              ...dot,
            }} />
          </button>
        );
      })}
    </div>
  );
});
