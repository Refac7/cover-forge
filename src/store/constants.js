/* ========================================
   CoverForge Constants
   Immutable configuration values.
   Alignment uses CSS property objects
   (not Tailwind classes — we removed it).
   ======================================== */

export const BASE_WIDTH = 1280;
export const BASE_HEIGHT = 720;

export const PRESET_FONTS = [
  { name: 'System Sans', value: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif' },
  { name: 'System Mono', value: 'ui-monospace, "SF Mono", "Fira Code", monospace' },
  { name: 'Georgia Serif', value: 'Georgia, "Times New Roman", serif' },
  { name: 'Inter', value: '"Inter", system-ui, sans-serif' },
  { name: 'Impact', value: 'Impact, "Arial Black", sans-serif' },
  { name: 'Arial', value: 'Arial, Helvetica, sans-serif' },
];

/* Alignment as CSS flex property objects.
   Used inline (not className) since we removed Tailwind. */
export const ALIGNMENTS = {
  'top-left':      { justifyContent: 'flex-start', alignItems: 'flex-start' },
  'top-center':    { justifyContent: 'flex-start', alignItems: 'center'   },
  'top-right':     { justifyContent: 'flex-start', alignItems: 'flex-end'  },
  'center-left':   { justifyContent: 'center',     alignItems: 'flex-start' },
  'center':        { justifyContent: 'center',     alignItems: 'center'    },
  'center-right':  { justifyContent: 'center',     alignItems: 'flex-end'   },
  'bottom-left':   { justifyContent: 'flex-end',   alignItems: 'flex-start' },
  'bottom-center': { justifyContent: 'flex-end',   alignItems: 'center'    },
  'bottom-right':  { justifyContent: 'flex-end',   alignItems: 'flex-end'   },
};

/* Ordered array for grid rendering and keyboard 1-9 shortcuts */
export const ALIGNMENT_KEYS = [
  'top-left', 'top-center', 'top-right',
  'center-left', 'center', 'center-right',
  'bottom-left', 'bottom-center', 'bottom-right',
];

export const ALIGNMENT_LABELS = {
  'top-left':      'Top Left',
  'top-center':    'Top Center',
  'top-right':     'Top Right',
  'center-left':   'Center Left',
  'center':        'Center',
  'center-right':  'Center Right',
  'bottom-left':   'Bottom Left',
  'bottom-center': 'Bottom Center',
  'bottom-right':  'Bottom Right',
};

export const DEFAULT_CONFIG = {
  title: 'Design is Intentional',
  subtitle: 'Every pixel tells a story. Every decision has purpose.',
  bgType: 'color',
  bgColor: '#0a0a0a',
  bgImage: null,
  themeColor: '#4f46e5',
  textColor: '#ffffff',
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
  alignment: 'center',
  blur: 0,
  brightness: 100,
  fontSize: 84,
  showDecorations: true,
};
