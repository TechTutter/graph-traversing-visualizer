import { Theme } from '@lib/models';

export const getDefaultTheme = (): Theme => {
  const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)');
  if (darkThemeMq.matches) return 'dark';
  return 'light';
};
