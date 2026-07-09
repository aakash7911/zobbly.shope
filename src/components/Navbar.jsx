import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, Search, X, User, LogOut, Settings } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { user, isAdmin, openLoginModal, logout } = useAuth();

  const navLinks = [
    { name: 'Phones', path: '/shop?category=phones' },
    { name: 'Clothes', path: '/shop?category=clothes' },
    { name: 'Beauty', path: '/shop?category=beauty' },
  ];

  return (
    <header className="navbar-container glass-panel">
      <div className="container flex items-center justify-between navbar-inner">
        
        {/* Logo */}
        <Link to="/" className="brand-logo">
          Zobbly<span className="text-yellow">.shope</span>
        </Link>

        {/* Global Search Bar (Flipkart Style) */}
        <form 
          onSubmit={(e) => { e.preventDefault(); if(searchTerm) navigate(`/shop?search=${searchTerm}`); }}
          className="global-search hidden md:flex items-center glass-panel px-4 py-2 rounded-full flex-1 mx-8 max-w-lg"
        >
          <input 
            type="text" 
            placeholder="Search for Phones, Clothes, Beauty products..." 
            className="bg-transparent border-none outline-none text-white w-full text-sm" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="text-yellow"><Search size={18} /></button>
        </form>

        {/* Desktop Navigation & Auth */}
        <nav className="desktop-nav">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link to={link.path} className="nav-link">{link.name}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Icons */}
        <div className="nav-icons flex items-center gap-4 ml-4">
          
          {isAdmin && (
            <Link to="/admin" className="icon-btn text-yellow" title="Admin Panel">
              <Settings size={20} />
            </Link>
          )}

          {user ? (
            <Link to="/profile" className="icon-btn flex items-center gap-2 text-yellow" title="My Profile">
              <User size={20} />
              <span className="text-sm hidden lg:block">{user.name}</span>
            </Link>
          ) : (
            <button onClick={openLoginModal} className="icon-btn flex items-center gap-2" title="Login">
              <User size={20} />
              <span className="text-sm hidden lg:block">Login</span>
            </button>
          )}
          
          <Link to="/cart" className="cart-btn" aria-label="Cart">
            <ShoppingCart size={20} />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-btn ml-2" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>


      {/* Mobile Menu Dropdown */}
      <div className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
        <ul className="flex flex-col gap-4">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link 
                to={link.path} 
                className="mobile-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
