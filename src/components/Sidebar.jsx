/* ========================================
   Sidebar — Left panel: header + sections
   + export. Desktop: sticky. Mobile: overlay.
   ======================================== */

import React from 'react';
import { SidebarHeader } from './SidebarHeader.jsx';
import { ContentSection } from './ContentSection.jsx';
import { AppearanceSection } from './AppearanceSection.jsx';
import { TypographySection } from './TypographySection.jsx';
import { LayoutSection } from './LayoutSection.jsx';
import { PresetBar } from './PresetBar.jsx';
import { ExportButton } from './ExportButton.jsx';

const CollapsibleSection = React.memo(function CollapsibleSection({ title, defaultOpen = true, children }) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isOpen ? 'var(--space-4)' : '0' }}>
      <button
        className="cf-section-header"
        onClick={() => setIsOpen((o) => !o)}
        aria-expanded={isOpen}
      >
        <span className="cf-section-title">{title}</span>
        <svg
          width="12" height="12" viewBox="0 0 12 12"
          fill="none"
          stroke="hsl(var(--muted-foreground) / 0.6)"
          strokeWidth="1.5" strokeLinecap="round"
          style={{
            transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform var(--duration-normal) var(--ease-out)',
          }}
        >
          <path d="M4 2L8 6L4 10" />
        </svg>
      </button>
      {isOpen && (
        <div style={{ padding: '0 0 var(--space-2)' }}>
          {children}
        </div>
      )}
    </div>
  );
});

const SidebarContent = React.memo(function SidebarContent({
  config, dispatch, canUndo, canRedo, undoCount, redoCount,
  onUndo, onRedo, isProcessing, onExport, onApplyPreset, onMobileClose,
}) {
  return (
    <>
      <SidebarHeader
        canUndo={canUndo}
        canRedo={canRedo}
        undoCount={undoCount}
        redoCount={redoCount}
        onUndo={onUndo}
        onRedo={onRedo}
        onMobileClose={onMobileClose}
      />

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: 'var(--space-5)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
      }}>
        <PresetBar currentValues={config} onApply={onApplyPreset} />
        <hr className="cf-divider" />

        <CollapsibleSection title="Content">
          <ContentSection title={config.title} subtitle={config.subtitle} dispatch={dispatch} />
        </CollapsibleSection>
        <hr className="cf-divider" />

        <CollapsibleSection title="Appearance">
          <AppearanceSection
            bgType={config.bgType} bgColor={config.bgColor} bgImage={config.bgImage}
            themeColor={config.themeColor} textColor={config.textColor}
            blur={config.blur} brightness={config.brightness}
            dispatch={dispatch}
          />
        </CollapsibleSection>
        <hr className="cf-divider" />

        <CollapsibleSection title="Typography">
          <TypographySection
            fontFamily={config.fontFamily} fontSize={config.fontSize}
            customFontName={config.customFontName} dispatch={dispatch}
          />
        </CollapsibleSection>
        <hr className="cf-divider" />

        <CollapsibleSection title="Layout">
          <LayoutSection
            alignment={config.alignment} showDecorations={config.showDecorations}
            dispatch={dispatch}
          />
        </CollapsibleSection>
      </div>

      <div
        className="cf-sidebar-export"
        style={{
          padding: 'var(--space-4) var(--space-5)',
          borderTop: '1px solid hsl(var(--border))',
          background: 'hsl(var(--card))',
          flexShrink: 0,
        }}
      >
        <ExportButton isProcessing={isProcessing} onExport={onExport} />
      </div>
    </>
  );
});

export const Sidebar = React.memo(function Sidebar({
  config, dispatch,
  canUndo, canRedo, undoCount, redoCount,
  onUndo, onRedo,
  isProcessing, onExport, onApplyPreset,
  isMobileOpen, onMobileClose,
}) {
  const sharedProps = {
    config, dispatch,
    canUndo, canRedo, undoCount, redoCount,
    onUndo, onRedo,
    isProcessing, onExport, onApplyPreset,
  };

  return (
    <>
      {/* Desktop sidebar — visibility via CSS class */}
      <aside
        className="cf-sidebar-desktop"
        style={{
          width: 'var(--sidebar-width)',
          height: '100vh',
          position: 'sticky',
          top: 0,
          flexDirection: 'column',
          background: 'hsl(var(--background))',
          borderRight: '1px solid hsl(var(--border))',
          zIndex: 'var(--z-sticky)',
          overflow: 'hidden',
        }}
      >
        <SidebarContent {...sharedProps} />
      </aside>

      {/* Mobile sidebar (overlay) — visibility via CSS class */}
      <aside
        className={`cf-sidebar--mobile ${isMobileOpen ? 'cf-sidebar--open' : ''}`}
        style={{
          flexDirection: 'column',
          background: 'hsl(var(--background))',
          borderRight: '1px solid hsl(var(--border))',
          boxShadow: isMobileOpen ? 'var(--shadow-xl)' : 'none',
          height: '100dvh',
        }}
      >
        <SidebarContent {...sharedProps} onMobileClose={onMobileClose} />
      </aside>
    </>
  );
});
