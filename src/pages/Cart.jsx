import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import './Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, subtotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty-container flex-col items-center justify-center pt-80 text-center py-8">
        <h2 className="mb-4">Your cart is <span className="text-yellow">Empty</span></h2>
        <p className="text-secondary mb-8">Looks like you haven't added any premium phones yet.</p>
        <Link to="/shop" className="btn btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-container pt-80">
      <div className="container py-8">
        <h1 className="mb-8">Shopping <span className="text-yellow">Cart</span></h1>

        <div className="cart-layout grid">
          <div className="cart-items flex-col gap-4">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item glass-panel flex items-center p-4">
                <img src={item.image} alt={item.name} className="cart-item-img" />
                
                <div className="cart-item-details flex-1 ml-4">
                  <span className="text-xs text-secondary">{item.brand}</span>
                  <h3 className="text-lg">{item.name}</h3>
                  <div className="text-yellow font-bold mt-1">{item.price}</div>
                </div>

                <div className="cart-quantity-controls flex items-center glass-panel px-2 py-1 rounded-full mr-6">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:text-yellow">
                    <Minus size={16} />
                  </button>
                  <span className="px-4 font-bold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:text-yellow">
                    <Plus size={16} />
                  </button>
                </div>

                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="cart-remove-btn p-2 text-secondary hover:text-yellow transition-all"
                  aria-label="Remove item"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary glass-panel p-6 h-fit">
            <h3 className="mb-6 border-b pb-4">Order Summary</h3>
            
            <div className="flex justify-between mb-4">
              <span className="text-secondary">Subtotal</span>
              <span className="font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            
            <div className="flex justify-between mb-4">
              <span className="text-secondary">Shipping</span>
              <span className="text-yellow">Free</span>
            </div>
            
            <div className="flex justify-between mb-6 border-b pb-4">
              <span className="text-secondary">Quality Check</span>
              <span className="text-yellow">Included</span>
            </div>
            
            <div className="flex justify-between items-center mb-8">
              <span className="text-lg">Total</span>
              <span className="text-2xl font-bold text-yellow">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            <Link to="/checkout" className="btn btn-primary w-full text-center flex justify-center items-center">
              Proceed to Checkout <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
