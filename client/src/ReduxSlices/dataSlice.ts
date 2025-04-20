/**
 * Redux‑срез, отвечающий за основные данные приложения:
 *  • доски, пользователи, задачи
 *  • групповку задач по статусам для конкретной доски
 *  • глобальный индикатор загрузки и сообщения‑нотификации
 *
 * В файле сосредоточены:
 *  1. **Async‑thunk’и**, которые обращаются к REST‑API
 *  2. **slice** со всем состоянием и редьюсерами
 *  3. **селекторы** для удобного доступа к store
 *
 * ❗ Из кода ничего не удаляем, добавляем лишь короткие комментарии для ориентации.
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getBoards, getBoardTasks }   from '../Api/boardRequests.ts';
import { getUsers }                   from '../Api/userRequests.ts';
import { getTasks }                   from '../Api/taskRequests.ts';
import {
   createTask as apiCreateTask,
   updateTaskStatus as apiUpdateTaskStatus,
   updateTask as apiUpdateTask,
} from '../Api/taskRequests.ts';
import { RootState } from '../ReduxStore/store.ts';
import { Assignee, Board, Status, Task } from '../Interfaces/appInterfaces.ts';

/* -------------------------------------------------------------------------- */
/*                                   Thunks                                   */
/* -------------------------------------------------------------------------- */

/**
 * Загружает **все проекты** (boards) из back‑end’а и
 * диспатчит три стандартных action’а:
 *
 * 1. **pending**  – до запроса (можно показать спиннер)
 * 2. **fulfilled** – в `payload` будет `Board[]`
 * 3. **rejected** – в `payload` положим человекочитаемое сообщение об ошибке
 *
 * @function fetchBoards
 * @returns thunk‑action, который `createSlice` перехватит в `extraReducers`
 *
 * @example
 * ```ts
 * const dispatch = useDispatch();
 * dispatch(fetchBoards());
 * ```
 */
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

/**
 * Загружает список **всех пользователей** (исполнителей задач).
 *
 * @function fetchUsers
 * @returns массив объектов `Assignee` в action `fulfilled`
 */
export const fetchUsers = createAsyncThunk<Assignee[], void, { rejectValue: string }>(
   'data/fetchUsers',
   async (_, { rejectWithValue }) => {
      try {
         return await getUsers();
      } catch {
         return rejectWithValue('Не удалось загрузить пользователей');
      }
   },
);

/**
 * Получает **полный плоский список** задач, без привязки к доске.
 *
 * @function fetchTasks
 * @returns `Task[]` – пригодится на странице «Все задачи»
 */
export const fetchTasks = createAsyncThunk<Task[], void, { rejectValue: string }>(
   'data/fetchTasks',
   async (_, { rejectWithValue }) => {
      try {
         return await getTasks();
      } catch {
         return rejectWithValue('Не удалось загрузить задачи');
      }
   },
);

/**
 * Создаёт новую задачу.
 *
 * Сервер возвращает `{ id }`, поэтому здесь сразу собираем полноценный
 * объект `Task`, чтобы reducer смог поместить его в store без
 * дополнительного запроса.
 *
 * @function createTask
 * @param   input  данные формы, пришедшие из UI
 * @returns `Task` – уже с id, который вернул back‑end
 *
 * @example
 * dispatch(createTask({ …fields }))
 */
export const createTask = createAsyncThunk<Task, Task, { rejectValue: string }>(
   'data/createTask',
   async (input, { rejectWithValue }) => {
      try {
         const result = await apiCreateTask(input);
         return {
            id: result.id,
            title:        input.title,
            description:  input.description,
            priority:     input.priority,
            status:       input.status ?? 'Backlog',
            assigneeId:   input.assigneeId,
            boardId:      input.boardId,
            assignee:     { id: input.assigneeId, fullName: '', email: '', avatarUrl: '' },
            boardName:    input.boardName,
         } as Task;
      } catch {
         return rejectWithValue('Не удалось создать задачу');
      }
   },
);

/**
 * Полностью обновляет карточку задачи (title, description, priority и т.д.).
 *
 * @function updateTask
 * @param   input  объект `Task` c изменёнными полями
 * @returns тот же объект, что был передан (сервер не меняет структуру)
 *
 * > Используется диалогом **редактирования** задачи.
 */
export const updateTask = createAsyncThunk<Task, Task, { rejectValue: string }>(
   'data/updateTask',
   async (input, { rejectWithValue }) => {
      try {
         await apiUpdateTask(input.id!, input);
         // упрощённо возвращаем то, что отправляли
         input.assignee = { id: input.assigneeId };
         return input;
      } catch {
         return rejectWithValue('Не удалось обновить задачу');
      }
   },
);


/**
 * Меняет **только статус** задачи. Вызывается при перетаскивании карточки
 * между колонками на доске (`Drag and Drop`).
 *
 * @function updateTaskStatus
 * @param id      идентификатор задачи
 * @param status  новый статус (`Backlog` | `InProgress` | `Done`)
 * @returns объект `{ id, status }` – достаточно для локального обновления
 */
