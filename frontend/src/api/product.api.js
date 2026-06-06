import api from './axiosInstance'

export const getProducts = (params) => api.get('/products', { params })
export const getProduct = (slug) => api.get(`/products/${slug}`)
export const searchProducts = (q) => api.get('/products/search', { params: { q } })
export const getFeatured = () => api.get('/products/featured')
export const getRelated = (id) => api.get(`/products/${id}/related`)

// Admin
export const createProduct = (data) => api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } })
export const updateProduct = (id, data) => api.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
export const deleteProduct = (id) => api.delete(`/products/${id}`)