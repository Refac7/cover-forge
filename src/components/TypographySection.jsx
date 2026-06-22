/* ========================================
   TypographySection — Font family picker,
   custom font upload (FontFace API), font size.
   ======================================== */

import React, { useCallback } from 'react';
import { ActionTypes } from '../store/configReducer.js';
import { PRESET_FONTS } from '../store/constants.js';
import { Slider } from './shared/Slider.jsx';
import { FileUpload } from './shared/FileUpload.jsx';

export const TypographySection = React.memo(function TypographySection({
  fontFamily,
  fontSize,
  customFontName,
  dispatch,
}) {
  const handleFontSelect = useCallback((e) => {
    dispatch({ type: ActionTypes.SET_FONT_FAMILY, payload: e.target.value });
  }, [dispatch]);

  const handleFontSize = useCallback((val) => {
    dispatch({ type: ActionTypes.SET_FONT_SIZE, payload: val });
  }, [dispatch]);

  const handleFontUpload = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
  }, [dispatch]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      {/* Font family select */}
      <div className="cf-input-group">
        <label className="cf-input-label">Typeface</label>
        <select
          value={fontFamily}
          onChange={handleFontSelect}
        >
          {PRESET_FONTS.map((f) => (
            <option key={f.value} value={f.value}>{f.name}</option>
          ))}
          {customFontName && (
            <option value={customFontName}>Custom Uploaded</option>
          )}
        </select>
      </div>

      {/* Font upload */}
      <FileUpload label="Upload Font (.ttf, .otf, .woff, .woff2)" accept=".ttf,.otf,.woff,.woff2" onChange={handleFontUpload} />

      {/* Font size slider */}
      <Slider label="Font Size" value={fontSize} min={24} max={200} step={1} onChange={handleFontSize} />
    </div>
  );
});
