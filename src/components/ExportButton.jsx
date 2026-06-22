/* ========================================
   ExportButton — Primary CTA with lazy
   html2canvas import for smaller bundle.
   Shows processing state with spinner.
   ======================================== */

import React from 'react';

export const ExportButton = React.memo(function ExportButton({ isProcessing, onExport }) {
  return (
    <button
      onClick={onExport}
      disabled={isProcessing}
      className="cf-btn cf-btn--primary"
      style={{
        width: '100%',
        padding: 'var(--space-3) var(--space-5)',
        fontSize: 'var(--text-sm)',
      }}
    >
      {isProcessing ? (
        <>
          <span style={{
            width: 14,
            height: 14,
            border: '2px solid rgba(255,255,255,0.3)',
            borderTopColor: '#fff',
            borderRadius: 'var(--radius-full)',
            animation: 'cf-spin 0.6s linear infinite',
          }} />
          Processing...
        </>
      ) : (
        <>
          Export PNG
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 2v10M4 8l4 4 4-4M2 14h12" />
          </svg>
        </>
      )}
    </button>
  );
});

