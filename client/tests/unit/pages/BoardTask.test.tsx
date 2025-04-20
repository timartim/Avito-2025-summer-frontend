// tests/unit/pages/BoardTasks.test.tsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import renderer, { act } from 'react-test-renderer';
import { DragDropContext } from 'react-beautiful-dnd';
import '@testing-library/jest-dom';

import BoardTasks from '../../../src/Components/Pages/BoardTasks';
import dataReducer, { updateTaskStatus } from '../../../src/ReduxSlices/dataSlice';
import { useBoardTasks } from '../../../src/Hooks/useBoardTasks';

jest.mock('../../../src/Hooks/useBoardTasks');

describe('BoardTasks Page', () => {
   const boards = [
      { id: 1, name: 'Board One' },
      { id: 2, name: 'Board Two' },
   ];
   const task = {
      id: 42,
      title: 'Test Task',
      description: 'Desc',
      priority: 'Low',
      assigneeId: 0,
      boardId: 1,
      boardName: 'Board One',
   };
   const grouped = {
      Backlog: [task],
      InProgress: [],
      Done: [],
   };

   beforeEach(() => {
      (useBoardTasks as jest.Mock).mockReturnValue({
         grouped,
         loading: false,
         error: null,
      });
   });

   function renderWithRoutes(initialEntries: any[]) {
      const store = configureStore({
         reducer: { data: dataReducer },
         preloadedState: {
            data: { boards, tasks: [], users: [], loading: false, error: null },
         },
      });

      return render(
         <Provider store={store}>
            <MemoryRouter initialEntries={initialEntries}>
               <Routes>
                  <Route path="/board/:id" element={<BoardTasks />} />
               </Routes>
            </MemoryRouter>
         </Provider>,
      );
   }

   it('renders the board name based on URL param', () => {
      renderWithRoutes([{ pathname: '/board/1' }]);
      expect(screen.getByText('Board One')).toBeInTheDocument();
   });

   it('opens the TaskDialog when navigated with taskId in state', async () => {
      renderWithRoutes([{ pathname: '/board/1', state: { taskId: 42 } }]);
      expect(await screen.findByRole('heading', { name: 'Редактировать задачу' }))
         .toBeInTheDocument();
   });

   it('opens the TaskDialog when clicking on a task card', async () => {
      renderWithRoutes([{ pathname: '/board/1' }]);
      fireEvent.click(screen.getByText('Test Task'));
      expect(await screen.findByRole('heading', { name: 'Редактировать задачу' }))
         .toBeInTheDocument();
   });

   it('dispatches updateTaskStatus on dragEnd', () => {
      const store = configureStore({
         reducer: { data: dataReducer },
         preloadedState: {
            data: { boards, tasks: [], users: [], loading: false, error: null },
         },
      });
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      // render via react-test-renderer to grab the DragDropContext
      const tree = renderer.create(
         <Provider store={store}>
            <MemoryRouter initialEntries={[{ pathname: '/board/1' }]}>
               <Routes>
                  <Route path="/board/:id" element={<BoardTasks />} />
               </Routes>
            </MemoryRouter>
         </Provider>,
      ).root;

      const dragCtx = tree.findByType(DragDropContext);
      act(() => {
         dragCtx.props.onDragEnd({
            source: { droppableId: 'Backlog', index: 0 },
            destination: { droppableId: 'InProgress', index: 0 },
         });
      });

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      const firstArg = dispatchSpy.mock.calls[0][0];
      expect(typeof firstArg).toBe('function');
   });
});
