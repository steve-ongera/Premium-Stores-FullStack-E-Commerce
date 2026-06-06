import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login, register, fetchMe } from '@/store/authSlice'
import { logout } from '@/store/authSlice'
import { clearCart } from '@/store/cartSlice'
import { useEffect } from 'react'

export function useAuth() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, token, loading, error } = useSelector((s) => s.auth)

  // Hydrate user from token on mount
  useEffect(() => {
    if (token && !user) {
      dispatch(fetchMe())
    }
  }, [token, user, dispatch])

  const handleLogin = async (credentials) => {
    const result = await dispatch(login(credentials))
    if (!result.error) navigate('/')
    return result
  }

  const handleRegister = async (data) => {
    const result = await dispatch(register(data))
    if (!result.error) navigate('/')
    return result
  }

  const handleLogout = () => {
    dispatch(logout())
    dispatch(clearCart())
    navigate('/login')
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'admin',
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  }
}