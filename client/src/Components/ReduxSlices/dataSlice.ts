// src/ReduxSlices/dataSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getBoards, Board, getBoardTasks} from '../Api/boardRequests';
import {Task} from '../Dialogs/TaskDialog.tsx'
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
   async (input, { rejectWithValue }) => {
      try {
         const result = await apiCreateTask(input);
         console.log(result)
         return {
            id: result.id,
            title: input.title,
            description: input.description,
            priority: input.priority,
            status: input.status ?? 'Backlog',
            assigneeId: input.assigneeId,
            boardId: input.boardId,
            assignee: { id: input.assigneeId, fullName: '', email: '', avatarUrl: '' },
            boardName: input.boardName,
         } as TaskFull;
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
         input.assignee = {id: input.assigneeId}
         return input;
      } catch (err: any) {
         return rejectWithValue('Не удалось обновить задачу');
      }
   }
);

export const fetchBoardTasks = createAsyncThunk<
   TaskFull[],
   number,               // payload—это boardId
   { rejectValue: string }
>(
   'data/fetchBoardTasks',
   async (boardId, { rejectWithValue }) => {
      try {

         return await getBoardTasks(boardId);
      } catch (err: any) {
         console.error('fetchBoardTasks error', err);
         return rejectWithValue('Не удалось загрузить задачи доски');
      }
   }
);

// —————————————————— State & Slice ——————————————————

interface DataState {
   boards: Board[];
   users: Assignee[];
   tasks: TaskFull[];
   boardTasks: TaskFull[];
   isLoading: boolean;
   error: string | null;
   notification: Notification;
}

const initialState: DataState = {
   boards: [],
   users: [],
   tasks: [],
   isLoading: false,
   boardTasks: [],
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
         console.log('PAYLOAD')
         console.log(payload)
         state.tasks.push(payload);
         if(payload.boardId == state.currentBoardId){
            state.boardTasks.push(payload)
         }
         state.isLoading = false;
         state.notification = {
            open: true,
            message: 'Задача создана',
            severity: 'success',
         };
      });
      builder.addCase(createTask.rejected, (state: RootState, { payload, error }) => {
         state.isLoading = false;
         state.error = payload ?? error.message ?? 'Ошибка';
         state.notification = {
            open: true,
            message: state.error!,
            severity: 'error',
         };
      });

      // updateTask
      builder.addCase(updateTask.pending, (state: RootState) => {
         state.isLoading = true;
         state.error = null;
      });
      builder.addCase(updateTask.fulfilled, (state: RootState, { payload }) => {
         console.log(payload)
         const idx = state.tasks.findIndex(t => t.id === payload.id);
         const boardIdx = state.boardTasks.findIndex(t => t.id === payload.id)
         if (idx !== -1) state.tasks[idx] = payload;
         if (boardIdx !== -1) state.boardTasks[boardIdx] = payload;
         state.isLoading = false;
         state.notification = { open: true, message: 'Задача обновлена', severity: 'success' };
      });
      builder.addCase(updateTask.rejected, (state: RootState, { payload, error }) => {
         state.isLoading = false;
         state.error = payload ?? error.message ?? 'Ошибка';
         state.notification = { open: true, message: state.error!, severity: 'error' };
      });
      // — fetchBoardTasks
      builder.addCase(fetchBoardTasks.pending, (state: RootState) => {
         state.isLoading = true;
         state.error = null;
      });
      builder.addCase(fetchBoardTasks.fulfilled, (state: RootState, { payload, meta }) => {
         state.boardTasks = payload;
         state.currentBoardId = meta.arg;     // сохраняем id той доски
         state.isLoading = false;
      });
      builder.addCase(fetchBoardTasks.rejected, (state: RootState, { payload, error }) => {
         state.isLoading = false;
         state.error = payload ?? error.message ?? 'Ошибка';
         state.notification = {
            open: true,
            message: state.error!,
            severity: 'error'
         };
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
export const selectBoardTasks     = (state: RootState) => state.data.boardTasks;
export const selectCurrentBoard  = (state: RootState) => state.data.currentBoardId;
