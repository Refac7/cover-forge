/* ========================================
   ContentSection — Debounced title + subtitle.
   Local state for instant typing feel,
   dispatches debounced value upstream.
   ======================================== */

import React, { useState, useCallback } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { ActionTypes } from '../store/configReducer';
import { useI18n } from '../i18n';
import { TextInput } from './shared/TextInput';
import type { ConfigAction } from '../types';

const DEBOUNCE_MS = 200;

interface ContentSectionProps {
  title: string;
  subtitle: string;
  dispatch: (action: ConfigAction) => void;
}

export const ContentSection = React.memo(function ContentSection({
  title,
  subtitle,
  dispatch,
}: ContentSectionProps) {
  const { t } = useI18n();
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

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setLocalTitle(e.target.value),
    [],
  );
  const handleSubtitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setLocalSubtitle(e.target.value),
    [],
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)',
      }}
    >
      <TextInput
        label={t('content.title')}
        value={localTitle}
        onChange={handleTitleChange}
        placeholder={t('content.titlePlaceholder')}
      />
      <TextInput
        label={t('content.subtitle')}
        value={localSubtitle}
        onChange={handleSubtitleChange}
        placeholder={t('content.subtitlePlaceholder')}
        isTextarea
        rows={2}
      />
    </div>
  );
});
