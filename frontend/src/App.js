import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Tasks from './pages/Tasks';
import CustomerDashboard from './pages/CustomerDashboard';
import Cart from './pages/Cart';
import CustomerOrders from './pages/CustomerOrders'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/CustomerDashboard" element={<CustomerDashboard />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/CustomerOrders" element={<CustomerOrders />} />
      </Routes>
    </Router>
  );
}

export default App;
