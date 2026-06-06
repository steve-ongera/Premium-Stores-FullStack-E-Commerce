import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as orderApi from '@/api/order.api'

export const fetchOrders = createAsyncThunk('orders/fetchAll', async (_, { rejectWithValue }) => {
  try { return await orderApi.getOrders() }
  catch (err) { return rejectWithValue(err.response?.data?.message) }
})

export const fetchOrder = createAsyncThunk('orders/fetchOne', async (id, { rejectWithValue }) => {
  try { return await orderApi.getOrder(id) }
  catch (err) { return rejectWithValue(err.response?.data?.message) }
})

export const placeOrder = createAsyncThunk('orders/place', async (data, { rejectWithValue }) => {
  try { return await orderApi.createOrder(data) }
  catch (err) { return rejectWithValue(err.response?.data?.message) }
})

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    list: [],
    current: null,
    loading: false,
    placing: false,
    error: null,
  },
  reducers: {
    clearCurrentOrder(state) { state.current = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => { state.loading = true })
      .addCase(fetchOrders.fulfilled, (state, { payload }) => { state.loading = false; state.list = payload })
      .addCase(fetchOrders.rejected, (state, { payload }) => { state.loading = false; state.error = payload })

    builder
      .addCase(fetchOrder.fulfilled, (state, { payload }) => { state.current = payload })

    builder
      .addCase(placeOrder.pending, (state) => { state.placing = true })
      .addCase(placeOrder.fulfilled, (state, { payload }) => { state.placing = false; state.current = payload })
      .addCase(placeOrder.rejected, (state, { payload }) => { state.placing = false; state.error = payload })
  },
})

export const { clearCurrentOrder } = orderSlice.actions
export default orderSlice.reducer