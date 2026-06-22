/* ========================================
   useHistory — Undo/redo stack around a reducer.
   Wraps dispatch to record state snapshots.
   Uses refs for stable callback references —
   dispatch, undo, redo never change identity
   so React.memo on child components works.
   Max depth: 50 entries.
   ======================================== */

import { useReducer, useCallback, useRef } from 'react';

const MAX_HISTORY = 50;

export function useHistory(reducer, initializer, initialArg) {
  const [state, rawDispatch] = useReducer(reducer, initialArg, initializer);

  const pastRef = useRef([]);
  const futureRef = useRef([]);
  /* Keep latest state in a ref so callbacks don't depend on state */
  const stateRef = useRef(state);
  stateRef.current = state;

  /* Also track undo/redo counts in state for reactivity */
  const countsRef = useRef({ undoCount: 0, redoCount: 0, canUndo: false, canRedo: false });

  /* Force re-render helper (for badge counts) */
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  function updateCounts() {
    countsRef.current = {
      undoCount: pastRef.current.length,
      redoCount: futureRef.current.length,
      canUndo: pastRef.current.length > 0,
      canRedo: futureRef.current.length > 0,
    };
  }

  /* Stable dispatch — never changes */
  const dispatch = useCallback((action) => {
    pastRef.current = [...pastRef.current, stateRef.current].slice(-MAX_HISTORY);
    futureRef.current = [];
    rawDispatch(action);
    updateCounts();
    forceUpdate();
  }, []);

  /* Stable undo — never changes */
  const undo = useCallback(() => {
    if (pastRef.current.length === 0) return;
    const previous = pastRef.current[pastRef.current.length - 1];
    pastRef.current = pastRef.current.slice(0, -1);
    futureRef.current = [...futureRef.current, stateRef.current].slice(-MAX_HISTORY);
    rawDispatch({ type: 'RESTORE_STATE', payload: previous });
    updateCounts();
    forceUpdate();
  }, []);

  /* Stable redo — never changes */
  const redo = useCallback(() => {
    if (futureRef.current.length === 0) return;
    const next = futureRef.current[futureRef.current.length - 1];
    futureRef.current = futureRef.current.slice(0, -1);
    pastRef.current = [...pastRef.current, stateRef.current].slice(-MAX_HISTORY);
    rawDispatch({ type: 'RESTORE_STATE', payload: next });
    updateCounts();
    forceUpdate();
  }, []);

  const clearHistory = useCallback(() => {
    pastRef.current = [];
    futureRef.current = [];
    updateCounts();
    forceUpdate();
  }, []);

  return {
    state,
    dispatch,
    undo,
    redo,
    canUndo: countsRef.current.canUndo,
    canRedo: countsRef.current.canRedo,
    undoCount: countsRef.current.undoCount,
    redoCount: countsRef.current.redoCount,
    clearHistory,
  };
}
