import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ImageUpload from '../../components/ImageUpload/ImageUpload';
import { Plus, Trash2, Edit3 } from 'lucide-react';
import './style.css';

const roles = ['Florista', 'Daminha', 'Pajens', 'Segurança das alianças', 'Entrada das alianças', 'Leitura', 'Participante da cerimônia', 'Recepção', 'Outro'];

function Participantes() {
  const { data, updateData } = useOutletContext();
  const { isAuthenticated } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', role: 'Outro', age: '', order: 1, notes: '', photoUrl: null });

  const openNew = () => {
    setEditing(null);
    const nextOrder = data.participants.length > 0 ? Math.max(...data.participants.map(p => p.order)) + 1 : 1;
    setFormData({ name: '', role: 'Outro', age: '', order: nextOrder, notes: '', photoUrl: null });
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
        return { ...prev, participants: prev.participants.map(p => p.id === editing.id ? { ...formData, id: editing.id } : p) };
      }
      return { ...prev, participants: [...prev.participants, { id: `part-${Date.now()}`, ...formData }] };
    });
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    updateData(prev => ({ ...prev, participants: prev.participants.filter(p => p.id !== id) }));
  };

  const moveOrder = (id, direction) => {
    const sorted = [...data.participants].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex(p => p.id === id);
    if ((direction === -1 && idx === 0) || (direction === 1 && idx === sorted.length - 1)) return;
    const temp = sorted[idx].order;
    sorted[idx].order = sorted[idx + direction].order;
    sorted[idx + direction].order = temp;
    updateData(prev => ({ ...prev, participants: sorted }));
  };

  const sortedParticipants = [...data.participants].sort((a, b) => a.order - b.order);

  return (
    <div className="participantes-page">
      <div className="page-header-simple">
        <span className="page-header-tag">PESSOAS</span>
        <h1 className="page-header-title">Participantes</h1>
        <p className="page-header-subtitle">Pessoas com funções especiais na cerimônia</p>
      </div>
      
      {sortedParticipants.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum participante cadastrado.</p>
          {isAuthenticated && <button className="empty-state-btn" onClick={openNew}>+ Adicionar participante</button>}
        </div>
      ) : (
        <div className="participants-list">
          <h3 className="participants-section-title">Ordem da Cerimônia</h3>
          {sortedParticipants.map((p, idx) => (
            <div key={p.id} className="participant-row">
              <div className="participant-order">
                <span className="order-number">{p.order}</span>
                {isAuthenticated && (
                  <div className="order-controls">
                    <button disabled={idx === 0} onClick={() => moveOrder(p.id, -1)}>↑</button>
                    <button disabled={idx === sortedParticipants.length - 1} onClick={() => moveOrder(p.id, 1)}>↓</button>
                  </div>
                )}
              </div>
              <div className="participant-photo-small">
                {p.photoUrl ? <img src={p.photoUrl} alt={p.name} /> : <div className="participant-photo-placeholder">{p.name.charAt(0)}</div>}
              </div>
              <div className="participant-info">
                <h4 className="participant-name">{p.name} {p.age && <span className="participant-age">({p.age} anos)</span>}</h4>
                <span className="participant-role-badge">{p.role}</span>
                {p.notes && <p className="participant-notes">{p.notes}</p>}
              </div>
              {isAuthenticated && (
                <div className="participant-actions">
                  <button onClick={() => openEdit(p)}><Edit3 size={14} /></button>
                  <button className="danger" onClick={() => handleDelete(p.id)}><Trash2 size={14} /></button>
                </div>
              )}
            </div>
          ))}
          {isAuthenticated && (
            <button className="participant-row participant-add" onClick={openNew}>
              <Plus size={16} /> <span>Adicionar participante</span>
            </button>
          )}
        </div>
      )}

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editing ? 'Editar Participante' : 'Novo Participante'}</h2>
              <button className="modal-close" onClick={() => setModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Foto</label>
                <ImageUpload currentImage={formData.photoUrl} onImageChange={(url) => setFormData({...formData, photoUrl: url})} label="Foto" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Nome</label>
                  <input className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Idade (opcional)</label>
                  <input className="form-input" type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Função</label>
                  <select className="form-select" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Ordem de entrada</label>
                  <input className="form-input" type="number" min="1" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 1})} />
                </div>
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

export default Participantes;