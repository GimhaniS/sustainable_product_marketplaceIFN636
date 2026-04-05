import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCart =() =>{
      navigate('/cart');
  }
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center" style={{backgroundColor: "#286934"}}>
      <Link to="/" className="text-2xl font-bold " style={{fontFamily:"Alexandria"}}>EcoMarket</Link>
      <div>
        {user ? (
  user.role === 'admin' ? (
    <>
      <Link to="/AdminDashboard" className="mr-4">Home</Link>
      <Link to="/AdminOrders" className="mr-4">
        Orders
      </Link>
      <Link to="/AdminSuppliers" className="mr-4">
        Suppliers
      </Link>
      <button
        onClick={handleLogout}
        className="bg-red-500 px-4 py-2 rounded hover:bg-red-700"
      >
              Logout
            </button>
    </>
  ) : (
    <>
      <Link to="/CustomerDashboard" className="mr-4">
        Home
      </Link>
      <Link to="/CustomerOrders" className="mr-4">
        My Orders
      </Link>
      <Link to="/cart" className="mr-4" onClick={handleCart}>
        Cart
      </Link>
       <button
        onClick={handleLogout}
        className="bg-red-500 px-4 py-2 rounded hover:bg-red-700"
      >
              Logout
        </button>
    </>
  )
) : (
  <>
    <Link to="/login" className="mr-4">
      Login
    </Link>
    <Link to="/register" className="mr-4">
      Register
    </Link>
  </>
)}

      </div>
    </nav>
  );
};

export default Navbar;
