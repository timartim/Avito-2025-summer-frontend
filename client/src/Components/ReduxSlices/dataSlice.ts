// src/ReduxSlices/dataSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getBoards, getBoardTasks } from '../Api/boardRequests';
import { getUsers } from '../Api/userRequests';
import { getTasks } from '../Api/taskRequests';
import { createTask as apiCreateTask, updateTaskStatus as apiUpdateTaskStatus } from '../Api/taskRequests';
import { RootState } from '../ReduxStore/store';
import { Assignee, Board, Status, Task } from '../../Interfaces/appInterfaces.ts';


// —————————————————— Async Thunks ——————————————————

export const fetchBoards = createAsyncThunk<Board[], void, { rejectValue: string }>(
   'data/fetchBoards',
   async (_, { rejectWithValue }) => {
      try {
         return await getBoards();
      } catch (err: any) {
         return rejectWithValue('Не удалось загрузить доски');
      }
   },
);

export const fetchUsers = createAsyncThunk<Assignee[], void, { rejectValue: string }>(
   'data/fetchUsers',
   async (_, { rejectWithValue }) => {
      try {
         return await getUsers();
      } catch (err: any) {
         return rejectWithValue('Не удалось загрузить пользователей');
      }
   },
);

export const fetchTasks = createAsyncThunk<Task[], void, { rejectValue: string }>(
   'data/fetchTasks',
   async (_, { rejectWithValue }) => {
      try {
         return await getTasks();
      } catch (err: any) {
         return rejectWithValue('Не удалось загрузить задачи');
      }
   },
);

export const createTask = createAsyncThunk<Task, Task, { rejectValue: string }>(
   'data/createTask',
   async (input, { rejectWithValue }) => {
      try {
         const result = await apiCreateTask(input);
         console.log(result);
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
         } as Task;
      } catch (err: any) {
         return rejectWithValue('Не удалось создать задачу');
      }
   },
);

export const updateTask = createAsyncThunk<Task, Task, { rejectValue: string }>(
   'data/updateTask',
   async (input, { rejectWithValue, dispatch }) => {
      try {
         const result = await apiUpdateTask(input.id!, input);
         input.assignee = { id: input.assigneeId };
         return input;
      } catch (err: any) {
         return rejectWithValue('Не удалось обновить задачу');
      }
   },
);
export const updateTaskStatus = createAsyncThunk<
   { id: number; status: Status },
   { id: number; status: Status },
   { rejectValue: string }
>(
   'data/updateTaskStatus',
   async ({ id, status }, { rejectWithValue }) => {
      try {

         await apiUpdateTaskStatus(id, { status: status });
         return { id, status };
      } catch (err: any) {
         return rejectWithValue('Не удалось обновить статус задачи');
      }
   }
);


export const fetchBoardTasks = createAsyncThunk<
   Task[],
   number,
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
   },
);

// —————————————————— State & Slice ——————————————————

interface DataState {
   boards: Board[];
   users: Assignee[];
   tasks: Task[];
   boardTasks: Record<'Backlog' | 'InProgress' | 'Done', Task[]>;
   isLoading: boolean;
   error: string | null;
   notification: Notification;
}

const initialState: DataState = {
   boards: [],
   users: [],
   tasks: [],
   isLoading: false,
   boardTasks: { Backlog: [], InProgress: [], Done: [] },
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
         console.log('PAYLOAD');
         console.log(payload);
         state.tasks.push(payload);
         if (payload.boardId === state.currentBoardId) {
            // добавляем в нужную группу
            const status = payload.status as 'Backlog' | 'InProgress' | 'Done';
            state.boardTasks[status].push(payload);
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
         console.log(payload);
         const idx = state.tasks.findIndex(t => t.id === payload.id);
         if (idx !== -1) state.tasks[idx] = payload;
         const oldStatus = state.boardTasks.Backlog.some(t => t.id === payload.id) ? 'Backlog'
            : state.boardTasks.InProgress.some(t => t.id === payload.id) ? 'InProgress'
               : 'Done';
         if (oldStatus !== payload.status) {
            state.boardTasks[oldStatus] = state.boardTasks[oldStatus].filter(t => t.id !== payload.id);
            const newStatus = payload.status as Status;
            state.boardTasks[newStatus].push(payload);
         } else {

            const list = state.boardTasks[oldStatus];
            const pos = list.findIndex(t => t.id === payload.id);
            if (pos !== -1) list[pos] = payload;
         }
         state.isLoading = false;
         state.notification = { open: true, message: 'Задача обновлена', severity: 'success' };
      });
      builder.addCase(updateTask.rejected, (state: RootState, { payload, error }) => {
         state.isLoading = false;
         state.error = payload ?? error.message ?? 'Ошибка';
         state.notification = { open: true, message: state.error!, severity: 'error' };
      });

      builder
         .addCase(updateTaskStatus.pending, (state: RootState) => {
            state.isLoading = true;
            state.error = null;
         })
         .addCase(updateTaskStatus.fulfilled, (state: RootState, { payload }) => {
            const { id, status } = payload;
            const task = state.tasks.find(t => t.id === id);
            if (task) task.status = status;

            (['Backlog','InProgress','Done'] as const).forEach(group => {
               state.boardTasks[group] =
                  state.boardTasks[group].filter(t => t.id !== id);
            });
            state.boardTasks[status].push(
               task!
            );

            state.isLoading = false;
            state.notification = {
               open: true,
               message: 'Статус задачи обновлён',
               severity: 'success'
            };
         })
         .addCase(updateTaskStatus.rejected, (state: RootState, { payload, error }) => {
            state.isLoading = false;
            state.error = payload ?? error.message ?? 'Ошибка обновления статуса';
            state.notification = {
               open: true,
               message: state.error,
               severity: 'error'
            };
         });

      // — fetchBoardTasks
      builder.addCase(fetchBoardTasks.pending, (state: RootState) => {
         state.isLoading = true;
         state.error = null;
      });
      builder.addCase(fetchBoardTasks.fulfilled, (state: RootState, { payload, meta }) => {
         const grouped: Record<'Backlog' | 'InProgress' | 'Done', Task[]> = {
            Backlog: [],
            InProgress: [],
            Done: [],
         };
         payload.forEach(task => {
            const status = task.status as 'Backlog' | 'InProgress' | 'Done';
            grouped[status].push(task);
         });
         state.boardTasks = grouped;
         state.currentBoardId = meta.arg;     // сохраняем id той доски
         state.isLoading = false;
      });
      builder.addCase(fetchBoardTasks.rejected, (state: RootState, { payload, error }) => {
         state.isLoading = false;
         state.error = payload ?? error.message ?? 'Ошибка';
         state.notification = {
            open: true,
            message: state.error!,
            severity: 'error',
         };
      });
   },
});

export const { clearError, showNotification, hideNotification } = dataSlice.actions;
export default dataSlice.reducer;

// —————————————————— Selectors ——————————————————

export const selectBoards = (state: RootState) => state.data.boards;
export const selectUsers = (state: RootState) => state.data.users;
export const selectTasks = (state: RootState) => state.data.tasks;
export const selectLoading = (state: RootState) => state.data.isLoading;
export const selectError = (state: RootState) => state.data.error;
export const selectNotification = (state: RootState) => state.data.notification;
export const selectBoardTasks = (state: RootState) => state.data.boardTasks;
export const selectCurrentBoard = (state: RootState) => state.data.currentBoardId;
