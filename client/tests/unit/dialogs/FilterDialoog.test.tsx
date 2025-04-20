// tests/unit/components/FilterDialog.test.tsx

import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import FilterDialog from '../../../src/Components/Dialogs/FilterDialog';
import dataReducer from '../../../src/ReduxSlices/dataSlice';
import { Filter } from '../../../src/Interfaces/serviceInterfaces';

const fakeBoards = [
   { id: 1, name: 'Alpha' },
   { id: 2, name: 'Beta' },
   { id: 3, name: 'Gamma' },
];

function renderFilterDialog(
   initial: Filter,
   onApplyFilter = jest.fn(),
   onClose = jest.fn(),
) {
   const store = configureStore({
      reducer: { data: dataReducer },
      preloadedState: {
         data: {
            boards: fakeBoards,
            tasks: [],
            users: [],
            loading: false,
            error: null,
         },
      },
   });

   render(
      <Provider store={store}>
         <FilterDialog
            open={true}
            initialValues={initial}
            onApplyFilter={onApplyFilter}
            onClose={onClose}
         />
      </Provider>
   );

   return { onApplyFilter, onClose };
}

describe('FilterDialog', () => {
   it('рендерит все группы фильтров и позволяет сбросить их', () => {
      renderFilterDialog({ priorities: ['High'], statuses: ['Backlog'], boards: ['Beta'] });

      // приоритеты
      expect(screen.getByLabelText('Высокое')).toBeInTheDocument();
      expect(screen.getByLabelText('Среднее')).toBeInTheDocument();
      expect(screen.getByLabelText('Небольшое')).toBeInTheDocument();

      // статусы
      expect(screen.getByLabelText('Не начато')).toBeInTheDocument();
      expect(screen.getByLabelText('В процессе')).toBeInTheDocument();
      expect(screen.getByLabelText('Выполнено')).toBeInTheDocument();

      // доски
      expect(screen.getByLabelText('Alpha')).toBeInTheDocument();
      expect(screen.getByLabelText('Beta')).toBeInTheDocument();
      expect(screen.getByLabelText('Gamma')).toBeInTheDocument();

      // сброс
      fireEvent.click(screen.getByRole('button', { name: /Сбросить/i }));
      expect((screen.getByLabelText('Высокое') as HTMLInputElement).checked).toBe(false);
      expect((screen.getByLabelText('Не начато') as HTMLInputElement).checked).toBe(false);
      expect((screen.getByLabelText('Beta') as HTMLInputElement).checked).toBe(false);
   });

   it('фильтрует список досок по вводу в поиск', () => {
      renderFilterDialog({ priorities: [], statuses: [], boards: [] });

      const searchInput = screen.getByLabelText('Поиск доски');
      fireEvent.change(searchInput, { target: { value: 'Be' } });

      // видна только Beta
      const listbox = screen.getByRole('group', { name: /Доски/i });
      const options = within(listbox).getAllByRole('checkbox');
      expect(options).toHaveLength(1);
      expect(within(listbox).getByLabelText('Beta')).toBeInTheDocument();
   });

   it('вызывает onApplyFilter с правильными значениями', () => {
      const initial: Filter = { priorities: [], statuses: [], boards: [] };
      const { onApplyFilter } = renderFilterDialog(initial);

      // выбираем приоритет "Высокое"
      fireEvent.click(screen.getByLabelText('Высокое'));
      // выбираем статус "В процессе"
      fireEvent.click(screen.getByLabelText('В процессе'));
      // выбираем доску "Gamma"
      fireEvent.click(screen.getByLabelText('Gamma'));

      fireEvent.click(screen.getByRole('button', { name: /Найти/i }));

      expect(onApplyFilter).toHaveBeenCalledWith({
         priorities: ['High'],
         statuses: ['InProgress'],
         boards: ['Gamma'],
      });
   });

   it('при отмене вызывает onClose без применения', () => {
      const { onClose, onApplyFilter } = renderFilterDialog({ priorities: [], statuses: [], boards: [] });
      fireEvent.click(screen.getByRole('button', { name: /Отменить/i }));
      expect(onClose).toHaveBeenCalled();
      expect(onApplyFilter).not.toHaveBeenCalled();
   });
});
