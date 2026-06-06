import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as authApi from '@/api/auth.api'

// ─── Async thunks ────────────────────────────────────────────────
export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const data = await authApi.login(credentials)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed')
  }
})

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const data = await authApi.register(userData)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed')
  }
})

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    return await authApi.getMe()
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

// ─── Slice ───────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
  },
  reducers: {
    setCredentials(state, { payload }) {
      state.user = payload.user
      state.token = payload.token
      localStorage.setItem('token', payload.token)
    },
    logout(state) {
      state.user = null
      state.token = null
      localStorage.removeItem('token')
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.loading = false
        state.user = payload.user
        state.token = payload.token
        localStorage.setItem('token', payload.token)
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.loading = false
        state.error = payload
      })
    // Register
    builder
      .addCase(register.pending, (state) => { state.loading = true; state.error = null })
      .addCase(register.fulfilled, (state, { payload }) => {
        state.loading = false
        state.user = payload.user
        state.token = payload.token
        localStorage.setItem('token', payload.token)
      })
      .addCase(register.rejected, (state, { payload }) => {
        state.loading = false
        state.error = payload
      })
    // fetchMe
    builder
      .addCase(fetchMe.fulfilled, (state, { payload }) => { state.user = payload })
      .addCase(fetchMe.rejected, (state) => { state.user = null; state.token = null; localStorage.removeItem('token') })
  },
})

export const { setCredentials, logout, clearError } = authSlice.actions
export default authSlice.reducer