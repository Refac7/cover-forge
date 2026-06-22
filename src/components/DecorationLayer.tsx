/* ========================================
   DecorationLayer — Optional typographic
   marks overlay: rule line, label, corner mark.
   ======================================== */

import React from 'react';

interface DecorationLayerProps {
  showDecorations: boolean;
  themeColor: string;
  textColor: string;
}

export const DecorationLayer = React.memo(function DecorationLayer({
  showDecorations,
  themeColor,
  textColor,
}: DecorationLayerProps) {
  if (!showDecorations) return null;

  const year = new Date().getFullYear();

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        padding: '64px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Top: rule line + label */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}>
        <div style={{
          width: 64,
          height: 1,
          backgroundColor: themeColor,
          opacity: 0.4,
        }} />
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: textColor,
          opacity: 0.25,
        }}>
          Fig.01
        </span>
      </div>

      {/* Bottom: year + corner mark */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: textColor,
          opacity: 0.25,
        }}>
          Index / {year}
        </span>
        <div style={{
          width: 16,
          height: 16,
          borderBottom: `2px solid ${themeColor}`,
          borderRight: `2px solid ${themeColor}`,
          opacity: 0.4,
        }} />
      </div>
    </div>
  );
});
