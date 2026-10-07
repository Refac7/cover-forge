/* ========================================
   CoverForge i18n — Provider & hook
   Minimal runtime with localStorage persistence
   and browser-language detection.
   ======================================== */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  LOCALES,
  LOCALE_TAGS,
  MESSAGES,
  type Locale,
  type Messages,
  type TranslationKey,
} from './messages';

const STORAGE_KEY = 'coverforge-locale';

function lookup(dict: Messages, key: string): string | undefined {
  const value = key
    .split('.')
    .reduce<unknown>(
      (acc, part) => (acc == null ? undefined : (acc as Record<string, unknown>)[part]),
      dict,
    );
  return typeof value === 'string' ? value : undefined;
}

function detectLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored && (LOCALES as string[]).includes(stored)) return stored as Locale;
  const nav = (navigator.language || 'en').toLowerCase();
  if (nav.startsWith('zh')) return 'zh';
  return 'en';
}

type InterpolationVars = Record<string, string | number>;

export interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (key: TranslationKey, vars?: InterpolationVars) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = LOCALE_TAGS[locale];
    window.localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  const t = useCallback(
    (key: TranslationKey, vars?: InterpolationVars): string => {
      const raw = lookup(MESSAGES[locale], key) ?? lookup(MESSAGES.en, key) ?? key;
      if (!vars) return raw;
      return raw.replace(/\{(\w+)\}/g, (match, name: string) =>
        name in vars ? String(vars[name]) : match,
      );
    },
    [locale],
  );

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = t('meta.title');
  }, [t]);

  const setLocale = useCallback((next: Locale) => setLocaleState(next), []);
  const toggleLocale = useCallback(
    () => setLocaleState((current) => (current === 'en' ? 'zh' : 'en')),
    [],
  );

  const value = useMemo<I18nContextValue>(
    () => ({ locale, setLocale, toggleLocale, t }),
    [locale, setLocale, toggleLocale, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within an I18nProvider');
  return ctx;
}
