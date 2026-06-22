/* ========================================
   CoverForge Type Definitions
   Central types shared across the project.
   ======================================== */

/* ---- Cover Config State ---- */
export interface CoverConfig {
  title: string;
  subtitle: string;
  bgType: 'color' | 'image';
  bgColor: string;
  bgImage: string | null;
  themeColor: string;
  textColor: string;
  fontFamily: string;
  alignment: string;
  blur: number;
  brightness: number;
  fontSize: number;
  showDecorations: boolean;
  customFontName: string | null;
}

/* ---- Reducer Actions ---- */
export type ConfigAction =
  | { type: 'SET_TITLE'; payload: string }
  | { type: 'SET_SUBTITLE'; payload: string }
  | { type: 'SET_BG_TYPE'; payload: 'color' | 'image' }
  | { type: 'SET_BG_COLOR'; payload: string }
  | { type: 'SET_BG_IMAGE'; payload: string | null }
  | { type: 'SET_THEME_COLOR'; payload: string }
  | { type: 'SET_TEXT_COLOR'; payload: string }
  | { type: 'SET_BLUR'; payload: number }
  | { type: 'SET_BRIGHTNESS'; payload: number }
  | { type: 'SET_FONT_FAMILY'; payload: string }
  | { type: 'SET_FONT_SIZE'; payload: number }
  | { type: 'SET_ALIGNMENT'; payload: string }
  | { type: 'SET_CUSTOM_FONT_NAME'; payload: string }
  | { type: 'TOGGLE_DECORATIONS' }
  | { type: 'LOAD_PRESET'; payload: Partial<CoverConfig> }
  | { type: 'RESTORE_STATE'; payload: Partial<CoverConfig> };

/* ---- Alignment ---- */
export type AlignmentKey =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface AlignmentCSS {
  justifyContent: string;
  alignItems: string;
}

/* ---- Presets ---- */
export interface PresetValues extends Partial<CoverConfig> {}

export interface Preset {
  id: string;
  name: string;
  icon: string;
  values: PresetValues;
}

/* ---- Font ---- */
export interface FontOption {
  name: string;
  value: string;
}
