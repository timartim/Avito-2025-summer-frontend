// src/ReduxStore.ts

/**
 * Модуль конфигурации глобального Redux Store.
 *
 * Здесь с помощью Redux Toolkit создаётся хранилище состояния приложения,
 * объединяющее несколько срезов (slices):
 * - addEditDialog — управление состоянием диалогов создания/редактирования задач,
 * - data — общий срез для загрузки и хранения досок, задач и пользователей.
 *
 * Также экспортируются типы:
 * - RootState — тип всего состояния хранилища,
 * - AppDispatch — тип функции dispatch для использования в thunks и компонентах.
 */

import { configureStore } from '@reduxjs/toolkit';
import dataReducer from '../ReduxSlices/dataSlice.ts';

export const store = configureStore({
   reducer: {
      data: dataReducer,
   },
});

// Тип всего состояния Redux Store
export type RootState = ReturnType<typeof store.getState>;

// Тип функции dispatch для корректной типовой поддержки thunks
export type AppDispatch = typeof store.dispatch;
