/* ========================================
   App — Root component.
   Wires state, shortcuts, export, presets,
   responsive layout with mobile sidebar.
   ======================================== */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useCoverConfig } from '../hooks/useCoverConfig.js';
import { ActionTypes } from '../store/configReducer.js';
import { ALIGNMENT_KEYS } from '../store/constants.js';
import { Sidebar } from './Sidebar.jsx';
import { CanvasPreview } from './CanvasPreview.jsx';
import { KeyboardShortcutOverlay } from './KeyboardShortcutOverlay.jsx';
import { ExportButton } from './ExportButton.jsx';

export default function App() {
  const {
    config, dispatch,
    undo, redo, canUndo, canRedo, undoCount, redoCount,
    showRestorePrompt, restore, dismissRestore,
  } = useCoverConfig();

  const [isProcessing, setIsProcessing] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const previewRef = useRef(null);
  const processingRef = useRef(false);
  const configRef = useRef(config);
  configRef.current = config;

  /* ===== Keyboard Shortcuts ===== */
  useEffect(() => {
    function handleKeyDown(e) {
      const ctrlOrMeta = e.metaKey || e.ctrlKey;
      const shift = e.shiftKey;
      const key = e.key.toLowerCase();

      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (!ctrlOrMeta && key === '?') {
        e.preventDefault();
        setShowShortcuts((s) => !s);
        return;
      }
      if (key === 'escape') {
        setShowShortcuts(false);
        setSidebarOpen(false);
        return;
      }
      if (ctrlOrMeta && !shift && key === 'e') {
        e.preventDefault();
        if (!processingRef.current) handleExport();
        return;
      }
      if (ctrlOrMeta && !shift && key === 'z') {
        e.preventDefault();
        undo();
        return;
      }
      if (ctrlOrMeta && shift && key === 'z') {
        e.preventDefault();
        redo();
        return;
      }
      if (ctrlOrMeta && !shift && key === 'd') {
        e.preventDefault();
        dispatch({ type: ActionTypes.TOGGLE_DECORATIONS });
        return;
      }
      if (ctrlOrMeta && !shift && key === 'b') {
        e.preventDefault();
        dispatch({
          type: ActionTypes.SET_BG_TYPE,
          payload: configRef.current.bgType === 'color' ? 'image' : 'color',
        });
        return;
      }
      if (!ctrlOrMeta && !shift && key >= '1' && key <= '9') {
        const idx = parseInt(key, 10) - 1;
        if (idx < ALIGNMENT_KEYS.length) {
          e.preventDefault();
          dispatch({ type: ActionTypes.SET_ALIGNMENT, payload: ALIGNMENT_KEYS[idx] });
        }
        return;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, undo, redo]);

  /* ===== Export (uses ref for stable callback) ===== */
  const handleExport = useCallback(async () => {
    if (!previewRef.current || processingRef.current) return;
    const cfg = configRef.current;

    processingRef.current = true;
    setIsProcessing(true);

    const originalBgImage = cfg.bgImage;
    const originalBlur = cfg.blur;
    const originalBrightness = cfg.brightness;

    try {
      if (cfg.bgType === 'image' && cfg.bgImage && (cfg.blur > 0 || cfg.brightness !== 100)) {
        const processed = await processImageWithFilters(cfg.bgImage, cfg.blur, cfg.brightness);
        dispatch({ type: ActionTypes.SET_BG_IMAGE, payload: processed });
        dispatch({ type: ActionTypes.SET_BLUR, payload: 0 });
        dispatch({ type: ActionTypes.SET_BRIGHTNESS, payload: 100 });
        await new Promise((r) => setTimeout(r, 200));
      }

      const html2canvas = (await import('html2canvas-pro')).default;
      const canvas = await html2canvas(previewRef.current, {
        scale: 1.5,
        useCORS: true,
        allowTaint: false,
        backgroundColor: cfg.bgColor,
        logging: false,
        imageTimeout: 0,
      });

      const link = document.createElement('a');
      link.download = `CoverForge_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
      alert('Export failed. Please try again.');
    } finally {
      dispatch({ type: ActionTypes.SET_BG_IMAGE, payload: originalBgImage });
      dispatch({ type: ActionTypes.SET_BLUR, payload: originalBlur });
      dispatch({ type: ActionTypes.SET_BRIGHTNESS, payload: originalBrightness });
      processingRef.current = false;
      setIsProcessing(false);
    }
  }, [dispatch]);

  const handleApplyPreset = useCallback((values) => {
    dispatch({ type: ActionTypes.LOAD_PRESET, payload: values });
  }, [dispatch]);

  const handleRestore = useCallback(() => {
    const saved = restore();
    if (saved) {
      dispatch({ type: ActionTypes.RESTORE_STATE, payload: saved });
    }
  }, [restore, dispatch]);

  const toggleSidebar = useCallback(() => setSidebarOpen((o) => !o), []);

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'hsl(var(--secondary))',
      fontFamily: 'var(--font-sans)',
    }}>
      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div className="cf-sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <Sidebar
        config={config}
        dispatch={dispatch}
        canUndo={canUndo}
        canRedo={canRedo}
        undoCount={undoCount}
        redoCount={redoCount}
        onUndo={undo}
        onRedo={redo}
        isProcessing={isProcessing}
        onExport={handleExport}
        onApplyPreset={handleApplyPreset}
        isMobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />

      {/* Main area */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: 'clamp(1rem, 3vw, var(--space-12)) clamp(0.75rem, 4vw, var(--space-16))',
        minHeight: '100vh',
        overflowY: 'auto',
      }}>
        {/* Top bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'clamp(1rem, 2vw, var(--space-6))',
          flexWrap: 'wrap',
          gap: 'var(--space-3)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <button className="cf-hamburger" onClick={toggleSidebar} aria-label="Toggle sidebar">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M3 5h12M3 9h12M3 13h12" />
              </svg>
            </button>
            <h2 style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-semibold)',
              color: 'hsl(var(--foreground))',
              letterSpacing: 'var(--tracking-tight)',
            }}>
              Preview
            </h2>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-4)',
            fontSize: 'var(--text-xs)',
            color: 'hsl(var(--muted-foreground) / 0.6)',
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>1280 × 720</span>
            <div className="cf-status">
              <div className={`cf-status-dot ${isProcessing ? 'cf-status-dot--processing' : 'cf-status-dot--ready'}`} />
            </div>
            <button
              onClick={() => setShowShortcuts(true)}
              className="cf-btn--icon"
              title="Keyboard shortcuts (?)"
              aria-label="Show keyboard shortcuts"
            >
              ?
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: '100%',
        }}>
          <CanvasPreview
            bgType={config.bgType}
            bgColor={config.bgColor}
            bgImage={config.bgImage}
            blur={config.blur}
            brightness={config.brightness}
            themeColor={config.themeColor}
            textColor={config.textColor}
            title={config.title}
            subtitle={config.subtitle}
            fontFamily={config.fontFamily}
            fontSize={config.fontSize}
            alignment={config.alignment}
            showDecorations={config.showDecorations}
            previewRef={previewRef}
          />
        </div>
      </main>

      {/* Floating export bar (mobile only) */}
      <div className="cf-floating-export">
        <ExportButton isProcessing={isProcessing} onExport={handleExport} />
      </div>

      <KeyboardShortcutOverlay
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />

      {showRestorePrompt && (
        <div className="cf-toast">
          <span>Previous session found.</span>
          <button onClick={handleRestore} style={{
            background: 'hsl(var(--primary))',
            color: 'hsl(var(--primary-foreground))',
            border: 'none',
            padding: '4px 12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--font-semibold)',
            cursor: 'pointer',
          }}>
            Restore
          </button>
          <button onClick={dismissRestore} style={{
            background: 'transparent',
            border: 'none',
            color: 'hsl(var(--muted-foreground) / 0.6)',
            padding: 0,
            cursor: 'pointer',
            fontSize: 14,
            marginLeft: 'var(--space-1)',
          }}>
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

function processImageWithFilters(imgSrc, blur, brightness) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.filter = `blur(${blur * 2}px) brightness(${brightness}%)`;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/png'));
      } else {
        reject(new Error('Canvas context unavailable'));
      }
    };
    img.onerror = reject;
    img.src = imgSrc;
  });
}
