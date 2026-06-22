/* ========================================
   ContentSection — Debounced title + subtitle.
   Local state for instant typing feel,
   dispatches debounced value upstream.
   ======================================== */

import React, { useState, useCallback } from 'react';
import { useDebounce } from '../hooks/useDebounce.js';
import { ActionTypes } from '../store/configReducer.js';
import { TextInput } from './shared/TextInput.jsx';

const DEBOUNCE_MS = 200;

export const ContentSection = React.memo(function ContentSection({ title, subtitle, dispatch }) {
  const [localTitle, setLocalTitle] = useState(title);
  const [localSubtitle, setLocalSubtitle] = useState(subtitle);

  /* Sync when external state changes (undo/redo, preset load) */
  React.useEffect(() => {
    setLocalTitle(title);
    setLocalSubtitle(subtitle);
  }, [title, subtitle]);

  const debouncedTitle = useDebounce(localTitle, DEBOUNCE_MS);
  const debouncedSubtitle = useDebounce(localSubtitle, DEBOUNCE_MS);

  React.useEffect(() => {
    dispatch({ type: ActionTypes.SET_TITLE, payload: debouncedTitle });
  }, [debouncedTitle, dispatch]);

  React.useEffect(() => {
    dispatch({ type: ActionTypes.SET_SUBTITLE, payload: debouncedSubtitle });
  }, [debouncedSubtitle, dispatch]);

  const handleTitleChange = useCallback((e) => setLocalTitle(e.target.value), []);
  const handleSubtitleChange = useCallback((e) => setLocalSubtitle(e.target.value), []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <TextInput
        label="Title"
        value={localTitle}
        onChange={handleTitleChange}
        placeholder="Enter cover title"
      />
      <TextInput
        label="Subtitle"
        value={localSubtitle}
        onChange={handleSubtitleChange}
        placeholder="Optional subtitle"
        isTextarea
        rows={2}
      />
    </div>
  );
});
