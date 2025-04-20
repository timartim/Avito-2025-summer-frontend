// tests/unit/components/TaskDialog.test.tsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import TaskDialog from '../../../src/Components/Dialogs/TaskDialog';
import dataReducer from '../../../src/ReduxSlices/dataSlice';
import { Task } from '../../../src/Interfaces/appInterfaces';

const users = [
   { id: 1, fullName: 'Alice', avatarUrl: '' },
   { id: 2, fullName: 'Bob',   avatarUrl: '' },
];
const boards = [
   { id: 10, name: 'Board X' },
   { id: 20, name: 'Board Y' },
];

function renderDialog(
   mode: 'create' | 'edit',
   initialValues: Partial<Task> = {},
   onSubmit = jest.fn(),
   onClose = jest.fn(),
) {
   const store = configureStore({
      reducer: { data: dataReducer },
      preloadedState: {
         data: {
            users,
            boards,
            tasks: [],
            loading: false,
            error: null,
         },
      },
   });

   render(
      <Provider store={store}>
         <TaskDialog
            open={true}
            mode={mode}
            initialValues={initialValues}
            onSubmit={onSubmit}
            onClose={onClose}
         />
      </Provider>
   );

   return { store, onSubmit, onClose };
}

describe('TaskDialog (create mode)', () => {
   it('рисует все поля и кнопки', () => {
      renderDialog('create');

      expect(screen.getByText('Создать задачу')).toBeInTheDocument();

      expect(screen.getByLabelText('Заголовок')).toBeInTheDocument();
      expect(screen.getByLabelText('Описание')).toBeInTheDocument();
      expect(screen.getByLabelText('Исполнитель')).toBeInTheDocument();


      expect(screen.getAllByText('Приоритет').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Проект').length).toBeGreaterThan(0);

      expect(screen.getByRole('button', { name: /Создать/ })).toBeEnabled();
      expect(screen.getByRole('button', { name: 'Отменить' })).toBeEnabled();
   });

   it('показывает ошибки валидации при пустой отправке', async () => {
      renderDialog('create');

      fireEvent.click(screen.getByRole('button', { name: /Создать/ }));

      expect(await screen.findByText('Заголовок обязателен')).toBeInTheDocument();
      expect(screen.getByText('Описание обязательно')).toBeInTheDocument();
      expect(screen.getByText('Выберите исполнителя')).toBeInTheDocument();
      expect(screen.getByText('Выберите проект')).toBeInTheDocument();
      expect(screen.getByText('Выберите приоритет')).toBeInTheDocument();
   });
});

describe('TaskDialog (edit mode)', () => {
   it('предзаполняет поля и показывает кнопку сохранения', () => {
      const initial: Partial<Task> = {
         id: 55,
         title: 'Old Title',
         description: 'Old Desc',
         priority: 'High',
         status: 'Backlog',
         assignee: users[0],
         assigneeId: 1,
         boardId: 10,
         boardName: 'Board X',
      };
      renderDialog('edit', initial);

      expect(screen.getByText('Редактировать задачу')).toBeInTheDocument();
      expect(screen.getByLabelText('Заголовок')).toHaveValue('Old Title');
      expect(screen.getByLabelText('Описание')).toHaveValue('Old Desc');
      expect(screen.getByRole('button', { name: /Сохранить/ })).toBeEnabled();
   });
});
