import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import productsReducer from './slices/productsSlice';
import filterReducer from './slices/filterSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer,
    filters: filterReducer,
  },
});

// Types for using with useSelector and useDispatch hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;