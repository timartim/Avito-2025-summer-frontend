import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Board {
   id: number;
   name: string;
   description: string;

}

export interface Assignee {
   id: number;
   fullName: string;
   email: string;
   avatarUrl: string;

}

interface DataState {
   boards: Board[];
   users: Assignee[];
}


const initialState: DataState = {
   boards: [],
   users: [],
};

const dataSlice = createSlice({
   name: 'data',
   initialState,
   reducers: {
      setBoards: (state, action: PayloadAction<Board[]>) => {
         state.boards = action.payload;
      },

      setUsers: (state, action: PayloadAction<Assignee[]>) => {
         state.users = action.payload;
      },
   },
});

export const { setBoards, setUsers } = dataSlice.actions;
export default dataSlice.reducer;
