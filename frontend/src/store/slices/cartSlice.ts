import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { CartState, Product } from '../../types';
import { RootState } from '../store';

const initialState: CartState = {
  items: {}, // { product_id: { product_id, quantity } }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Gets the product as payload and adds it to the cart
    addItem: (state, action: PayloadAction<Product>) => {
      const product = action.payload; // The payload is the product
      // Verify if the product is valid and have an ID
      if (!product || !product.id) {
        console.error("Intento de añadir producto inválido:", product);
        return; // Nothing to do if the product is invalid
      }

      const existingItem = state.items[product.id];

      if (existingItem) {
        // Increments the quantity if it is less than the stock
        if (existingItem.quantity < product.stock) {
          existingItem.quantity++;
        }
      } else {
        // Add new item only if there is stock
        if (product.stock > 0) {
          state.items[product.id] = { product_id: product.id, quantity: 1 };
        }
      }
    },
    decreaseItemQuantity: (state, action: PayloadAction<string>) => { // Gets product_id
      const product_id = action.payload;
      const existingItem = state.items[product_id];
      if (existingItem) {
        existingItem.quantity--;
        if (existingItem.quantity <= 0) {
          delete state.items[product_id];
        }
      }
    },
    increaseItemQuantity: (state, action: PayloadAction<{ product_id: string, stock: number }>) => {
      const { product_id, stock } = action.payload;
      const existingItem = state.items[product_id];
      if (existingItem && existingItem.quantity < stock) {
        existingItem.quantity++;
      }
    },
    removeItem: (state, action: PayloadAction<string>) => { // Gets product_id
      const product_id = action.payload;
      delete state.items[product_id];
    },
    clearCart: (state) => {
      state.items = {};
    },
  },
});

export const {
  addItem,
  decreaseItemQuantity,
  increaseItemQuantity,
  removeItem,
  clearCart
} = cartSlice.actions;

// --- Selectors ---
export const selectCartItems = (state: RootState) => state.cart?.items || {};

export const selectCartItemCount = (state: RootState): number => {
  return Object.values(state.cart.items).reduce((total, item) => total + item.quantity, 0);
};

export const selectDetailedCartItems = createSelector(
  [selectCartItems, (state: RootState) => state.products.items],
  (cartItems, products) => {
    return Object.values(cartItems).map(item => {
      const product = products.find(p => p.id === item.product_id);
      return {
        ...item,
        name: product?.name ?? 'Producto not found.',
        price: product?.price ?? 0,
        imageUrl: product?.imageUrl,
        stock: product?.stock ?? 0,
      };
    }).filter(item => item.price > 0); // Ensure that the product was found
  }
);

export const selectCartTotal = createSelector(
  [selectDetailedCartItems],
  (detailedItems) => {
    return detailedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
);

export const selectTotalTax = createSelector(
  [selectCartTotal],
  (total) => {
    const taxRate = 0.19; // Default tax rate of 19%
    return total * taxRate;
  }
);

export default cartSlice.reducer;