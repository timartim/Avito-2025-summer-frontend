// ReduxStore.ts
import { configureStore } from '@reduxjs/toolkit';
import addEditDialogReducer from '../ReduxSlices/addEditDialogSlice';
import dataReducer from '../ReduxSlices/dataSlice';
export const store = configureStore({
   reducer: {
      addEditDialog: addEditDialogReducer,
      data: dataReducer,
   },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
