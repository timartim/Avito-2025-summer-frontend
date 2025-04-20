// src/Constants/appConstants.ts

/**
 * Ключ для хранения черновиков задач в localStorage.
 */
export const TASK_DRAFTS_KEY = 'taskDialogDrafts';

/**
 * Ключ для хранения выбранной темы приложения в localStorage.
 */
export const APP_THEME_KEY = 'appTheme';

/**
 * Возможные режимы темы оформления приложения.
 */
export const ThemeModes = {
   /** Следовать системным настройкам ОС */
   System: 'system' as const,
   /** Светлая тема */
   Light: 'light' as const,
   /** Тёмная тема */
   Dark: 'dark' as const,
};

/**
 * Тип режима темы приложения, один из значений ThemeModes.
 */
export type ThemeMode = typeof ThemeModes[keyof typeof ThemeModes];
