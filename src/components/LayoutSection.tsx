/* ========================================
   LayoutSection — Alignment grid + decorations
   toggle. Compact, visual-first controls.
   ======================================== */

import React, { useCallback } from 'react';
import { ActionTypes } from '../store/configReducer';
import { AlignmentGrid } from './shared/AlignmentGrid';
import { Toggle } from './shared/Toggle';
import type { ConfigAction, AlignmentKey } from '../types';

interface LayoutSectionProps {
  alignment: string;
  showDecorations: boolean;
  dispatch: (action: ConfigAction) => void;
}

export const LayoutSection = React.memo(function LayoutSection({
  alignment,
  showDecorations,
  dispatch,
}: LayoutSectionProps) {
  const handleAlignment = useCallback((key: AlignmentKey) => {
    dispatch({ type: ActionTypes.SET_ALIGNMENT, payload: key });
  }, [dispatch]);

  const handleToggleDecorations = useCallback(() => {
    dispatch({ type: ActionTypes.TOGGLE_DECORATIONS });
  }, [dispatch]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Alignment */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <span className="cf-input-label">Alignment</span>
        <AlignmentGrid value={alignment} onChange={handleAlignment} />
      </div>

      {/* Decorations */}
      <Toggle
        label="Typographic Marks"
        checked={showDecorations}
        onChange={handleToggleDecorations}
      />
    </div>
  );
});
