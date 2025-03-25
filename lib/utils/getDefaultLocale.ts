import { Locale, LocaleList } from '../models/Locale';

export const getDefaultLocale = (): Locale => {
  const locale = navigator.language.slice(0, 2);
  return LocaleList.includes(locale as Locale) ? (locale as Locale) : 'en';
};
