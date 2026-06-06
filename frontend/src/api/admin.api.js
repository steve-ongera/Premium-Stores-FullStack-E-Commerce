import api from './axiosInstance'

export const getDashboard = () => api.get('/admin/dashboard')
export const getAllOrders = (params) => api.get('/admin/orders', { params })
export const updateOrderStatus = (id, status) => api.put(`/admin/orders/${id}/status`, { status })
export const getAllCustomers = (params) => api.get('/admin/customers', { params })
export const getCategories = () => api.get('/categories')
export const createCategory = (data) => api.post('/categories', data)
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data)
export const deleteCategory = (id) => api.delete(`/categories/${id}`)
export const getCoupons = () => api.get('/coupons')
export const createCoupon = (data) => api.post('/coupons', data)
export const deleteCoupon = (id) => api.delete(`/coupons/${id}`)