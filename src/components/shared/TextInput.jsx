/* ========================================
   TextInput — Labeled text or textarea input.
   Memo-friendly: only value + onChange.
   ======================================== */

import React from 'react';

export const TextInput = React.memo(function TextInput({
  label,
  value,
  onChange,
  placeholder = '',
  isTextarea = false,
  rows = 2,
}) {
  const inputId = `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="cf-input-group">
      <label className="cf-input-label" htmlFor={inputId}>{label}</label>
      {isTextarea ? (
        <textarea
          id={inputId}
          className="cf-input"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          style={{ resize: 'vertical' }}
        />
      ) : (
        <input
          id={inputId}
          className="cf-input"
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      )}
    </div>
  );
});
