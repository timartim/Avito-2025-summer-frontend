// tests/unit/pages/AllTasks.test.tsx

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { MemoryRouter } from 'react-router-dom'
// Исправленный путь к компоненте
import AllTasks from '../../../src/Components/Pages/AllTasks'
import dataReducer from '../../../src/ReduxSlices/dataSlice'
import { Task } from '../../../src/Interfaces/appInterfaces'
import { Filter } from '../../../src/Interfaces/serviceInterfaces'

// фиктивные данные
const tasks: Task[] = [
   { id: 1, title: 'First Task', description: '', priority: 'Low', assigneeId: 0, boardId: 1, boardName: 'A' },
   { id: 2, title: 'Second Task', description: '', priority: 'High', assigneeId: 0, boardId: 2, boardName: 'B' },
]
const boards = [
   { id: 1, name: 'A' },
   { id: 2, name: 'B' },
]

function renderAllTasks() {
   const store = configureStore({
      reducer: { data: dataReducer },
      preloadedState: {
         data: { tasks, boards, users: [], loading: false, error: null },
      },
   })

   render(
      <Provider store={store}>
         <MemoryRouter>
            <AllTasks />
         </MemoryRouter>
      </Provider>
   )
}

describe('AllTasks Page', () => {
   it('показывает все задачи по умолчанию', async () => {
      renderAllTasks()
      expect(await screen.findByText('First Task')).toBeInTheDocument()
      expect(await screen.findByText('Second Task')).toBeInTheDocument()
   })

   it('фильтрует задачи по тексту поиска', async () => {
      renderAllTasks()
      const input = screen.getByLabelText(/Поиск/i)
      fireEvent.change(input, { target: { value: 'Second' } })
      expect(await screen.findByText('Second Task')).toBeInTheDocument()
      expect(screen.queryByText('First Task')).toBeNull()
   })

   it('открывает фильтры по кнопке', async () => {
      renderAllTasks()
      fireEvent.click(screen.getByRole('button', { name: /Фильтры/i }))
      expect(await screen.findByRole('heading', { name: /Фильтры/i })).toBeInTheDocument()
   })

   it('открывает диалог редактирования по клику на задачу', async () => {
      renderAllTasks()
      fireEvent.click(await screen.findByText('Second Task'))
      expect(await screen.findByRole('heading', { name: /Редактировать задачу/i })).toBeInTheDocument()
   })
})
