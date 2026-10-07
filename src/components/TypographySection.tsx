/* ========================================
   TypographySection — Font family picker,
   custom font upload (FontFace API), font size.
   ======================================== */

import React, { useCallback } from 'react';
import { ActionTypes } from '../store/configReducer';
import { PRESET_FONTS } from '../store/constants';
import { useI18n } from '../i18n';
import { Slider } from './shared/Slider';
import { FileUpload } from './shared/FileUpload';
import type { ConfigAction } from '../types';

interface TypographySectionProps {
  fontFamily: string;
  fontSize: number;
  customFontName: string | null;
  dispatch: (action: ConfigAction) => void;
}

export const TypographySection = React.memo(function TypographySection({
  fontFamily,
  fontSize,
  customFontName,
  dispatch,
}: TypographySectionProps) {
  const { t } = useI18n();
  const handleFontSelect = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch({ type: ActionTypes.SET_FONT_FAMILY, payload: e.target.value });
    },
    [dispatch],
  );

  const handleFontSize = useCallback(
    (val: number) => {
      dispatch({ type: ActionTypes.SET_FONT_SIZE, payload: val });
    },
    [dispatch],
  );

  const handleFontUpload = useCallback(
    async (file: File) => {
      try {
        const fontName = `CustomFont_${Date.now()}`;
        const buffer = await file.arrayBuffer();
        const font = new FontFace(fontName, buffer);
        await font.load();
        document.fonts.add(font);
        dispatch({ type: ActionTypes.SET_CUSTOM_FONT_NAME, payload: fontName });
        dispatch({ type: ActionTypes.SET_FONT_FAMILY, payload: fontName });
      } catch (err) {
        console.error('Font load failed:', err);
      }
    },
    [dispatch],
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)',
      }}
    >
      {/* Font family select */}
      <div className="cf-input-group">
        <label className="cf-input-label">{t('typography.typeface')}</label>
        <select value={fontFamily} onChange={handleFontSelect}>
          {PRESET_FONTS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.name}
            </option>
          ))}
          {customFontName && (
            <option value={customFontName}>{t('typography.customUploaded')}</option>
          )}
        </select>
      </div>

      {/* Font upload */}
      <FileUpload
        label={t('typography.uploadFont')}
        accept=".ttf,.otf,.woff,.woff2"
        onFile={handleFontUpload}
      />

      {/* Font size slider */}
      <Slider
        label={t('typography.fontSize')}
        value={fontSize}
        min={24}
        max={200}
        step={1}
        onChange={handleFontSize}
      />
    </div>
  );
});
