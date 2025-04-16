// addEditDialogSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EditDialogState {
   status: 'open' | 'closed' | null;
}

const initialState: EditDialogState = {
   status: null,
};

const addEditDialogSlice = createSlice({
   name: 'addEditDialog',
   initialState,
   reducers: {
      openDialog: (state) => {
         state.status = 'open';
      },
      closeDialog: (state) => {
         state.status = 'closed';
      },
      setStatus: (state, action: PayloadAction<'open' | 'closed' | null>) => {
         state.status = action.payload;
      },
   },
});

export const { openDialog, closeDialog, setStatus } = addEditDialogSlice.actions;
export default addEditDialogSlice.reducer;
