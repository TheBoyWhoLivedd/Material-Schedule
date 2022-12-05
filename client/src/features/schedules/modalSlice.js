import { createSlice } from "@reduxjs/toolkit";

export const modalSlice = createSlice({
  name: "modal",
  initialState: { open: false },
  reducers: {
    close: (state) => {
      state.open = !state.open;
    },
  },
});

export const { close } = modalSlice.actions;

export default modalSlice.reducer;
