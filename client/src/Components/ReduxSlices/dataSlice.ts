// src/ReduxSlices/dataSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getBoards, Board } from '../Api/boardRequests';
import { getUsers } from '../Api/userRequests';
import { getTasks, TaskFull } from '../Api/taskRequests';
import { createTask as apiCreateTask, updateTask as apiUpdateTask } from '../Api/taskRequests';
import { RootState } from '../ReduxStore/store';

// —————————————————— Типы ——————————————————

export interface Assignee {
   id: number;
   fullName: string;
   email: string;
   avatarUrl: string;
}

export interface Notification {
   open: boolean;
   message: string;
   severity: 'success' | 'error' | 'info';
}

export interface TaskInput {
   id?: number;
   title: string;
   description: string;
   priority: string;
   status?: string;
   assigneeId: number;
   boardId: number;
}

// —————————————————— Async Thunks ——————————————————

export const fetchBoards = createAsyncThunk<Board[], void, { rejectValue: string }>(
   'data/fetchBoards',
   async (_, { rejectWithValue }) => {
      try {
         return await getBoards();
      } catch (err: any) {
         return rejectWithValue('Не удалось загрузить доски');
      }
   }
);

export const fetchUsers = createAsyncThunk<Assignee[], void, { rejectValue: string }>(
   'data/fetchUsers',
   async (_, { rejectWithValue }) => {
      try {
         return await getUsers();
      } catch (err: any) {
         return rejectWithValue('Не удалось загрузить пользователей');
      }
   }
);

export const fetchTasks = createAsyncThunk<TaskFull[], void, { rejectValue: string }>(
   'data/fetchTasks',
   async (_, { rejectWithValue }) => {
      try {
         return await getTasks();
      } catch (err: any) {
         return rejectWithValue('Не удалось загрузить задачи');
      }
   }
);

export const createTask = createAsyncThunk<TaskFull, TaskInput, { rejectValue: string }>(
   'data/createTask',
   async (input, { rejectWithValue, dispatch }) => {
      try {
         const result = await apiCreateTask(input);
         // опционально: после создания перезагрузить весь список
         await dispatch(fetchTasks());
         return result as TaskFull;
      } catch (err: any) {
         return rejectWithValue('Не удалось создать задачу');
      }
   }
);

export const updateTask = createAsyncThunk<TaskFull, TaskInput, { rejectValue: string }>(
   'data/updateTask',
   async (input, { rejectWithValue, dispatch }) => {
      try {
         const result = await apiUpdateTask(input.id!, input);
         // опционально: после обновления перезагрузить весь список
         await dispatch(fetchTasks());
         return result as TaskFull;
      } catch (err: any) {
         return rejectWithValue('Не удалось обновить задачу');
      }
   }
);

// —————————————————— State & Slice ——————————————————

interface DataState {
   boards: Board[];
   users: Assignee[];
   tasks: TaskFull[];
   isLoading: boolean;
   error: string | null;
   notification: Notification;
}

const initialState: DataState = {
   boards: [],
   users: [],
   tasks: [],
   isLoading: false,
   error: null,
   notification: { open: false, message: '', severity: 'info' },
};

const dataSlice = createSlice({
   name: 'data',
   initialState,
   reducers: {
      clearError(state) {
         state.error = null;
      },
      showNotification(state, action: PayloadAction<Omit<Notification, 'open'>>) {
         state.notification = { open: true, ...action.payload };
      },
      hideNotification(state) {
         state.notification.open = false;
      },
   },
   extraReducers: (builder) => {
      // fetchBoards
      builder.addCase(fetchBoards.pending, (state: RootState) => {
         state.isLoading = true;
         state.error = null;
      });
      builder.addCase(fetchBoards.fulfilled, (state: RootState, { payload }) => {
         state.boards = payload;
         state.isLoading = false;
         state.notification = { open: true, message: 'Доски загружены', severity: 'success' };
      });
      builder.addCase(fetchBoards.rejected, (state: RootState, { payload, error }) => {
         state.isLoading = false;
         state.error = payload ?? error.message ?? 'Ошибка';
         state.notification = { open: true, message: state.error!, severity: 'error' };
      });

      // fetchUsers
      builder.addCase(fetchUsers.pending, (state: RootState) => {
         state.isLoading = true;
         state.error = null;
      });
      builder.addCase(fetchUsers.fulfilled, (state: RootState, { payload }) => {
         state.users = payload;
         state.isLoading = false;
         state.notification = { open: true, message: 'Пользователи загружены', severity: 'success' };
      });
      builder.addCase(fetchUsers.rejected, (state: RootState, { payload, error }) => {
         state.isLoading = false;
         state.error = payload ?? error.message ?? 'Ошибка';
         state.notification = { open: true, message: state.error!, severity: 'error' };
      });

      // fetchTasks
      builder.addCase(fetchTasks.pending, (state: RootState) => {
         state.isLoading = true;
         state.error = null;
      });
      builder.addCase(fetchTasks.fulfilled, (state: RootState, { payload }) => {
         state.tasks = payload;
         state.isLoading = false;
         state.notification = { open: true, message: 'Задачи загружены', severity: 'success' };
      });
      builder.addCase(fetchTasks.rejected, (state: RootState, { payload, error }) => {
         state.isLoading = false;
         state.error = payload ?? error.message ?? 'Ошибка';
         state.notification = { open: true, message: state.error!, severity: 'error' };
      });

      // createTask
      builder.addCase(createTask.pending, (state: RootState) => {
         state.isLoading = true;
         state.error = null;
      });
      builder.addCase(createTask.fulfilled, (state: RootState, { payload }) => {
         state.tasks.push(payload);
         state.isLoading = false;
         state.notification = { open: true, message: 'Задача создана', severity: 'success' };
      });
      builder.addCase(createTask.rejected, (state: RootState, { payload, error }) => {
         state.isLoading = false;
         state.error = payload ?? error.message ?? 'Ошибка';
         state.notification = { open: true, message: state.error!, severity: 'error' };
      });

      // updateTask
      builder.addCase(updateTask.pending, (state: RootState) => {
         state.isLoading = true;
         state.error = null;
      });
      builder.addCase(updateTask.fulfilled, (state: RootState, { payload }) => {
         const idx = state.tasks.findIndex(t => t.id === payload.id);
         if (idx !== -1) state.tasks[idx] = payload;
         state.isLoading = false;
         state.notification = { open: true, message: 'Задача обновлена', severity: 'success' };
      });
      builder.addCase(updateTask.rejected, (state: RootState, { payload, error }) => {
         state.isLoading = false;
         state.error = payload ?? error.message ?? 'Ошибка';
         state.notification = { open: true, message: state.error!, severity: 'error' };
      });
   },
});

export const { clearError, showNotification, hideNotification } = dataSlice.actions;
export default dataSlice.reducer;

// —————————————————— Selectors ——————————————————

export const selectBoards       = (state: RootState) => state.data.boards;
export const selectUsers        = (state: RootState) => state.data.users;
export const selectTasks        = (state: RootState) => state.data.tasks;
export const selectLoading      = (state: RootState) => state.data.isLoading;
export const selectError        = (state: RootState) => state.data.error;
export const selectNotification = (state: RootState) => state.data.notification;
