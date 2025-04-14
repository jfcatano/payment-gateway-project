import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductsState } from '../../types';
import { RootState } from '../store';

const fetchProductsAPI = async (): Promise<Product[]> => {

    const API_URL = import.meta.env.VITE_API_URL;

    const response = await fetch(`${API_URL}/v1/products`);

    if (!response.ok) {
        throw new Error('Error fetching products');
    }
    const data = await response.json();

    return data.products.map((product: Product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category,
        imageUrl: product.imageUrl,
    }));
};

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
    // Aquí harías tu llamada real al backend
    // const response = await axios.get('/api/products');
    // return response.data;
    const response = await fetchProductsAPI();
    return response;
});

const initialState: ProductsState = {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        updateStock: (state, action: PayloadAction<{ product_id: string; newStock: number }>) => {
            const product = state.items.find(p => p.id === action.payload.product_id);
            if (product) {
                product.stock = action.payload.newStock;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Product load failed';
            });
    },
});

export const { updateStock } = productsSlice.actions;

// --- Selectors ---
export const selectAllProducts = (state: RootState) => state.products.items;
export const selectProductById = (state: RootState, product_id: string) =>
    state.products.items.find(product => product.id === product_id);
export const selectProductsStatus = (state: RootState) => state.products.status;
export const selectProductsError = (state: RootState) => state.products.error;

// Selector para obtener categorías únicas
export const selectUniqueCategories = (state: RootState): string[] => {
    const categories = state.products.items.map(p => p.category);
    return ['all', ...new Set(categories)]; // Adds 'all' at the beginning of the array
};

export const selectSelectedCategory = (state: RootState) => state.filters.selectedCategory; // Asegúrate de que este selector esté definido en tu slice de filtros

export default productsSlice.reducer;