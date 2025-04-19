export const TASK_DRAFTS_KEY = 'taskDialogDrafts';
export const APP_THEME_KEY = 'appTheme';

export const ThemeModes = {
   System: 'system' as const,
   Light: 'light' as const,
   Dark: 'dark' as const,
};
export type ThemeMode = typeof ThemeModes[keyof typeof ThemeModes];