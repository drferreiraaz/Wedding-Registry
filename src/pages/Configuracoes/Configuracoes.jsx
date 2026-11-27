import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ImageUpload from '../../components/ImageUpload/ImageUpload';
import { LogOut } from 'lucide-react';

function Configuracoes() {
  const { data, updateData } = useOutletContext();
  const { isAuthenticated, logout } = useAuth();
  const [names, setNames] = useState(data.couple.names);

  if (!isAuthenticated) {
    return (
      <div className="p-xl max-w-[1000px] max-mobile:p-md">
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
    <div className="p-xl max-w-[1000px] max-mobile:p-md">
      <div className="page-header-simple">
        <span className="page-header-tag">SISTEMA</span>
        <h1 className="page-header-title">Configurações</h1>
        <p className="page-header-subtitle">Gerencie as informações do sistema</p>
      </div>
      
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-lg max-mobile:grid-cols-1">
        <div className="bg-surface border border-border-light rounded-lg p-lg">
          <h3 className="font-serif text-[1.2rem] font-semibold text-text-primary mb-md pb-sm border-b border-border-light">Conta</h3>
          <div className="flex justify-between items-center py-sm">
            <span className="text-[0.9rem] text-text-secondary">Usuário</span>
            <span className="text-[0.9rem] font-medium text-text-primary">AdminNoivos</span>
          </div>
          <div className="flex justify-between items-center py-sm">
            <span className="text-[0.9rem] text-text-secondary">Status</span>
            <span className="text-[0.9rem] font-semibold text-success">🔐 Autenticado</span>
          </div>
          <button className="flex items-center justify-center gap-sm w-full p-[10px] rounded-sm text-[0.9rem] font-medium mt-md border cursor-pointer bg-surface-alt text-danger border-border hover:bg-badge-high hover:border-badge-high-text hover:text-badge-high-text" onClick={logout}>
            <LogOut size={16} /> Sair da conta
          </button>
        </div>

        <div className="bg-surface border border-border-light rounded-lg p-lg">
          <h3 className="font-serif text-[1.2rem] font-semibold text-text-primary mb-md pb-sm border-b border-border-light">Casal</h3>
          <div className="form-group">
            <label className="form-label">Nomes do Casal</label>
            <input className="form-input" value={names} onChange={e => setNames(e.target.value)} placeholder="Ex: Davi & Nicolly" />
          </div>
          <button className="flex items-center justify-center gap-sm w-full p-[10px] rounded-sm text-[0.9rem] font-medium mt-md border-none cursor-pointer bg-primary text-white hover:bg-primary-hover" onClick={handleSaveNames}>Salvar Nomes</button>
          
          <div className="form-group mt-lg">
            <label className="form-label">Foto do Casal (Sidebar)</label>
            <ImageUpload 
              currentImage={data.couple.photoUrl} 
              onImageChange={(url) => updateData(prev => ({ ...prev, couple: { ...prev.couple, photoUrl: url } }))} 
              label="Foto do casal" 
            />
          </div>
        </div>

        <div className="bg-surface border border-border-light rounded-lg p-lg">
          <h3 className="font-serif text-[1.2rem] font-semibold text-text-primary mb-md pb-sm border-b border-border-light">Segurança</h3>
          <p className="text-[0.9rem] text-text-secondary leading-[1.6]">
            Para alterar a senha ou configurar autenticação avançada, esta funcionalidade estará disponível quando o sistema for migrado para um backend com banco de dados.
          </p>
          <p className="mt-sm text-[0.8rem] text-text-muted leading-[1.6]">
            Nota: A autenticação atual é baseada em localStorage para fins de prototipagem e testes locais.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Configuracoes;
