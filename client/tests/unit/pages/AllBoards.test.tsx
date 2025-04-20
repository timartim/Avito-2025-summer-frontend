// tests/unit/pages/AllBoards.test.tsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import AllBoards from '../../../src/Components/Pages/AllBoards';
import dataReducer from '../../../src/ReduxSlices/dataSlice';
import { Board } from '../../../src/Interfaces/appInterfaces';

describe('AllBoards page', () => {
   const boards: Board[] = [
      { id: 1, name: 'Board A' },
      { id: 2, name: 'Board B' },
      { id: 3, name: 'Board C' },
   ];

   function renderAllBoards() {
      const store = configureStore({
         reducer: { data: dataReducer },
         preloadedState: {
            data: {
               boards,
               tasks: [],
               users: [],
               loading: false,
               error: null,
            },
         },
      });

      render(
         <Provider store={store}>
            <MemoryRouter>
               <AllBoards />
            </MemoryRouter>
         </Provider>
      );
   }

   it('renders a card for each board with its name', () => {
      renderAllBoards();
      for (const b of boards) {
         expect(screen.getByText(b.name)).toBeInTheDocument();
      }
   });

   it('renders a "Перейти" link for each board with correct href', () => {
      renderAllBoards();

      const links = screen.getAllByRole('link', { name: 'Перейти' });
      expect(links).toHaveLength(boards.length);

      boards.forEach((b, idx) => {
         const link = links[idx];
         expect(link).toHaveAttribute('href', `/board/${b.id}`);
      });
   });
});
