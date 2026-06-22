/* ========================================
   FileUpload — Drag-and-drop + click upload zone.
   Memo-friendly: label, accept, onChange.
   ======================================== */

import React, { useState, useCallback, useRef } from 'react';

interface FileUploadProps {
  label: string;
  accept: string;
  onChange: (e: { target: { files: File[] } }) => void;
}

export const FileUpload = React.memo(function FileUpload({
  label,
  accept,
  onChange,
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) onChange({ target: { files: [file] } });
  }, [onChange]);

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  return (
    <label
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: 'var(--space-3)',
        background: isDragOver ? 'hsl(var(--primary) / 0.1)' : 'hsl(var(--secondary))',
        border: `1px dashed ${isDragOver ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        transition:
          'border-color var(--duration-fast) var(--ease-out), background var(--duration-fast) var(--ease-out)',
      }}
    >
      <span style={{
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--font-medium)',
        color: 'hsl(var(--muted-foreground))',
      }}>
        {label}
      </span>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={onChange}
      />
    </label>
  );
});
