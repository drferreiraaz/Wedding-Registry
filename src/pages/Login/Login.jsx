import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock } from 'lucide-react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
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
        
        <button className="mt-lg text-[0.85rem] text-text-muted underline hover:text-text-primary" onClick={() => navigate('/')}>
          Voltar ao site
        </button>
      </div>
    </div>
  );
}

export default Login;
