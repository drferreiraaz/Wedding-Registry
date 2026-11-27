import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock } from 'lucide-react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    const result = await loginWithGoogle();
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-md">
      <div className="bg-surface border border-border-light rounded-lg p-2xl w-full max-w-[400px] text-center shadow-md">
        <div className="w-16 h-16 bg-primary-lighter text-primary rounded-full flex items-center justify-center mx-auto mb-md">
          <Lock size={32} />
        </div>
        <h1 className="font-serif text-[1.5rem] font-semibold text-text-primary mb-xs">Área dos Noivos</h1>
        <p className="text-[0.9rem] text-text-secondary mb-xl">Entre para gerenciar o nosso casamento.</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-md text-left" autoComplete="off">
          {error && <div className="bg-badge-high text-badge-high-text p-sm rounded-sm text-[0.85rem] text-center">{error}</div>}
          
          <div className="form-group">
            <label className="form-label" htmlFor="email">E-mail</label>
            <input
              id="email"
              className="form-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="password">Senha</label>
            <input
              id="password"
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full p-[12px] bg-primary text-white rounded-sm text-[0.9rem] font-semibold mt-sm transition-colors duration-200 ease-[ease] hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {/* Divisor visual */}
        <div className="flex items-center gap-sm my-lg">
          <div className="flex-1 h-px bg-border"></div>
          <span className="text-[0.75rem] text-text-muted uppercase tracking-wider">ou</span>
          <div className="flex-1 h-px bg-border"></div>
        </div>

        {/* Botão do Google */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-sm py-[12px] px-md bg-white border border-border rounded-sm text-[0.9rem] font-semibold text-text-primary transition-colors duration-200 ease-[ease] hover:bg-surface-alt disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Entrar com Google
        </button>
        
        <button className="mt-lg text-[0.85rem] text-text-muted underline hover:text-text-primary" onClick={() => navigate('/')}>
          Voltar ao site
        </button>
      </div>
    </div>
  );
}

export default Login;