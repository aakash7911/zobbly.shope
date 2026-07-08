import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null if not logged in
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Check local storage for persistent mock session
  useEffect(() => {
    const storedUser = localStorage.getItem('zobbly_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      if (parsedUser.email === 'admin@zobbly.shope') {
        setIsAdmin(true);
      }
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('zobbly_user', JSON.stringify(userData));
    if (userData.email === 'admin@zobbly.shope') {
      setIsAdmin(true);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('zobbly_user');
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin,
      login,
      logout,
      isLoginModalOpen,
      openLoginModal,
      closeLoginModal
    }}>
      {children}
    </AuthContext.Provider>
  );
};
