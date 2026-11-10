"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { translations, type Locale, type TranslationKey } from "@/constants/translations";

type TranslationValues = Record<string, string | number>;

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, values?: TranslationValues) => string;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);
const STORAGE_KEY = "taiwanmobile-locale";

function isLocale(value: string | null): value is Locale {
  return value === "zh-TW" || value === "id";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("zh-TW");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedLocale = window.localStorage.getItem(STORAGE_KEY);
      if (isLocale(savedLocale)) setLocale(savedLocale);
    } catch {
      // Keep the default locale if browser storage is unavailable.
    }
    setIsHydrated(true);
  }, []);

  const t = useCallback((key: TranslationKey, values: TranslationValues = {}) => {
    const message = translations[locale][key];
    return message.replace(/\{(\w+)\}/g, (placeholder, name: string) => String(values[name] ?? placeholder));
  }, [locale]);

  useEffect(() => {
    if (!isHydrated) return;

    try {
      window.localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // Language selection still works for the current page without browser storage.
    }

    document.documentElement.lang = locale;
    document.title = t("documentTitle");
    document.querySelector('meta[name="description"]')?.setAttribute("content", t("documentDescription"));
  }, [isHydrated, locale, t]);

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
