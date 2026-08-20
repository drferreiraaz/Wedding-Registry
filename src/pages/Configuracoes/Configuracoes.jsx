import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ImageUpload from '../../components/ImageUpload/ImageUpload';
import { LogOut } from 'lucide-react';
import './style.css';

function Configuracoes() {
  const { data, updateData } = useOutletContext();
  const { isAuthenticated, logout } = useAuth();
  const [names, setNames] = useState(data.couple.names);

  if (!isAuthenticated) {
    return (
      <div className="configuracoes-page">
        <div className="page-header-simple">
          <span className="page-header-tag">SISTEMA</span>
          <h1 className="page-header-title">Configurações</h1>
        </div>
        <div className="empty-state">
          <p>Esta área é restrita aos noivos.</p>
          <p>Faça login para gerenciar as configurações.</p>
        </div>
      </div>
    );
  }

  const handleSaveNames = () => {
    updateData(prev => ({ ...prev, couple: { ...prev.couple, names } }));
    alert('Nomes atualizados com sucesso!');
  };

  return (
    <div className="configuracoes-page">
      <div className="page-header-simple">
        <span className="page-header-tag">SISTEMA</span>
        <h1 className="page-header-title">Configurações</h1>
        <p className="page-header-subtitle">Gerencie as informações do sistema</p>
      </div>
      
      <div className="settings-grid">
        <div className="settings-card">
          <h3 className="settings-card-title">Conta</h3>
          <div className="settings-row">
            <span className="settings-label">Usuário</span>
            <span className="settings-value">AdminNoivos</span>
          </div>
          <div className="settings-row">
            <span className="settings-label">Status</span>
            <span className="settings-value settings-status-logged">🔐 Autenticado</span>
          </div>
          <button className="settings-btn settings-btn-danger" onClick={logout}>
            <LogOut size={16} /> Sair da conta
          </button>
        </div>

        <div className="settings-card">
          <h3 className="settings-card-title">Casal</h3>
          <div className="form-group">
            <label className="form-label">Nomes do Casal</label>
            <input className="form-input" value={names} onChange={e => setNames(e.target.value)} placeholder="Ex: Davi & Nicolly" />
          </div>
          <button className="settings-btn settings-btn-primary" onClick={handleSaveNames}>Salvar Nomes</button>
          
          <div className="form-group" style={{ marginTop: 'var(--spacing-lg)' }}>
            <label className="form-label">Foto do Casal (Sidebar)</label>
            <ImageUpload 
              currentImage={data.couple.photoUrl} 
              onImageChange={(url) => updateData(prev => ({ ...prev, couple: { ...prev.couple, photoUrl: url } }))} 
              label="Foto do casal" 
            />
          </div>
        </div>

        <div className="settings-card">
          <h3 className="settings-card-title">Segurança</h3>
          <p className="settings-text">
            Para alterar a senha ou configurar autenticação avançada, esta funcionalidade estará disponível quando o sistema for migrado para um backend com banco de dados.
          </p>
          <p className="settings-text" style={{ marginTop: 'var(--spacing-sm)', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            Nota: A autenticação atual é baseada em localStorage para fins de prototipagem e testes locais.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Configuracoes;