
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DateState {
  date: string | null;
  startDate: string | null;
  endDate: string | null;
}

const initialState: DateState = {
  date: null,
  startDate: null,
  endDate: null,
};

const dateSlice = createSlice({
  name: 'date',
  initialState,
  reducers: {
    setDate: (state, action: PayloadAction<string>) => {
      state.date = action.payload;
    },
    clearDate: (state) => {
      state.date = null;
    },
    setDateRange: (state, action: PayloadAction<{ startDate: string; endDate: string }>) => {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
    clearDateRange: (state) => {
      state.startDate = null;
      state.endDate = null;
    },
  },
});

export const { setDate, clearDate, setDateRange, clearDateRange } = dateSlice.actions;
export default dateSlice.reducer;
