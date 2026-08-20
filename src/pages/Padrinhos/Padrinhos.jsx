import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ImageUpload from '../../components/ImageUpload/ImageUpload';
import { Plus, Trash2, Edit3 } from 'lucide-react';
import './style.css';

function Padrinhos() {
  const { data, updateData } = useOutletContext();
  const { isAuthenticated } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', side: 'Ambos', type: 'Padrinho/Madrinha', role: '', notes: '', photoUrl: null });

  const openNew = () => {
    setEditing(null);
    setFormData({ name: '', side: 'Ambos', type: 'Padrinho/Madrinha', role: '', notes: '', photoUrl: null });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setFormData({ ...item });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;
    updateData(prev => {
      if (editing) {
        return { ...prev, godparents: prev.godparents.map(g => g.id === editing.id ? { ...formData, id: editing.id } : g) };
      }
      return { ...prev, godparents: [...prev.godparents, { id: `god-${Date.now()}`, ...formData }] };
    });
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    updateData(prev => ({ ...prev, godparents: prev.godparents.filter(g => g.id !== id) }));
  };

  return (
    <div className="padrinhos-page">
      <div className="page-header-simple">
        <span className="page-header-tag">PESSOAS</span>
        <h1 className="page-header-title">Padrinhos</h1>
        <p className="page-header-subtitle">Quem estará ao nosso lado no altar</p>
      </div>
      
      {data.godparents.length === 0 ? (
        <div className="empty-state">
          <p>Ainda não cadastramos nossos padrinhos.</p>
          {isAuthenticated && <button className="empty-state-btn" onClick={openNew}>+ Adicionar padrinho</button>}
        </div>
      ) : (
        <div className="godparents-grid">
          {data.godparents.map(godparent => (
            <div key={godparent.id} className="godparent-card">
              <div className="godparent-photo">
                {godparent.photoUrl ? (
                  <img src={godparent.photoUrl} alt={godparent.name} />
                ) : (
                  <div className="godparent-photo-placeholder">{godparent.name.charAt(0)}</div>
                )}
              </div>
              <div className="godparent-info">
                <h3 className="godparent-name">{godparent.name}</h3>
                <span className="godparent-badge">{godparent.side}</span>
                <p className="godparent-type">{godparent.type}</p>
                {godparent.role && <p className="godparent-role">{godparent.role}</p>}
                {godparent.notes && <p className="godparent-notes">{godparent.notes}</p>}
              </div>
              {isAuthenticated && (
                <div className="godparent-actions">
                  <button onClick={() => openEdit(godparent)}><Edit3 size={14} /></button>
                  <button className="danger" onClick={() => handleDelete(godparent.id)}><Trash2 size={14} /></button>
                </div>
              )}
            </div>
          ))}
          {isAuthenticated && (
            <button className="godparent-card godparent-add" onClick={openNew}>
              <Plus size={32} />
              <span>Adicionar</span>
            </button>
          )}
        </div>
      )}

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editing ? 'Editar Padrinho' : 'Novo Padrinho'}</h2>
              <button className="modal-close" onClick={() => setModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Foto</label>
                <ImageUpload currentImage={formData.photoUrl} onImageChange={(url) => setFormData({...formData, photoUrl: url})} label="Foto do padrinho" />
              </div>
              <div className="form-group">
                <label className="form-label">Nome</label>
                <input className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Lado</label>
                  <select className="form-select" value={formData.side} onChange={e => setFormData({...formData, side: e.target.value})}>
                    <option>Davi</option>
                    <option>Nicolly</option>
                    <option>Ambos</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Tipo</label>
                  <select className="form-select" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    <option>Padrinho/Madrinha</option>
                    <option>Padrinho/Madrinha de Honra</option>
                    <option>Padrinho/Madrinha de Argola</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Participação especial</label>
                <input className="form-input" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} placeholder="Ex: Leitura, Entrada das alianças..." />
              </div>
              <div className="form-group">
                <label className="form-label">Observações</label>
                <textarea className="form-textarea" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} rows={2} />
              </div>
              <div className="form-actions">
                <div />
                <div className="form-actions-right">
                  <button className="form-btn form-btn-secondary" onClick={() => setModalOpen(false)}>Cancelar</button>
                  <button className="form-btn form-btn-primary" onClick={handleSave}>{editing ? 'Salvar' : 'Adicionar'}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Padrinhos;