import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import LoginModal from './components/LoginModal';
import AdminLayout from './components/AdminLayout';
import Profile from './pages/Profile';
import { useAuth } from './context/AuthContext';

function App() {
  const { isAdmin } = useAuth();

  // If Admin is logged in, show ONLY the Admin Panel
  if (isAdmin) {
    return <AdminLayout />;
  }

  // Otherwise show the Customer Storefront
  return (
    <div className="app-container">
      <Navbar />
      <LoginModal />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
