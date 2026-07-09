import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, MapPin, Save, LogOut } from 'lucide-react';

const Profile = () => {
  const { user, logout, login } = useAuth(); // Need login function or a way to update context user
  const [name, setName] = useState(user?.name || '');
  const [location, setLocation] = useState(user?.location || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (!user) {
    return <div className="container py-20 text-center"><h2 className="text-2xl text-yellow">Please login to view profile</h2></div>;
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/auth/profile/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, location })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Profile updated successfully!');
        // Ideally we should update the AuthContext user object here
        // For now, it will update on next login or if we have an update function
      } else {
        setMessage(data.message || 'Update failed');
      }
    } catch (error) {
      setMessage('Server error. Please try again.');
    }
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="container py-24 max-w-2xl mx-auto">
      <div className="glass-panel p-8 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-yellow"></div>
        
        <h2 className="text-3xl font-bold mb-8 text-white flex items-center gap-3">
          <User className="text-yellow" size={32} /> My Account
        </h2>

        {message && <div className="mb-6 p-3 bg-yellow/20 border border-yellow text-yellow rounded-lg">{message}</div>}

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="form-group">
            <label className="block text-sm text-secondary mb-2">Full Name</label>
            <div className="flex items-center glass-panel px-4 py-3 rounded-xl focus-within:border-yellow border border-transparent transition-colors">
              <User size={18} className="text-secondary mr-3" />
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="bg-transparent border-none outline-none text-white w-full"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="block text-sm text-secondary mb-2">Email Address (Cannot be changed)</label>
            <div className="flex items-center glass-panel px-4 py-3 rounded-xl opacity-70">
              <input 
                type="email" 
                value={user.email} 
                disabled
                className="bg-transparent border-none outline-none text-white w-full cursor-not-allowed"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="block text-sm text-secondary mb-2">Delivery Location / Address</label>
            <div className="flex items-center glass-panel px-4 py-3 rounded-xl focus-within:border-yellow border border-transparent transition-colors">
              <MapPin size={18} className="text-secondary mr-3" />
              <input 
                type="text" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter your city or full address"
                className="bg-transparent border-none outline-none text-white w-full"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-primary py-3 rounded-xl flex items-center justify-center gap-2 mt-4"
          >
            <Save size={20} />
            {loading ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-color flex flex-col gap-4">
          <button 
            onClick={logout} 
            className="w-full flex items-center justify-center gap-2 px-6 py-4 glass-panel border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-colors rounded-xl text-lg font-medium"
          >
            <LogOut size={24} /> Logout from this device
          </button>
          
          <button 
            onClick={logout} 
            className="w-full flex items-center justify-center gap-2 px-6 py-4 glass-panel border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-colors rounded-xl text-lg font-medium"
          >
            <LogOut size={24} /> Logout from all devices
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
