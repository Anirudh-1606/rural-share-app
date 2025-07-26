import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ListingState {
  categoryId: string | null;
  subCategoryId: string | null;
}

const initialState: ListingState = {
  categoryId: null,
  subCategoryId: null,
};

const listingSlice = createSlice({
  name: 'listing',
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<string>) => {
      state.categoryId = action.payload;
    },
    setSubCategory: (state, action: PayloadAction<string>) => {
      state.subCategoryId = action.payload;
    },
    clearCategories: (state) => {
      state.categoryId = null;
      state.subCategoryId = null;
    },
  },
});

export const { setCategory, setSubCategory, clearCategories } = listingSlice.actions;

export default listingSlice.reducer;
