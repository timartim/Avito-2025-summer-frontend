// tests/unit/redux/dataSlice.test.ts

import dataReducer, {
   clearError,
   showNotification,
   hideNotification,
   fetchBoards,
   fetchUsers,
   fetchTasks,
   createTask,
   updateTask,
   updateTaskStatus,
   fetchBoardTasks,
   selectBoards,
   selectUsers,
   selectTasks,
   selectLoading,
   selectError,
   selectNotification,
   selectBoardTasks,
   selectCurrentBoard,
} from '../../../src/ReduxSlices/dataSlice';
import { Board, Task, Status, Assignee } from '../../../src/Interfaces/appInterfaces';

describe('dataSlice', () => {
   const initial = dataReducer(undefined as any, { type: '@@INIT' });

   it('should have the correct initial state', () => {
      expect(initial.boards).toEqual([]);
      expect(initial.users).toEqual([]);
      expect(initial.tasks).toEqual([]);
      expect(initial.boardTasks).toEqual({ Backlog: [], InProgress: [], Done: [] });
      expect(initial.isLoading).toBe(false);
      expect(initial.error).toBeNull();
      expect(initial.notification).toEqual({ open: false, message: '', severity: 'info' });
   });

   it('clearError should reset error to null', () => {
      const state = { ...initial, error: 'oops' };
      const next = dataReducer(state, clearError());
      expect(next.error).toBeNull();
   });

   it('showNotification and hideNotification should work', () => {
      const shown = dataReducer(initial, showNotification({ message: 'test', severity: 'warning' }));
      expect(shown.notification).toEqual({ open: true, message: 'test', severity: 'warning' });

      const hidden = dataReducer(shown, hideNotification());
      expect(hidden.notification.open).toBe(false);
      // message/severity stay
      expect(hidden.notification.message).toBe('test');
      expect(hidden.notification.severity).toBe('warning');
   });

   describe('async thunks reducers', () => {
      it('fetchBoards pending/fulfilled/rejected', () => {
         let state = dataReducer(initial, fetchBoards.pending('', undefined));
         expect(state.isLoading).toBe(true);
         expect(state.error).toBeNull();

         const boardsPayload: Board[] = [{ id: 1, name: 'A' }];
         state = dataReducer(state, fetchBoards.fulfilled(boardsPayload, '', undefined));
         expect(state.isLoading).toBe(false);
         expect(state.boards).toEqual(boardsPayload);

         state = dataReducer(state, fetchBoards.rejected('rej', '', undefined, 'fail'));
         expect(state.isLoading).toBe(false);
         expect(state.error).toBe('fail');
         expect(state.notification.open).toBe(true);
         expect(state.notification.message).toBe('fail');
         expect(state.notification.severity).toBe('error');
      });

      it('fetchUsers and fetchTasks follow same pattern', () => {
         // users
         let s = dataReducer(initial, fetchUsers.pending('', undefined));
         expect(s.isLoading).toBe(true);
         s = dataReducer(s, fetchUsers.fulfilled([{ id: 1, fullName: 'U', email: '', avatarUrl: '' }], '', undefined));
         expect(s.isLoading).toBe(false);
         expect(s.users).toHaveLength(1);
         s = dataReducer(s, fetchUsers.rejected('e', '', undefined, 'uerr'));
         expect(s.error).toBe('uerr');
         // tasks
         s = dataReducer(s, fetchTasks.pending('', undefined));
         expect(s.isLoading).toBe(true);
         const tasksPayload: Task[] = [
            { id: 10, title: '', description: '', priority: 'Low', status: 'Backlog', assigneeId: 0, boardId: 0, assignee: { id:0, fullName:'', email:'', avatarUrl:'' }, boardName:'' },
         ];
         s = dataReducer(s, fetchTasks.fulfilled(tasksPayload, '', undefined));
         expect(s.isLoading).toBe(false);
         expect(s.tasks).toEqual(tasksPayload);
         s = dataReducer(s, fetchTasks.rejected('e', '', undefined, 'terr'));
         expect(s.error).toBe('terr');
      });

      it('createTask fulfilled adds to tasks and boardTasks when matching currentBoardId', () => {
         // first simulate that we fetched boardTasks for board 5
         let s = { ...initial, currentBoardId: 5 };
         // createTask.pending
         s = dataReducer(s, createTask.pending('', {
            id: 1, title: 't', description: 'd', priority: 'Low', status: 'Backlog',
            assigneeId: 0, boardId: 5, assignee: { id:0, fullName:'', email:'', avatarUrl:'' }, boardName:'B'
         }));
         expect(s.isLoading).toBe(true);
         // createTask.fulfilled
         const newTask: Task = {
            id: 2, title: 't2', description: 'd2', priority: 'High', status: 'Backlog',
            assigneeId: 0, boardId: 5, assignee: { id:0, fullName:'', email:'', avatarUrl:'' }, boardName:'B'
         };
         s = dataReducer(s, createTask.fulfilled(newTask, '', newTask));
         expect(s.isLoading).toBe(false);
         expect(s.tasks.find(t => t.id === 2)).toBeDefined();
         expect(s.boardTasks.Backlog.find(t => t.id === 2)).toBeDefined();
         expect(s.notification.severity).toBe('success');

         // createTask.rejected
         s = dataReducer(s, createTask.rejected('e', '', undefined, 'terr'));
         expect(s.error).toBe('terr');
         expect(s.notification.severity).toBe('error');
      });

      it('updateTaskStatus fulfilled moves task between groups', () => {
         const t: Task = {
            id: 3, title: 'x', description: '', priority: 'Low', status: 'Backlog',
            assigneeId: 0, boardId: 1, assignee: { id:0, fullName:'', email:'', avatarUrl:'' }, boardName:'B'
         };
         let s = {
            ...initial,
            tasks: [t],
            boardTasks: { Backlog: [t], InProgress: [], Done: [] }
         };
         // pending
         s = dataReducer(s, updateTaskStatus.pending('', { id:3, status:'InProgress' as Status }));
         expect(s.isLoading).toBe(true);
         // fulfilled
         s = dataReducer(s, updateTaskStatus.fulfilled({ id:3, status:'InProgress' }, '', { id:3, status:'InProgress' }));
         expect(s.isLoading).toBe(false);
         expect(s.tasks.find(x=>x.id===3)!.status).toBe('InProgress');
         expect(s.boardTasks.Backlog).toHaveLength(0);
         expect(s.boardTasks.InProgress).toHaveLength(1);
         expect(s.notification.message).toBe('Статус задачи обновлён');
      });

      it('fetchBoardTasks fulfilled groups tasks and sets currentBoardId', () => {
         const payload: Task[] = [
            { id: 4, title: '', description: '', priority: 'Low', status: 'Backlog', assigneeId:0, boardId: 7, assignee:{id:0,fullName:'',email:'',avatarUrl:''}, boardName:'' },
            { id: 5, title: '', description: '', priority: 'Low', status: 'Done', assigneeId:0, boardId: 7, assignee:{id:0,fullName:'',email:'',avatarUrl:''}, boardName:'' },
         ];
         let s = dataReducer(initial, fetchBoardTasks.pending('', 7));
         expect(s.isLoading).toBe(true);
         s = dataReducer(s, fetchBoardTasks.fulfilled(payload, '', 7));
         expect(s.isLoading).toBe(false);
         expect(s.boardTasks.Backlog).toHaveLength(1);
         expect(s.boardTasks.Done).toHaveLength(1);
         expect((s as any).currentBoardId).toBe(7);
      });
   });

   describe('selectors', () => {
      const root = { data: initial } as any;
      it('selectBoards', () => expect(selectBoards(root)).toBe(initial.boards));
      it('selectUsers', () => expect(selectUsers(root)).toBe(initial.users));
      it('selectTasks', () => expect(selectTasks(root)).toBe(initial.tasks));
      it('selectLoading', () => expect(selectLoading(root)).toBe(initial.isLoading));
      it('selectError', () => expect(selectError(root)).toBe(initial.error));
      it('selectNotification', () => expect(selectNotification(root)).toBe(initial.notification));
      it('selectBoardTasks', () => expect(selectBoardTasks(root)).toBe(initial.boardTasks));
      it('selectCurrentBoard (undefined)', () => expect(selectCurrentBoard(root)).toBeUndefined());
   });
});
