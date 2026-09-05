/* ========================================
   CanvasPreview — Scaled canvas container.
   Uses ResizeObserver for adaptive scaling,
   fits both width and height of the viewport.
   Composes all three canvas layers.
   ======================================== */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { BackgroundLayer } from './BackgroundLayer';
import { DecorationLayer } from './DecorationLayer';
import { TextLayer } from './TextLayer';

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
  canvasWidth: number;
  canvasHeight: number;
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
  canvasWidth,
  canvasHeight,
  previewRef,
}: CanvasPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  /* Compute scale to fit available width and height */
  const updateScale = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const parent = el.parentElement;
    const availW = parent ? parent.clientWidth : el.clientWidth;
    const availH = parent ? parent.clientHeight : Math.max(window.innerHeight - 220, 240);
    if (availW > 0 && availH > 0) {
      setScale(Math.min(availW / canvasWidth, availH / canvasHeight));
    }
  }, [canvasWidth, canvasHeight]);

  useEffect(() => {
    updateScale();

    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(updateScale);
    });
    observer.observe(el);
    if (el.parentElement) observer.observe(el.parentElement);
    window.addEventListener('resize', updateScale);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, [updateScale]);

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: canvasWidth * scale,
          height: canvasHeight * scale,
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-md)',
          flexShrink: 0,
        }}
      >
        {/* Scaled canvas */}
        <div
          ref={previewRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: canvasWidth,
            height: canvasHeight,
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
    </div>
  );
});
