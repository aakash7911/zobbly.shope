import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Mail, Phone, Lock, User as UserIcon } from 'lucide-react';
import './LoginModal.css';

const LoginModal = () => {
  const { isLoginModalOpen, closeLoginModal, login } = useAuth();
  
  const [mode, setMode] = useState('signin'); // 'signin' or 'signup'
  const [step, setStep] = useState(1); // 1: Details, 2: OTP (only for signup)
  const [method, setMethod] = useState('email'); // 'email' or 'phone'
  
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');

  if (!isLoginModalOpen) return null;

  const handleSignIn = (e) => {
    e.preventDefault();
    // For admin login
    if (identifier === 'admin@zobbly.shope' && password === 'admin') {
      login({ email: identifier, role: 'admin', name: 'Admin Zobbly' });
    } else {
      // Mock User Auth (Accepts any password for testing)
      login({ 
        email: method === 'email' ? identifier : null, 
        phone: method === 'phone' ? identifier : null, 
        role: 'user', 
        name: 'Zobbly User' 
      });
    }
    resetAndClose();
  };

  const handleSignUpNext = (e) => {
    e.preventDefault();
    if (!name || !identifier || !password) return;
    setStep(2); // Ask for OTP
  };

  const handleSignUpVerify = (e) => {
    e.preventDefault();
    if (!otp) return;
    
    login({ 
      email: method === 'email' ? identifier : null, 
      phone: method === 'phone' ? identifier : null, 
      role: 'user', 
      name: name 
    });
    
    resetAndClose();
  };

  const resetAndClose = () => {
    setStep(1);
    setIdentifier('');
    setPassword('');
    setOtp('');
    setName('');
    closeLoginModal();
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setStep(1);
    setIdentifier('');
    setName('');
    setPassword('');
    setOtp('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel animate-fade-in">
        <button className="modal-close" onClick={closeLoginModal}>
          <X size={24} />
        </button>
        
        <div className="text-center mb-6">
          <h2 className="mb-2">
            {mode === 'signin' ? 'Sign In' : 'Create Account'} <span className="text-yellow">Zobbly</span>
          </h2>
          <p className="text-secondary text-sm">
            {mode === 'signin' ? 'Welcome back! Enter your details.' : 'Register to order premium devices.'}
          </p>
        </div>

        {mode === 'signin' ? (
          // --- SIGN IN FORM ---
          <form onSubmit={handleSignIn} className="flex-col gap-4">
            
            <div className="flex bg-surface-hover p-1 rounded mb-4">
              <button type="button" className={`flex-1 py-2 text-sm rounded ${method === 'email' ? 'bg-main text-yellow' : 'text-secondary'}`} onClick={() => setMethod('email')}>Email</button>
              <button type="button" className={`flex-1 py-2 text-sm rounded ${method === 'phone' ? 'bg-main text-yellow' : 'text-secondary'}`} onClick={() => setMethod('phone')}>Phone Number</button>
            </div>

            <div className="input-group">
              <span className="input-icon">
                {method === 'email' ? <Mail size={18} /> : <Phone size={18} />}
              </span>
              <input 
                type={method === 'email' ? 'email' : 'tel'} 
                placeholder={method === 'email' ? 'Email Address' : 'Phone Number'}
                className="form-input with-icon"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <span className="input-icon"><Lock size={18} /></span>
              <input 
                type="password" 
                placeholder="Password"
                className="form-input with-icon"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-full mt-2">Sign In</button>
            
            <div className="text-center mt-4 text-sm text-secondary">
              Don't have an account? <button type="button" onClick={() => switchMode('signup')} className="text-yellow hover:underline">Sign Up</button>
            </div>
          </form>

        ) : (
          // --- SIGN UP FORM ---
          step === 1 ? (
            <form onSubmit={handleSignUpNext} className="flex-col gap-4">
              
              <div className="flex bg-surface-hover p-1 rounded mb-4">
                <button type="button" className={`flex-1 py-2 text-sm rounded ${method === 'email' ? 'bg-main text-yellow' : 'text-secondary'}`} onClick={() => setMethod('email')}>Email</button>
                <button type="button" className={`flex-1 py-2 text-sm rounded ${method === 'phone' ? 'bg-main text-yellow' : 'text-secondary'}`} onClick={() => setMethod('phone')}>Phone Number</button>
              </div>

              <div className="input-group">
                <span className="input-icon"><UserIcon size={18} /></span>
                <input type="text" placeholder="Full Name" className="form-input with-icon" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div className="input-group">
                <span className="input-icon">
                  {method === 'email' ? <Mail size={18} /> : <Phone size={18} />}
                </span>
                <input 
                  type={method === 'email' ? 'email' : 'tel'} 
                  placeholder={method === 'email' ? 'Email Address' : 'Phone Number'}
                  className="form-input with-icon" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
              </div>

              <div className="input-group">
                <span className="input-icon"><Lock size={18} /></span>
                <input type="password" placeholder="Create Password" className="form-input with-icon" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>

              <button type="submit" className="btn btn-primary w-full mt-2">Register & Get OTP</button>
              
              <div className="text-center mt-4 text-sm text-secondary">
                Already have an account? <button type="button" onClick={() => switchMode('signin')} className="text-yellow hover:underline">Sign In</button>
              </div>
            </form>
          ) : (
            // --- OTP VERIFICATION (Only for Sign Up) ---
            <form onSubmit={handleSignUpVerify} className="flex-col gap-4">
              <div className="text-sm text-secondary mb-4 text-center">
                Enter OTP sent to <span className="text-white font-bold">{identifier}</span>
                <button type="button" onClick={() => setStep(1)} className="text-yellow ml-2 hover:underline">Edit</button>
              </div>

              <div className="input-group">
                <span className="input-icon"><Lock size={18} /></span>
                <input type="text" placeholder="Enter OTP (Mock: Any 6 digits)" className="form-input with-icon" value={otp} onChange={(e) => setOtp(e.target.value)} required />
              </div>

              <button type="submit" className="btn btn-primary w-full mt-2">Verify & Create Account</button>
            </form>
          )
        )}
      </div>
    </div>
  );
};

export default LoginModal;
