import axios from 'axios'
import { store } from '@/store'
import { logout } from '@/store/authSlice'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// ── Request interceptor: attach JWT ───────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor: handle 401 ─────────────────────────────
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout())
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api