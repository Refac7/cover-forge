/* ========================================
   TextLayer — Title + subtitle with dynamic
   font, size, color, and alignment.
   Uses inline flex styles (no Tailwind).
   ======================================== */

import React from 'react';
import { ALIGNMENTS } from '../store/constants';

interface TextLayerProps {
  title: string;
  subtitle: string;
  textColor: string;
  themeColor: string;
  fontFamily: string;
  fontSize: number;
  alignment: string;
}

export const TextLayer = React.memo(function TextLayer({
  title,
  subtitle,
  textColor,
  themeColor,
  fontFamily,
  fontSize,
  alignment,
}: TextLayerProps) {
  const align = ALIGNMENTS[alignment as keyof typeof ALIGNMENTS] || ALIGNMENTS.center;

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        height: '100%',
        padding: '96px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        justifyContent: align.justifyContent,
        alignItems: align.alignItems,
      }}
    >
      <h1
        style={{
          color: textColor,
          fontFamily,
          fontSize: `${fontSize}px`,
          fontWeight: 700,
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          maxWidth: '85%',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {title}
        <span style={{ color: themeColor }}>.</span>
      </h1>

      {subtitle && (
        <div style={{ maxWidth: 720 }}>
          <p
            style={{
              color: textColor,
              fontFamily,
              fontSize: `${Math.max(16, Math.round(fontSize * 0.35))}px`,
              fontWeight: 400,
              lineHeight: 1.45,
              opacity: 0.75,
              wordBreak: 'break-word',
            }}
          >
            {subtitle}
          </p>
        </div>
      )}
    </div>
  );
});
