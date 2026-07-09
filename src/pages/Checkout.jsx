import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, ShieldCheck, CreditCard, Smartphone } from 'lucide-react';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, subtotal, clearCart } = useCart();
  const { user, openLoginModal } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const directPurchase = location.state?.directPurchase;

  const checkoutItems = directPurchase || cartItems;
  const checkoutTotal = directPurchase 
    ? directPurchase.reduce((total, item) => total + (parseInt(item.price.replace(/[₹,]/g, '')) || 0) * (item.quantity || 1), 0)
    : subtotal;

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: user?.email || '',
    address: '', city: '', state: '', zip: '',
    cardNumber: '', expiry: '', cvv: '', upiId: ''
  });

  useEffect(() => {
    if (!user) {
      openLoginModal();
    }
  }, [user, openLoginModal]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      openLoginModal();
      return;
    }
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      if (!directPurchase) clearCart();
      
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }, 2000);
  };

  if (!user) {
    return (
      <div className="checkout-empty pt-80 py-16 text-center">
        <h2>Please Login to Checkout</h2>
        <button onClick={openLoginModal} className="btn btn-primary mt-6">Login Now</button>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="checkout-success-container flex-col items-center justify-center text-center animate-fade-in pt-80 py-16">
        <div className="success-icon text-yellow mb-6">
          <CheckCircle size={80} />
        </div>
        <h1 className="mb-4">Payment <span className="text-yellow">Successful!</span></h1>
        <p className="text-secondary mb-8">Thank you for your order. Your premium items will be delivered soon.</p>
        <p className="text-sm">Redirecting to homepage...</p>
      </div>
    );
  }

  if (checkoutItems.length === 0) {
    return (
      <div className="checkout-empty pt-80 py-16 text-center">
        <h2>Your cart is empty.</h2>
        <Link to="/shop" className="btn btn-primary mt-6">Go to Shop</Link>
      </div>
    );
  }

  return (
    <div className="checkout-container pt-80">
      <div className="container py-8">
        <h1 className="mb-8">Secure <span className="text-yellow">Checkout</span></h1>
        
        <div className="checkout-layout grid">
          
          <div className="checkout-form-section">
            <form onSubmit={handleSubmit} className="flex-col gap-8">
              
              <div className="form-group glass-panel p-6">
                <h3 className="mb-4 border-b pb-2">Shipping Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input required name="firstName" onChange={handleInputChange} type="text" placeholder="First Name" className="form-input" />
                  <input required name="lastName" onChange={handleInputChange} type="text" placeholder="Last Name" className="form-input" />
                  <input required name="email" onChange={handleInputChange} type="email" placeholder="Email Address" value={formData.email} className="form-input col-span-2" />
                  <input required name="address" onChange={handleInputChange} type="text" placeholder="Street Address" className="form-input col-span-2" />
                  <input required name="city" onChange={handleInputChange} type="text" placeholder="City" className="form-input" />
                  <div className="grid grid-cols-2 gap-4">
                    <input required name="state" onChange={handleInputChange} type="text" placeholder="State" className="form-input" />
                    <input required name="zip" onChange={handleInputChange} type="text" placeholder="ZIP Code" className="form-input" />
                  </div>
                </div>
              </div>

              <div className="form-group glass-panel p-6">
                <h3 className="mb-4 border-b pb-2 flex justify-between items-center">
                  Payment Method
                  <ShieldCheck size={20} className="text-yellow" />
                </h3>
                
                <div className="flex gap-4 mb-6">
                  <button 
                    type="button" 
                    onClick={() => setPaymentMethod('card')}
                    className={`flex-1 py-3 border rounded flex items-center justify-center gap-2 transition-all ${paymentMethod === 'card' ? 'border-yellow text-yellow' : 'border-color text-secondary'}`}
                  >
                    <CreditCard size={20} /> Credit/Debit Card
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setPaymentMethod('upi')}
                    className={`flex-1 py-3 border rounded flex items-center justify-center gap-2 transition-all ${paymentMethod === 'upi' ? 'border-yellow text-yellow' : 'border-color text-secondary'}`}
                  >
                    <Smartphone size={20} /> UPI
                  </button>
                </div>

                {paymentMethod === 'card' ? (
                  <div className="grid grid-cols-2 gap-4 animate-fade-in">
                    <input required name="cardNumber" onChange={handleInputChange} type="text" placeholder="Card Number" className="form-input col-span-2" maxLength="19" />
                    <input required name="expiry" onChange={handleInputChange} type="text" placeholder="MM/YY" className="form-input" maxLength="5" />
                    <input required name="cvv" onChange={handleInputChange} type="password" placeholder="CVV" className="form-input" maxLength="3" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 animate-fade-in">
                    <input required name="upiId" onChange={handleInputChange} type="text" placeholder="Enter UPI ID (e.g., 9876543210@ybl)" className="form-input" />
                    <p className="text-xs text-secondary mt-2">You will receive a payment request on your UPI app.</p>
                  </div>
                )}
              </div>

              <button type="submit" className="btn btn-primary w-full py-4 text-lg" disabled={isProcessing}>
                {isProcessing ? 'Processing Payment...' : `Pay ₹${checkoutTotal.toLocaleString('en-IN')}`}
              </button>

            </form>
          </div>

          <aside className="checkout-summary glass-panel p-6 h-fit">
            <h3 className="mb-6 border-b pb-4">Order Summary</h3>
            
            <div className="checkout-items flex-col gap-4 mb-6 border-b pb-4">
              {checkoutItems.map((item, index) => (
                <div key={item.id || index} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded bg-main" />
                    <div>
                      <div className="font-bold">{item.name}</div>
                      <div className="text-secondary text-xs">Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <div className="font-bold">{item.price}</div>
                </div>
              ))}
            </div>

            <div className="flex justify-between mb-4 text-sm">
              <span className="text-secondary">Subtotal</span>
              <span className="font-bold">₹{checkoutTotal.toLocaleString('en-IN')}</span>
            </div>
            
            <div className="flex justify-between mb-8 text-sm border-b pb-4">
              <span className="text-secondary">Shipping</span>
              <span className="text-yellow">Free</span>
            </div>

            <div className="flex justify-between items-center mb-4">
              <span className="text-lg">Total</span>
              <span className="text-2xl font-bold text-yellow">₹{checkoutTotal.toLocaleString('en-IN')}</span>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
