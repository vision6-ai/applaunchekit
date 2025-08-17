import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';
// Import your translation files
import en from '../locales/en.json';
import fr from '../locales/fr.json';
import ar_AE from '../locales/ar_AE.json';

// Function to format date and time based on locale
export const formatDateTime = (date: Date): string => {
  const locale = getLocales()[0].languageCode;
  return new Intl.DateTimeFormat(locale ?? 'en', {
    year: 'numeric',
    month: 'long', // 'numeric' for '10', 'short' for 'Oct', 'long' for 'October'
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: locale === 'en-US', // 12-hour format for US
  }).format(date);
};

export const formatCurrency = (amount: number): string => {
  const locale = getLocales()[0].languageCode;
  const currency = getLocales()[0].currencyCode || 'USD';
  return new Intl.NumberFormat(locale ?? 'en', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatLanguage = (language: string): string => {
  const displayNames = new Intl.DisplayNames([language], { type: 'language' });
  return displayNames.of(language) || language;
};

// Set the key-value pairs for the different languages you want to support.
const i18n = new I18n({
  en: { ...en },
  fr: { ...fr },
  ar_AE: { ...ar_AE },
});

// Set the locale once at the beginning of your app.
i18n.locale = getLocales()[0].languageCode ?? 'en';

// @ts-ignore
i18n.fallbacks = true;
// @ts-ignore
export const getTranslation = (key: any) => i18n.t(key);
