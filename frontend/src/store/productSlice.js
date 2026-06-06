import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as productApi from '@/api/product.api'

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (params, { rejectWithValue }) => {
    try { return await productApi.getProducts(params) }
    catch (err) { return rejectWithValue(err.response?.data?.message) }
  }
)

export const fetchProduct = createAsyncThunk(
  'products/fetchOne',
  async (slug, { rejectWithValue }) => {
    try { return await productApi.getProduct(slug) }
    catch (err) { return rejectWithValue(err.response?.data?.message) }
  }
)

const productSlice = createSlice({
  name: 'products',
  initialState: {
    list: [],
    current: null,
    pagination: { page: 1, limit: 12, total: 0, pages: 0 },
    filters: { category: '', search: '', sort: 'newest', minPrice: '', maxPrice: '' },
    loading: false,
    error: null,
  },
  reducers: {
    setFilters(state, { payload }) {
      state.filters = { ...state.filters, ...payload }
      state.pagination.page = 1
    },
    setPage(state, { payload }) {
      state.pagination.page = payload
    },
    clearCurrent(state) {
      state.current = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchProducts.fulfilled, (state, { payload }) => {
        state.loading = false
        state.list = payload.products
        state.pagination = payload.pagination
      })
      .addCase(fetchProducts.rejected, (state, { payload }) => { state.loading = false; state.error = payload })

    builder
      .addCase(fetchProduct.pending, (state) => { state.loading = true; state.error = null; state.current = null })
      .addCase(fetchProduct.fulfilled, (state, { payload }) => { state.loading = false; state.current = payload })
      .addCase(fetchProduct.rejected, (state, { payload }) => { state.loading = false; state.error = payload })
  },
})

export const { setFilters, setPage, clearCurrent } = productSlice.actions
export default productSlice.reducer