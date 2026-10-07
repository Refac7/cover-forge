/* ========================================
   CoverForge i18n — Messages
   Dependency-free translation dictionaries.
   English is the source of truth; every other
   locale must satisfy the `Messages` type.
   ======================================== */

export type Locale = 'en' | 'zh';

export const LOCALES: Locale[] = ['en', 'zh'];

export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  zh: '中文',
};

export const LOCALE_TAGS: Record<Locale, string> = {
  en: 'en',
  zh: 'zh-CN',
};

const en = {
  meta: {
    title: 'CoverForge — Cover Image Generator',
  },
  common: {
    appName: 'CoverForge',
    preview: 'Preview',
    export: 'Export PNG',
    processing: 'Processing...',
    restore: 'Restore',
    previousSession: 'Previous session found.',
    exportFailed: 'Export failed. Please try again.',
    close: 'Close',
    showShortcuts: 'Show keyboard shortcuts',
    shortcutsTitle: 'Keyboard Shortcuts',
  },
  theme: {
    auto: 'Auto',
    light: 'Light',
    dark: 'Dark',
    autoFull: 'Auto (follow system)',
    toggleLabel: 'Toggle theme',
    title: 'Theme: {current} — click for {next}',
  },
  language: {
    toggleLabel: 'Switch language',
  },
  sidebar: {
    toggle: 'Toggle sidebar',
    close: 'Close sidebar',
  },
  sections: {
    content: 'Content',
    appearance: 'Appearance',
    typography: 'Typography',
    layout: 'Layout',
    canvas: 'Canvas',
  },
  content: {
    title: 'Title',
    subtitle: 'Subtitle',
    titlePlaceholder: 'Enter cover title',
    subtitlePlaceholder: 'Optional subtitle',
  },
  appearance: {
    accent: 'Accent',
    text: 'Text',
    background: 'Background',
    solidColor: 'Solid Color',
    image: 'Image',
    uploadBackground: 'Upload Background Image',
    blur: 'Blur',
    brightness: 'Brightness',
  },
  typography: {
    typeface: 'Typeface',
    customUploaded: 'Custom Uploaded',
    uploadFont: 'Upload Font (.ttf, .otf, .woff, .woff2)',
    fontSize: 'Font Size',
  },
  layout: {
    alignment: 'Alignment',
    decorations: 'Typographic Marks',
  },
  canvas: {
    aspectRatio: 'Aspect Ratio',
    resolution: 'Resolution (px)',
    width: 'Canvas width',
    height: 'Canvas height',
  },
  presets: {
    apply: 'Apply "{name}" preset',
  },
  alignment: {
    group: 'Text alignment',
    topLeft: 'Top Left',
    topCenter: 'Top Center',
    topRight: 'Top Right',
    centerLeft: 'Center Left',
    center: 'Center',
    centerRight: 'Center Right',
    bottomLeft: 'Bottom Left',
    bottomCenter: 'Bottom Center',
    bottomRight: 'Bottom Right',
  },
  background: {
    alt: 'Background',
  },
  undo: {
    label: 'Undo',
    title: 'Undo (Ctrl+Z)',
  },
  redo: {
    label: 'Redo',
    title: 'Redo (Ctrl+Shift+Z)',
  },
  shortcuts: {
    export: 'Export PNG',
    undo: 'Undo',
    redo: 'Redo',
    toggleDecorations: 'Toggle decorations',
    toggleBackground: 'Toggle background type',
    setAlignment: 'Set text alignment',
    showShortcuts: 'Show shortcuts',
    closeOverlay: 'Close overlay',
  },
};

/* Widen literal string values so translations can differ. */
type DeepStringify<T> = {
  [K in keyof T]: T[K] extends object ? DeepStringify<T[K]> : string;
};

export type Messages = DeepStringify<typeof en>;

/* Union of all valid dot-separated translation keys. */
type DotPaths<T> = {
  [K in keyof T & string]: T[K] extends string ? K : `${K}.${DotPaths<T[K]>}`;
}[keyof T & string];

export type TranslationKey = DotPaths<Messages>;

const zh: Messages = {
  meta: {
    title: 'CoverForge — 封面图片生成器',
  },
  common: {
    appName: 'CoverForge',
    preview: '预览',
    export: '导出 PNG',
    processing: '处理中…',
    restore: '恢复',
    previousSession: '发现上次的会话。',
    exportFailed: '导出失败，请重试。',
    close: '关闭',
    showShortcuts: '查看键盘快捷键',
    shortcutsTitle: '键盘快捷键',
  },
  theme: {
    auto: '跟随系统',
    light: '浅色',
    dark: '深色',
    autoFull: '自动（跟随系统）',
    toggleLabel: '切换主题',
    title: '主题：{current} — 点击切换到{next}',
  },
  language: {
    toggleLabel: '切换语言',
  },
  sidebar: {
    toggle: '切换侧边栏',
    close: '关闭侧边栏',
  },
  sections: {
    content: '内容',
    appearance: '外观',
    typography: '排版',
    layout: '布局',
    canvas: '画布',
  },
  content: {
    title: '标题',
    subtitle: '副标题',
    titlePlaceholder: '输入封面标题',
    subtitlePlaceholder: '可选副标题',
  },
  appearance: {
    accent: '强调色',
    text: '文字',
    background: '背景',
    solidColor: '纯色',
    image: '图片',
    uploadBackground: '上传背景图片',
    blur: '模糊',
    brightness: '亮度',
  },
  typography: {
    typeface: '字体',
    customUploaded: '自定义上传',
    uploadFont: '上传字体（.ttf、.otf、.woff、.woff2）',
    fontSize: '字号',
  },
  layout: {
    alignment: '对齐',
    decorations: '排版装饰',
  },
  canvas: {
    aspectRatio: '宽高比',
    resolution: '分辨率（px）',
    width: '画布宽度',
    height: '画布高度',
  },
  presets: {
    apply: '应用“{name}”预设',
  },
  alignment: {
    group: '文字对齐',
    topLeft: '左上',
    topCenter: '上中',
    topRight: '右上',
    centerLeft: '左中',
    center: '居中',
    centerRight: '右中',
    bottomLeft: '左下',
    bottomCenter: '下中',
    bottomRight: '右下',
  },
  background: {
    alt: '背景',
  },
  undo: {
    label: '撤销',
    title: '撤销 (Ctrl+Z)',
  },
  redo: {
    label: '重做',
    title: '重做 (Ctrl+Shift+Z)',
  },
  shortcuts: {
    export: '导出 PNG',
    undo: '撤销',
    redo: '重做',
    toggleDecorations: '切换装饰',
    toggleBackground: '切换背景类型',
    setAlignment: '设置文字对齐',
    showShortcuts: '查看快捷键',
    closeOverlay: '关闭浮层',
  },
};

export const MESSAGES: Record<Locale, Messages> = { en, zh };
