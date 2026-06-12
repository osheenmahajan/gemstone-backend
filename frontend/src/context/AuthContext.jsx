import { useState } from 'react';
import { safeParse } from './authContextConstants.js';
import { AuthContext } from './AuthContextBase.jsx';

export function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {

    const saved = localStorage.getItem('user');
    return saved ? safeParse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const login = (userData, jwt) => {
    setUser(userData);
    setToken(jwt);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', jwt);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Call this after profile update to keep localStorage in sync
  const updateUser = (updated) => {
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Note: useAuth is intentionally placed in a separate file to satisfy react-refresh/only-export-components.






