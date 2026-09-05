/* ========================================
   CoverForge Constants
   Immutable configuration values.
   Alignment uses CSS property objects
   (not Tailwind classes — we removed it).
   ======================================== */

import type { CoverConfig, AlignmentKey, AlignmentCSS, FontOption } from '../types';

export const BASE_WIDTH = 1280;
export const BASE_HEIGHT = 720;

export const MIN_CANVAS_DIMENSION = 200;
export const MAX_CANVAS_DIMENSION = 7680;

/* Preset aspect ratios. Width/height are canonical resolutions. */
export interface AspectRatioOption {
  id: string;
  label: string;
  width: number;
  height: number;
}

export const ASPECT_RATIOS: AspectRatioOption[] = [
  { id: '16:9', label: '16:9', width: 1280, height: 720 },
  { id: '4:3',  label: '4:3',  width: 1280, height: 960 },
  { id: '3:2',  label: '3:2',  width: 1280, height: 853 },
  { id: '1:1',  label: '1:1',  width: 1080, height: 1080 },
  { id: '3:4',  label: '3:4',  width: 810,  height: 1080 },
  { id: '2:3',  label: '2:3',  width: 720,  height: 1080 },
  { id: '9:16', label: '9:16', width: 720,  height: 1280 },
  { id: '21:9', label: '21:9', width: 1680, height: 720 },
];

export const PRESET_FONTS: FontOption[] = [
  { name: 'System Sans', value: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif' },
  { name: 'System Mono', value: 'ui-monospace, "SF Mono", "Fira Code", monospace' },
  { name: 'Georgia Serif', value: 'Georgia, "Times New Roman", serif' },
  { name: 'Inter', value: '"Inter", system-ui, sans-serif' },
  { name: 'Impact', value: 'Impact, "Arial Black", sans-serif' },
  { name: 'Arial', value: 'Arial, Helvetica, sans-serif' },
];

/* Alignment as CSS flex property objects.
   Used inline (not className) since we removed Tailwind. */
export const ALIGNMENTS: Record<AlignmentKey, AlignmentCSS> = {
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
export const ALIGNMENT_KEYS: AlignmentKey[] = [
  'top-left', 'top-center', 'top-right',
  'center-left', 'center', 'center-right',
  'bottom-left', 'bottom-center', 'bottom-right',
];

export const ALIGNMENT_LABELS: Record<AlignmentKey, string> = {
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

export const DEFAULT_CONFIG: CoverConfig = {
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
  customFontName: null,
  canvasWidth: BASE_WIDTH,
  canvasHeight: BASE_HEIGHT,
};
