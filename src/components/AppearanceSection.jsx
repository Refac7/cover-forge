/* ========================================
   AppearanceSection — Background type, color,
   image upload, blur, brightness controls.
   ======================================== */

import React, { useCallback } from 'react';
import { ActionTypes } from '../store/configReducer.js';
import { ColorPicker } from './shared/ColorPicker.jsx';
import { Slider } from './shared/Slider.jsx';
import { FileUpload } from './shared/FileUpload.jsx';

export const AppearanceSection = React.memo(function AppearanceSection({
  bgType,
  bgColor,
  bgImage,
  themeColor,
  textColor,
  blur,
  brightness,
  dispatch,
}) {
  const setBgType = useCallback((type) => {
    dispatch({ type: ActionTypes.SET_BG_TYPE, payload: type });
  }, [dispatch]);

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      dispatch({ type: ActionTypes.SET_BG_IMAGE, payload: url });
      dispatch({ type: ActionTypes.SET_BG_TYPE, payload: 'image' });
    }
  }, [dispatch]);

  const handleColorChange = useCallback((action) => (val) => {
    dispatch({ type: action, payload: val });
  }, [dispatch]);

  const handleSlider = useCallback((action) => (val) => {
    dispatch({ type: action, payload: val });
  }, [dispatch]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      {/* Color pickers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
        <ColorPicker label="Accent" value={themeColor} onChange={handleColorChange(ActionTypes.SET_THEME_COLOR)} />
        <ColorPicker label="Text" value={textColor} onChange={handleColorChange(ActionTypes.SET_TEXT_COLOR)} />
      </div>

      {/* Background type */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        padding: 'var(--space-4)',
        background: 'hsl(var(--card))',
        border: '1px solid hsl(var(--border))',
        borderRadius: 'var(--radius-md)',
      }}>
        {/* Radio group */}
        <div style={{ display: 'flex', gap: 'var(--space-6)' }}>
          {[
            { value: 'color', label: 'Solid Color' },
            { value: 'image', label: 'Image' },
          ].map(({ value, label }) => {
            const isActive = bgType === value;
            return (
              <label
                key={value}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)',
                  color: 'hsl(var(--foreground))',
                }}
              >
                <div
                  onClick={() => setBgType(value)}
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 'var(--radius-full)',
                    border: isActive ? '4px solid hsl(var(--primary))' : '1px solid hsl(var(--border))',
                    background: isActive ? 'hsl(var(--background))' : 'hsl(var(--card))',
                    transition: 'border-width var(--duration-fast) var(--ease-out)',
                  }}
                />
                {label}
              </label>
            );
          })}
        </div>

        {bgType === 'color' ? (
          <ColorPicker label="Background" value={bgColor} onChange={handleColorChange(ActionTypes.SET_BG_COLOR)} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <FileUpload label="Upload Background Image" accept="image/*" onChange={handleImageUpload} />
            {bgImage && (
              <>
                <Slider label="Blur" value={blur} min={0} max={20} onChange={handleSlider(ActionTypes.SET_BLUR)} />
                <Slider label="Brightness" value={brightness} min={0} max={200} onChange={handleSlider(ActionTypes.SET_BRIGHTNESS)} />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
});
