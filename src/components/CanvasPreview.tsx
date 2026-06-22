/* ========================================
   CanvasPreview — Scaled 1280×720 container.
   Uses ResizeObserver for adaptive scaling.
   Composes all three canvas layers.
   ======================================== */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { BackgroundLayer } from './BackgroundLayer';
import { DecorationLayer } from './DecorationLayer';
import { TextLayer } from './TextLayer';
import { BASE_WIDTH, BASE_HEIGHT } from '../store/constants';

interface CanvasPreviewProps {
  bgType: string;
  bgColor: string;
  bgImage: string | null;
  blur: number;
  brightness: number;
  themeColor: string;
  textColor: string;
  title: string;
  subtitle: string;
  fontFamily: string;
  fontSize: number;
  alignment: string;
  showDecorations: boolean;
  previewRef: React.Ref<HTMLDivElement>;
}

export const CanvasPreview = React.memo(function CanvasPreview({
  bgType,
  bgColor,
  bgImage,
  blur,
  brightness,
  themeColor,
  textColor,
  title,
  subtitle,
  fontFamily,
  fontSize,
  alignment,
  showDecorations,
  previewRef,
}: CanvasPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  /* ResizeObserver: compute scale to fit container width */
  const updateScale = useCallback(() => {
    if (containerRef.current) {
      const w = containerRef.current.offsetWidth;
      setScale(w / BASE_WIDTH);
    }
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    updateScale();

    const observer = new ResizeObserver(() => {
      /* rAF throttle */
      requestAnimationFrame(updateScale);
    });
    observer.observe(el);

    return () => observer.disconnect();
  }, [updateScale]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        background: 'hsl(var(--secondary))',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      {/* Aspect-ratio spacer */}
      <div style={{ paddingBottom: `${(BASE_HEIGHT / BASE_WIDTH) * 100}%` }} />

      {/* Scaled canvas */}
      <div
        ref={previewRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: BASE_WIDTH,
          height: BASE_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          overflow: 'hidden',
          userSelect: 'none',
        }}
      >
        <BackgroundLayer
          bgType={bgType}
          bgColor={bgColor}
          bgImage={bgImage}
          blur={blur}
          brightness={brightness}
        />
        <DecorationLayer
          showDecorations={showDecorations}
          themeColor={themeColor}
          textColor={textColor}
        />
        <TextLayer
          title={title}
          subtitle={subtitle}
          textColor={textColor}
          themeColor={themeColor}
          fontFamily={fontFamily}
          fontSize={fontSize}
          alignment={alignment}
        />
      </div>
    </div>
  );
});
