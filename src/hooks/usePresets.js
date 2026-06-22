/* ========================================
   usePresets — Built-in + user preset CRUD.
   User presets stored in localStorage.
   ======================================== */

import { useState, useCallback } from 'react';
import { BUILT_IN_PRESETS, USER_PRESETS_KEY, MAX_USER_PRESETS } from '../store/presets.js';

function loadUserPresets() {
  try {
    const raw = localStorage.getItem(USER_PRESETS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUserPresets(presets) {
  try {
    localStorage.setItem(USER_PRESETS_KEY, JSON.stringify(presets));
  } catch {
    /* quota exceeded */
  }
}

export function usePresets() {
  const [userPresets, setUserPresets] = useState(loadUserPresets);

  const allPresets = [...BUILT_IN_PRESETS, ...userPresets];

  const saveCurrentAsPreset = useCallback((name, configValues) => {
    const id = `user-${Date.now()}`;
    const preset = {
      id,
      name,
      icon: '★',
      values: { ...configValues },
    };
    setUserPresets((prev) => {
      const next = [...prev, preset].slice(-MAX_USER_PRESETS);
      saveUserPresets(next);
      return next;
    });
    return id;
  }, []);

  const deleteUserPreset = useCallback((id) => {
    setUserPresets((prev) => {
      const next = prev.filter((p) => p.id !== id);
      saveUserPresets(next);
      return next;
    });
  }, []);

  return { allPresets, userPresets, saveCurrentAsPreset, deleteUserPreset };
}
