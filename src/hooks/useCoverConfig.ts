/* ========================================
   useCoverConfig — Main state orchestration hook.
   Composes: reducer + history + autosave.
   The single hook consumed by App.tsx.
   ======================================== */

import type { CoverConfig, ConfigAction } from '../types';
import { configReducer, getInitialConfig } from '../store/configReducer';
import { useHistory } from './useHistory';
import { useAutosave } from './useAutosave';

export interface CoverConfigAPI {
  config: CoverConfig;
  dispatch: (action: ConfigAction) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  undoCount: number;
  redoCount: number;
  showRestorePrompt: boolean;
  restore: () => CoverConfig | null;
  dismissRestore: () => void;
}

export function useCoverConfig(): CoverConfigAPI {
  const {
    state: config,
    dispatch,
    undo,
    redo,
    canUndo,
    canRedo,
    undoCount,
    redoCount,
    clearHistory,
  } = useHistory<CoverConfig, ConfigAction>(configReducer, getInitialConfig, undefined);

  const { showRestorePrompt, restore, dismissRestore } = useAutosave(config, clearHistory);

  return {
    config,
    dispatch,
    undo,
    redo,
    canUndo,
    canRedo,
    undoCount,
    redoCount,
    showRestorePrompt,
    restore,
    dismissRestore,
  };
}
