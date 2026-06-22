/* ========================================
   useAutosave — Persist/restore config to localStorage.
   Debounced write, restore prompt on mount.
   ======================================== */

import { useState, useEffect, useRef, useCallback } from 'react';

const AUTOSAVE_KEY = 'coverforge-autosave';
const AUTOSAVE_DELAY = 1000;

export function useAutosave(state, clearHistory) {
  const [showRestorePrompt, setShowRestorePrompt] = useState(false);
  const [savedConfig, setSavedConfig] = useState(null);
  const isRestoring = useRef(false);
  const timerRef = useRef(null);

  /* Check for saved state on mount */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTOSAVE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.timestamp) {
          setSavedConfig(parsed.config);
          setShowRestorePrompt(true);
        }
      }
    } catch {
      /* corrupted data — ignore */
    }
  }, []);

  /* Autosave on state change (debounced 1s) */
  useEffect(() => {
    if (isRestoring.current) {
      isRestoring.current = false;
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(AUTOSAVE_KEY, JSON.stringify({
          config: state,
          timestamp: Date.now(),
        }));
      } catch {
        /* quota exceeded — silently fail */
      }
    }, AUTOSAVE_DELAY);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [state]);

  const restore = useCallback(() => {
    if (savedConfig) {
      isRestoring.current = true;
      clearHistory();
      setShowRestorePrompt(false);
      return savedConfig;
    }
    return null;
  }, [savedConfig, clearHistory]);

  const dismissRestore = useCallback(() => {
    setShowRestorePrompt(false);
    /* Clear saved state so it doesn't prompt again next load */
    try { localStorage.removeItem(AUTOSAVE_KEY); } catch {}
  }, []);

  return { showRestorePrompt, restore, dismissRestore };
}
