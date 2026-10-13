'use client';

import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/index.js';

const SUPPORTED = ['fr', 'en', 'es', 'it'];
const STORAGE_KEY = 'cosycasa_language';

/**
 * i18n est initialise de maniere synchrone en francais (voir i18n/index.js),
 * donc les enfants sont rendus immediatement, y compris cote serveur.
 * La detection de la langue (meme ordre qu'avant : ?lang= > localStorage >
 * navigateur) et sa persistance se font ici, apres montage, pour ne jamais
 * produire un HTML serveur different de l'hydratation client.
 */
export default function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let detected: string | null = null;
    try {
      const fromQuery = new URLSearchParams(window.location.search).get('lang');
      const fromStorage = window.localStorage.getItem(STORAGE_KEY);
      const fromNavigator = (navigator.language || '').slice(0, 2);
      detected = [fromQuery, fromStorage, fromNavigator]
        .map((v) => (v || '').toLowerCase().slice(0, 2))
        .find((v) => SUPPORTED.includes(v)) ?? null;
    } catch {
      detected = null;
    }
    if (detected && detected !== i18n.language) {
      i18n.changeLanguage(detected);
    }

    const persist = (lng: string) => {
      try { window.localStorage.setItem(STORAGE_KEY, lng); } catch { /* stockage indisponible */ }
    };
    i18n.on('languageChanged', persist);
    return () => { i18n.off('languageChanged', persist); };
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
