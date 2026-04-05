import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CustomerDashboard from './pages/CustomerDashboard';
import CustomerOrders from './pages/CustomerOrders';
import Cart from './pages/Cart';

import AdminDashboard from './pages/AdminDashboard';
import AdminSuppliers from './pages/AdminSuppliers';
import AdminOrders from './pages/AdminOrders';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/*  PROTECTED  */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/CustomerDashboard"
          element={
            <ProtectedRoute>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/CustomerOrders"
          element={
            <ProtectedRoute>
              <CustomerOrders />
            </ProtectedRoute>
          }
        />

        {/*  ADMIN ONLY */}
        <Route
          path="/AdminDashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/AdminSuppliers"
          element={
            <AdminRoute>
              <AdminSuppliers />
            </AdminRoute>
          }
        />

        <Route
          path="/AdminOrders"
          element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;