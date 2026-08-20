import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedAuth = localStorage.getItem('davi-nicolly-auth');
    if (storedAuth) {
      const parsed = JSON.parse(storedAuth);
      setIsAuthenticated(parsed.isAuthenticated);
      setUser(parsed.user);
    }
  }, []);

  const login = (username, password) => {
    // NOTA DE SEGURANÇA: Esta é uma validação frontend para prototipagem.
    // Em produção, isso deve ser substituído por uma chamada a uma API segura.
    if (username === 'AdminNoivos' && password === '271223D&N') {
      const authData = { isAuthenticated: true, user: 'noivos' };
      setIsAuthenticated(true);
      setUser('noivos');
      localStorage.setItem('davi-nicolly-auth', JSON.stringify(authData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('davi-nicolly-auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}