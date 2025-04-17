import { createSlice, PayloadAction } from '@reduxjs/toolkit';


export interface SnackbarResponse{
   message: string
   status: 'success' | 'error' | null
}

export interface UserAction {
   isLoading: boolean;
   snackbarResponse: SnackbarResponse

}


const initialState: UserAction = {
   isLoading: false,
   snackbarResponse: {
      message: '',
      status: null
   },
};

const userActionSlice = createSlice({
   name: 'userAction',
   initialState,
   reducers: {
      setLoading: (state, action: PayloadAction<boolean>) => {
         state.isLoading = action.payload;
      },

      setSnackbarResponse: (state, action: PayloadAction<SnackbarResponse>) => {
         state.snackbarResponse = action.payload;
      },

   },
});

export const { setLoading, setSnackbarResponse } = userActionSlice.actions;
export default userActionSlice.reducer;
