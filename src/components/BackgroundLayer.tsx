/* ========================================
   BackgroundLayer — Solid color or filtered
   background image for the canvas.
   ======================================== */

import React from 'react';
import { useI18n } from '../i18n';

interface BackgroundLayerProps {
  bgType: string;
  bgColor: string;
  bgImage: string | null;
  blur: number;
  brightness: number;
}

export const BackgroundLayer = React.memo(function BackgroundLayer({
  bgType,
  bgColor,
  bgImage,
  blur,
  brightness,
}: BackgroundLayerProps) {
  const { t } = useI18n();
  return (
    <>
      {/* Solid color base — always present */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: bgColor,
        }}
      />

      {/* Image overlay when image mode is active */}
      {bgType === 'image' && bgImage && (
        <img
          src={bgImage}
          alt={t('background.alt')}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: `blur(${blur}px) brightness(${brightness}%)`,
          }}
          draggable={false}
        />
      )}
    </>
  );
});
