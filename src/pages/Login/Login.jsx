import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock } from 'lucide-react';
import './style.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(username, password);
    if (success) {
      navigate('/');
    } else {
      setError('Usuário ou senha incorretos.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-icon">
          <Lock size={32} />
        </div>
        <h1 className="login-title">Área dos Noivos</h1>
        <p className="login-subtitle">Entre para gerenciar o nosso casamento.</p>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error">{error}</div>}
          <div className="form-group">
            <label className="form-label" htmlFor="username">Usuário</label>
            <input
              id="username"
              className="form-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
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
            />
          </div>
          <button type="submit" className="login-btn">Entrar</button>
        </form>
        <button className="login-back" onClick={() => navigate('/')}>Voltar ao site</button>
      </div>
    </div>
  );
}

export default Login;