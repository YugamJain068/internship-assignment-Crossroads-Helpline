import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  UserData: []
};

const randomUserSlice = createSlice({
  name: 'randomUser',
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.UserData.push(action.payload);
    },

    updateUser: (state, action) => { 
      const { uid, updatedData } = action.payload;
      const index = state.UserData.findIndex(user => user.uid === uid);

      if (index !== -1) {
        state.UserData[index] = {
          ...state.UserData[index],
          ...updatedData
        };
      }
    },
    deleteUser: (state, action) => {
      const uid = action.payload;
      state.UserData = state.UserData.filter(user => user.uid !== uid);
    },
    resetUserData: (state) => {
      state.UserData = [];
    }
  }
});

export const { addUser,updateUser, deleteUser,resetUserData } = randomUserSlice.actions;
export default randomUserSlice.reducer;
