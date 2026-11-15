import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../firebase/config';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ouve mudanças no estado de autenticação em tempo real
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Limpa o listener quando o componente desmonta
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      // Traduz erros comuns do Firebase para português
      let message = 'Erro ao fazer login. Tente novamente.';
      
      if (error.code === 'auth/user-not-found') {
        message = 'Usuário não encontrado.';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Senha incorreta.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'E-mail inválido.';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Muitas tentativas. Tente novamente mais tarde.';
      }
      
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'var(--font-sans)',
        color: 'var(--color-text-secondary)'
      }}>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}