export const updateTaskStatus = createAsyncThunk<
   { id: number; status: Status },
   { id: number; status: Status },
   { rejectValue: string }
>(
   'data/updateTaskStatus',
   async ({ id, status }, { rejectWithValue }) => {
      try {
         await apiUpdateTaskStatus(id, { status });
         return { id, status };
      } catch {
         return rejectWithValue('Не удалось обновить статус задачи');
      }
   }
);

/**
 * Загружает задачи **конкретной доски** и даёт их reducer’у, который
 * разложит элементы по статусам.
 *
 * @function fetchBoardTasks
 * @param boardId  id выбранной доски
 * @returns массив `Task[]` в `fulfilled`
 *
 * @example
 * dispatch(fetchBoardTasks(42));
 */
export const fetchBoardTasks = createAsyncThunk<Task[], number, { rejectValue: string }>(
   'data/fetchBoardTasks',
   async (boardId, { rejectWithValue }) => {
      try {
         return await getBoardTasks(boardId);
      } catch (err) {
         console.error('fetchBoardTasks error', err);
         return rejectWithValue('Не удалось загрузить задачи доски');
      }
   },
);

/* -------------------------------------------------------------------------- */
/*                               Slice & State                                */
/* -------------------------------------------------------------------------- */

/** Состояние, относящееся к данным (доски/пользователи/задачи) */
interface DataState {
   boards: Board[];
   users: Assignee[];
   tasks: Task[];
   /** Задачи текущей доски распределённые по статусам */
   boardTasks: Record<'Backlog' | 'InProgress' | 'Done', Task[]>;
   isLoading: boolean;
   error: string | null;
   notification: Notification;
   /** id активной доски (нужен для drag‑and‑drop) */
   currentBoardId?: number;
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

/* Основной slice. В `extraReducers` описаны все ветки жизненного цикла thunks */
const dataSlice = createSlice({
   name: 'data',
   initialState,
   reducers: {
      /**
       * Очищает поле {@link DataState.error | `error`} в state.
       *
       * Используем, когда нужно «сбросить» всплывшую ранее ошибку,
       * чтобы UI перестал её показывать.
       *
       * @action clearError
       * @example
       * dispatch(clearError());
       */
      clearError(state) {
         state.error = null;
      },
      /**
       * Показывает глобальный **Snackbar**.
       *
       * Принимает объект без поля `open`, поскольку оно добавляется
       * автоматически (дополняем `open: true`).
       * Используем, когда нужно уведомить пользователя об успешном действии
       * или об ошибке (если требуется нестандартное сообщение).
       *
       * @action showNotification
       *
       * @param action.payload.message   Текст уведомления
       * @param action.payload.severity  one of `'success' | 'error' | 'info'`
       *
       * @example
       * dispatch(showNotification({ message: 'Готово!', severity: 'success' }));
       */
      showNotification(state, action: PayloadAction<Omit<Notification, 'open'>>) {
         state.notification = { open: true, ...action.payload };
      },
      /**
       * Закрывает Snackbar, устанавливая `notification.open = false`.
       *
       * @action hideNotification
       * @example
       * dispatch(hideNotification());
       */
      hideNotification(state) {
         state.notification.open = false;
      },
   },

   extraReducers: (builder) => {
      /* ------------------------------- fetchBoards ------------------------------ */
      builder.addCase(fetchBoards.pending,   (state: RootState) => { state.isLoading = true; state.error = null; });
      builder.addCase(fetchBoards.fulfilled, (state: RootState, { payload }) => { state.boards = payload; state.isLoading = false; });
      builder.addCase(fetchBoards.rejected,  (state: RootState, { payload, error }) => {
         state.isLoading = false;
         state.error = payload ?? error.message ?? 'Ошибка';
         state.notification = { open: true, message: state.error!, severity: 'error' };
      });

      /* ------------------------------- fetchUsers ------------------------------- */
      builder.addCase(fetchUsers.pending,   (state: RootState) => { state.isLoading = true; state.error = null; });
      builder.addCase(fetchUsers.fulfilled, (state: RootState, { payload }) => { state.users = payload; state.isLoading = false; });
      builder.addCase(fetchUsers.rejected,  (state: RootState, { payload, error }) => {
         state.isLoading = false;
         state.error = payload ?? error.message ?? 'Ошибка';
         state.notification = { open: true, message: state.error!, severity: 'error' };
      });

      /* ------------------------------- fetchTasks -------------------------------- */
      builder.addCase(fetchTasks.pending,   (state: RootState) => { state.isLoading = true; state.error = null; });
      builder.addCase(fetchTasks.fulfilled, (state: RootState, { payload }) => { state.tasks = payload; state.isLoading = false; });
      builder.addCase(fetchTasks.rejected,  (state: RootState, { payload, error }) => {
         state.isLoading = false;
         state.error = payload ?? error.message ?? 'Ошибка';
         state.notification = { open: true, message: state.error!, severity: 'error' };
      });

      /* ------------------------------- createTask -------------------------------- */
      builder.addCase(createTask.pending,   (state: RootState) => { state.isLoading = true; state.error = null; });
      builder.addCase(createTask.fulfilled, (state: RootState, { payload }) => {
         state.tasks.push(payload);
         // если открыта доска, сразу помещаем в нужную колонку
         if (payload.boardId === state.currentBoardId) {
            const status = payload.status as 'Backlog' | 'InProgress' | 'Done';
            state.boardTasks[status].push(payload);
         }
         state.isLoading = false;
         state.notification = { open: true, message: 'Задача создана', severity: 'success' };
      });
      builder.addCase(createTask.rejected,  (state: RootState, { payload, error }) => {
         state.isLoading = false;
         state.error = payload ?? error.message ?? 'Ошибка';
         state.notification = { open: true, message: state.error!, severity: 'error' };
      });

      /* ------------------------------- updateTask -------------------------------- */
      builder.addCase(updateTask.pending,   (state: RootState) => { state.isLoading = true; state.error = null; });
      builder.addCase(updateTask.fulfilled, (state: RootState, { payload }) => {
         /* обновляем в массиве задач и в grouped‑структуре доски */
         const idx = state.tasks.findIndex(t => t.id === payload.id);
         if (idx !== -1) state.tasks[idx] = payload;

         const oldStatus =
            state.boardTasks.Backlog   .some(t => t.id === payload.id) ? 'Backlog'   :
               state.boardTasks.InProgress.some(t => t.id === payload.id) ? 'InProgress' : 'Done';

         if (oldStatus !== payload.status) {
            state.boardTasks[oldStatus] = state.boardTasks[oldStatus].filter(t => t.id !== payload.id);
            state.boardTasks[payload.status as Status].push(payload);
         } else {
            /* изменилось что‑то кроме статуса */
            const list = state.boardTasks[oldStatus];
            const pos  = list.findIndex(t => t.id === payload.id);
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

      /* ---------------------------- updateTaskStatus ---------------------------- */
      builder
         .addCase(updateTaskStatus.pending,   (state: RootState) => { state.isLoading = true; state.error = null; })
         .addCase(updateTaskStatus.fulfilled, (state: RootState, { payload }) => {
            const { id, status } = payload;
            const task = state.tasks.find(t => t.id === id);
            if (task) task.status = status;

            // убираем из всех колонок и кладём в новую
            (['Backlog','InProgress','Done'] as const).forEach(group => {
               state.boardTasks[group] = state.boardTasks[group].filter(t => t.id !== id);
            });
            state.boardTasks[status].push(task!);

            state.isLoading   = false;
            state.notification = { open: true, message: 'Статус задачи обновлён', severity: 'success' };
         })
         .addCase(updateTaskStatus.rejected, (state: RootState, { payload, error }) => {
            state.isLoading = false;
            state.error = payload ?? error.message ?? 'Ошибка обновления статуса';
            state.notification = { open: true, message: state.error, severity: 'error' };
         });

      /* ----------------------------- fetchBoardTasks ---------------------------- */
      builder.addCase(fetchBoardTasks.pending,   (state: RootState) => { state.isLoading = true; state.error = null; });
      builder.addCase(fetchBoardTasks.fulfilled, (state: RootState, { payload, meta }) => {
         /* группируем задачи по статусам для выбранной доски */
         const grouped: DataState['boardTasks'] = { Backlog: [], InProgress: [], Done: [] };
         payload.forEach(task => grouped[task.status as 'Backlog' | 'InProgress' | 'Done'].push(task));

         state.boardTasks     = grouped;
         state.currentBoardId = meta.arg; // id активной доски
         state.isLoading      = false;
      });
      builder.addCase(fetchBoardTasks.rejected, (state: RootState, { payload, error }) => {
         state.isLoading = false;
         state.error = payload ?? error.message ?? 'Ошибка';
         state.notification = { open: true, message: state.error!, severity: 'error' };
      });
   },
});

export const { clearError, showNotification, hideNotification } = dataSlice.actions;
export default dataSlice.reducer;

/* -------------------------------------------------------------------------- */
/*                                  Selectors                                 */
/* -------------------------------------------------------------------------- */

export const selectBoards        = (state: RootState) => state.data.boards;
export const selectUsers         = (state: RootState) => state.data.users;
export const selectTasks         = (state: RootState) => state.data.tasks;
export const selectLoading       = (state: RootState) => state.data.isLoading;
export const selectError         = (state: RootState) => state.data.error;
export const selectNotification  = (state: RootState) => state.data.notification;
export const selectBoardTasks    = (state: RootState) => state.data.boardTasks;
export const selectCurrentBoard  = (state: RootState) => state.data.currentBoardId;
