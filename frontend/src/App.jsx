import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

// Layout
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AdminLayout from '@/components/layout/AdminLayout'

// Public Pages
import Home from '@/pages/Home'
import Shop from '@/pages/Shop'
import ProductDetail from '@/pages/ProductDetail'
import Cart from '@/pages/Cart'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import ForgotPassword from '@/pages/ForgotPassword'

// Protected Pages
import Checkout from '@/pages/Checkout'
import OrderSuccess from '@/pages/OrderSuccess'
import OrderHistory from '@/pages/OrderHistory'
import Profile from '@/pages/Profile'

// Admin Pages
import Dashboard from '@/pages/admin/Dashboard'
import AdminProducts from '@/pages/admin/Products'
import AdminOrders from '@/pages/admin/Orders'
import AdminCustomers from '@/pages/admin/Customers'
import AdminCategories from '@/pages/admin/Categories'
import AdminCoupons from '@/pages/admin/Coupons'

// Route Guards
const PrivateRoute = ({ children }) => {
  const { token } = useSelector((s) => s.auth)
  return token ? children : <Navigate to="/login" replace />
}

const AdminRoute = ({ children }) => {
  const { token, user } = useSelector((s) => s.auth)
  if (!token) return <Navigate to="/login" replace />
  if (user?.role !== 'admin') return <Navigate to="/" replace />
  return children
}

// Public layout wrapper
const PublicLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
)

export default function App() {
  return (
    <Routes>
      {/* ── Public routes ── */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/shop" element={<PublicLayout><Shop /></PublicLayout>} />
      <Route path="/shop/:category" element={<PublicLayout><Shop /></PublicLayout>} />
      <Route path="/product/:slug" element={<PublicLayout><ProductDetail /></PublicLayout>} />
      <Route path="/cart" element={<PublicLayout><Cart /></PublicLayout>} />
      <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
      <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
      <Route path="/forgot-password" element={<PublicLayout><ForgotPassword /></PublicLayout>} />

      {/* ── Protected routes ── */}
      <Route path="/checkout" element={<PrivateRoute><PublicLayout><Checkout /></PublicLayout></PrivateRoute>} />
      <Route path="/order-success/:id" element={<PrivateRoute><PublicLayout><OrderSuccess /></PublicLayout></PrivateRoute>} />
      <Route path="/orders" element={<PrivateRoute><PublicLayout><OrderHistory /></PublicLayout></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><PublicLayout><Profile /></PublicLayout></PrivateRoute>} />

      {/* ── Admin routes ── */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="coupons" element={<AdminCoupons />} />
      </Route>

      {/* ── 404 ── */}
      <Route path="*" element={<PublicLayout><Navigate to="/" replace /></PublicLayout>} />
    </Routes>
  )
}