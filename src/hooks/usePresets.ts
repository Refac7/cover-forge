/* ========================================
   usePresets — Built-in + persisted presets.
   ======================================== */

import { useState } from 'react';
import type { Preset } from '../types';
import { BUILT_IN_PRESETS, USER_PRESETS_KEY } from '../store/presets';

function loadUserPresets(): Preset[] {
  try {
    const raw = localStorage.getItem(USER_PRESETS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export interface PresetsAPI {
  allPresets: Preset[];
}

export function usePresets(): PresetsAPI {
  const [userPresets] = useState<Preset[]>(loadUserPresets);
  return { allPresets: [...BUILT_IN_PRESETS, ...userPresets] };
}
