/* ========================================
   usePresets — Built-in + user preset CRUD.
   User presets stored in localStorage.
   ======================================== */

import { useState, useCallback } from 'react';
import type { CoverConfig, Preset } from '../types';
import { BUILT_IN_PRESETS, USER_PRESETS_KEY, MAX_USER_PRESETS } from '../store/presets';

function loadUserPresets(): Preset[] {
  try {
    const raw = localStorage.getItem(USER_PRESETS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUserPresets(presets: Preset[]): void {
  try {
    localStorage.setItem(USER_PRESETS_KEY, JSON.stringify(presets));
  } catch {
    /* quota exceeded */
  }
}

export interface PresetsAPI {
  allPresets: Preset[];
  userPresets: Preset[];
  saveCurrentAsPreset: (name: string, configValues: CoverConfig) => string;
  deleteUserPreset: (id: string) => void;
}

export function usePresets(): PresetsAPI {
  const [userPresets, setUserPresets] = useState<Preset[]>(loadUserPresets);

  const allPresets = [...BUILT_IN_PRESETS, ...userPresets];

  const saveCurrentAsPreset = useCallback((name: string, configValues: CoverConfig): string => {
    const id = `user-${Date.now()}`;
    const preset: Preset = {
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

  const deleteUserPreset = useCallback((id: string) => {
    setUserPresets((prev) => {
      const next = prev.filter((p) => p.id !== id);
      saveUserPresets(next);
      return next;
    });
  }, []);

  return { allPresets, userPresets, saveCurrentAsPreset, deleteUserPreset };
}
