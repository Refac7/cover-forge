/* ========================================
   useCoverConfig — Main state orchestration hook.
   Composes: reducer + history + autosave.
   The single hook consumed by App.jsx.
   ======================================== */

import { configReducer, getInitialConfig } from '../store/configReducer.js';
import { useHistory } from './useHistory.js';
import { useAutosave } from './useAutosave.js';

export function useCoverConfig() {
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
  } = useHistory(configReducer, getInitialConfig, undefined);

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
