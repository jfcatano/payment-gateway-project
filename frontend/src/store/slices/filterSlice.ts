import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterState } from '../../types'; 
import { RootState } from '../store';

const initialState: FilterState = {
    selectedCategory: 'all', // Show all categories by default
};

const filterSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        setCategoryFilter: (state, action: PayloadAction<string>) => {
            state.selectedCategory = action.payload;
        },
    },
});

export const { setCategoryFilter } = filterSlice.actions;

// --- Selectors ---
export const selectSelectedCategory = (state: RootState) => state.filters.selectedCategory;

export default filterSlice.reducer;