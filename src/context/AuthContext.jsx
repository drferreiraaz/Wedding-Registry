import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../firebase/config';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

const AuthContext = createContext();

// ⚠️ LISTA BRANCA: Apenas estes e-mails podem fazer login
const ALLOWED_EMAILS = [
  'davi2580vege@gmail.com',      
  'dgames274@gmail.com',      
  'nicollyvianadossantos4@gmail.com',
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Verifica se o usuário está na whitelist
      if (currentUser && !ALLOWED_EMAILS.includes(currentUser.email)) {
        // Usuário não autorizado: faz logout automaticamente
        signOut(auth);
        setUser(null);
        alert('Acesso negado. Este e-mail não está autorizado.');
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    // Também aplica whitelist no login por e-mail/senha
    if (!ALLOWED_EMAILS.includes(email)) {
      return { success: false, error: 'Este e-mail não está autorizado.' };
    }
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      let message = 'Erro ao fazer login. Tente novamente.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        message = 'E-mail ou senha incorretos.';
      } else if (error.code === 'auth/unauthorized-domain') {
        message = 'Domínio não autorizado.';
      }
      return { success: false, error: message };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;
      
      // Verifica whitelist após login com Google
      if (!ALLOWED_EMAILS.includes(email)) {
        await signOut(auth);
        return { 
          success: false, 
          error: `Acesso negado. O e-mail "${email}" não está autorizado.` 
        };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Erro no login com Google:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        return { success: false, error: 'Login cancelado.' };
      }
      return { success: false, error: 'Não foi possível fazer login com o Google.' };
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <p className="font-sans text-sm text-text-secondary">Carregando...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}