/* ========================================
   CanvasSection — Aspect ratio presets +
   custom resolution (width × height).
   ======================================== */

import React, { useState, useEffect, useCallback } from 'react';
import { ActionTypes } from '../store/configReducer';
import { ASPECT_RATIOS, MIN_CANVAS_DIMENSION, MAX_CANVAS_DIMENSION } from '../store/constants';
import type { ConfigAction } from '../types';

interface CanvasSectionProps {
  canvasWidth: number;
  canvasHeight: number;
  dispatch: (action: ConfigAction) => void;
}

export const CanvasSection = React.memo(function CanvasSection({
  canvasWidth,
  canvasHeight,
  dispatch,
}: CanvasSectionProps) {
  const [widthInput, setWidthInput] = useState(String(canvasWidth));
  const [heightInput, setHeightInput] = useState(String(canvasHeight));

  /* Sync local inputs when state changes externally (undo/redo, preset, ratio) */
  useEffect(() => {
    setWidthInput(String(canvasWidth));
  }, [canvasWidth]);

  useEffect(() => {
    setHeightInput(String(canvasHeight));
  }, [canvasHeight]);

  const handleAspectRatio = useCallback((width: number, height: number) => {
    dispatch({ type: ActionTypes.SET_CANVAS_SIZE, payload: { width, height } });
  }, [dispatch]);

  const commitDimension = useCallback((
    raw: string,
    setter: React.Dispatch<React.SetStateAction<string>>,
    action: typeof ActionTypes.SET_CANVAS_WIDTH | typeof ActionTypes.SET_CANVAS_HEIGHT,
  ) => {
    setter(raw);
    const value = Math.round(Number(raw));
    if (raw !== '' && !Number.isNaN(value) && value >= MIN_CANVAS_DIMENSION && value <= MAX_CANVAS_DIMENSION) {
      dispatch({ type: action, payload: value });
    }
  }, [dispatch]);

  const handleWidth = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    commitDimension(e.target.value, setWidthInput, ActionTypes.SET_CANVAS_WIDTH);
  }, [commitDimension]);

  const handleHeight = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    commitDimension(e.target.value, setHeightInput, ActionTypes.SET_CANVAS_HEIGHT);
  }, [commitDimension]);

  const activeRatio = ASPECT_RATIOS.find(
    (r) => r.width === canvasWidth && r.height === canvasHeight,
  )?.id ?? null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      {/* Aspect ratio */}
      <div className="cf-input-group">
        <label className="cf-input-label">Aspect Ratio</label>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 'var(--space-2)',
        }}>
          {ASPECT_RATIOS.map((ratio) => {
            const active = activeRatio === ratio.id;
            return (
              <button
                key={ratio.id}
                onClick={() => handleAspectRatio(ratio.width, ratio.height)}
                aria-pressed={active}
                title={`${ratio.label} (${ratio.width} × ${ratio.height})`}
                style={{
                  padding: 'var(--space-1) var(--space-2)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-medium)',
                  color: active ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                  background: active ? 'hsl(var(--primary) / 0.1)' : 'hsl(var(--card))',
                  border: `1px solid ${active ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  transition:
                    'background var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out), color var(--duration-fast) var(--ease-out)',
                }}
              >
                {ratio.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Resolution */}
      <div className="cf-input-group">
        <label className="cf-input-label">Resolution (px)</label>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: 'var(--space-2)',
          alignItems: 'center',
        }}>
          <input
            type="number"
            className="cf-input"
            value={widthInput}
            min={MIN_CANVAS_DIMENSION}
            max={MAX_CANVAS_DIMENSION}
            onChange={handleWidth}
            aria-label="Canvas width"
          />
          <span style={{ color: 'hsl(var(--muted-foreground))', fontSize: 'var(--text-sm)' }}>×</span>
          <input
            type="number"
            className="cf-input"
            value={heightInput}
            min={MIN_CANVAS_DIMENSION}
            max={MAX_CANVAS_DIMENSION}
            onChange={handleHeight}
            aria-label="Canvas height"
          />
        </div>
      </div>
    </div>
  );
});
