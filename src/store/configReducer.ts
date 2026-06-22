/* ========================================
   CoverForge Config Reducer
   Central state transitions. Every action
   is an undo/redo-able state mutation.
   ======================================== */

import type { CoverConfig, ConfigAction } from '../types';
import { DEFAULT_CONFIG } from './constants';

export const ActionTypes = {
  SET_TITLE:            'SET_TITLE',
  SET_SUBTITLE:         'SET_SUBTITLE',
  SET_BG_TYPE:          'SET_BG_TYPE',
  SET_BG_COLOR:         'SET_BG_COLOR',
  SET_BG_IMAGE:         'SET_BG_IMAGE',
  SET_THEME_COLOR:      'SET_THEME_COLOR',
  SET_TEXT_COLOR:       'SET_TEXT_COLOR',
  SET_BLUR:             'SET_BLUR',
  SET_BRIGHTNESS:       'SET_BRIGHTNESS',
  SET_FONT_FAMILY:      'SET_FONT_FAMILY',
  SET_FONT_SIZE:        'SET_FONT_SIZE',
  SET_ALIGNMENT:        'SET_ALIGNMENT',
  TOGGLE_DECORATIONS:   'TOGGLE_DECORATIONS',
  SET_CUSTOM_FONT_NAME: 'SET_CUSTOM_FONT_NAME',
  LOAD_PRESET:           'LOAD_PRESET',
  RESTORE_STATE:         'RESTORE_STATE',
} as const;

export function configReducer(state: CoverConfig, action: ConfigAction): CoverConfig {
  switch (action.type) {
    case ActionTypes.SET_TITLE:
      return { ...state, title: action.payload };

    case ActionTypes.SET_SUBTITLE:
      return { ...state, subtitle: action.payload };

    case ActionTypes.SET_BG_TYPE:
      return { ...state, bgType: action.payload };

    case ActionTypes.SET_BG_COLOR:
      return { ...state, bgColor: action.payload };

    case ActionTypes.SET_BG_IMAGE:
      return { ...state, bgImage: action.payload };

    case ActionTypes.SET_THEME_COLOR:
      return { ...state, themeColor: action.payload };

    case ActionTypes.SET_TEXT_COLOR:
      return { ...state, textColor: action.payload };

    case ActionTypes.SET_BLUR:
      return { ...state, blur: Number(action.payload) };

    case ActionTypes.SET_BRIGHTNESS:
      return { ...state, brightness: Number(action.payload) };

    case ActionTypes.SET_FONT_FAMILY:
      return { ...state, fontFamily: action.payload };

    case ActionTypes.SET_FONT_SIZE:
      return { ...state, fontSize: Number(action.payload) };

    case ActionTypes.SET_ALIGNMENT:
      return { ...state, alignment: action.payload };

    case ActionTypes.TOGGLE_DECORATIONS:
      return { ...state, showDecorations: !state.showDecorations };

    case ActionTypes.SET_CUSTOM_FONT_NAME:
      return { ...state, customFontName: action.payload };

    case ActionTypes.LOAD_PRESET:
      return { ...state, ...action.payload };

    case ActionTypes.RESTORE_STATE:
      return { ...state, ...action.payload };

    default:
      return state;
  }
}

export function getInitialConfig(): CoverConfig {
  return { ...DEFAULT_CONFIG, customFontName: null };
}
