"use client";

import type { Language, Translations } from '@/types';
import { translations as appTranslations } from '@/lib/translations';
import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof Translations, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const storedLanguage = localStorage.getItem('labourLensLanguage') as Language | null;
    if (storedLanguage && (storedLanguage === 'en' || storedLanguage === 'hi')) {
      setLanguageState(storedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('labourLensLanguage', lang);
  };

  const t = useCallback((key: keyof Translations, fallback?: string): string => {
    const translationSet = appTranslations[key];
    if (translationSet) {
      return translationSet[language] || translationSet['en'] || fallback || String(key);
    }
    return fallback || String(key);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
