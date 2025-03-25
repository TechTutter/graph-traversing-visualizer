export const LocaleList = ['en', 'it'] as const;
export type Locale = (typeof LocaleList)[number];
