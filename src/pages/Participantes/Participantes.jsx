import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ImageUpload from '../../components/ImageUpload/ImageUpload';
import { Plus, Trash2, Edit3 } from 'lucide-react';

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
    <div className="p-xl max-w-[900px] max-mobile:p-md">
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
        <div className="bg-surface border border-border-light rounded-lg p-lg">
          <h3 className="font-serif text-[1.2rem] font-semibold mb-lg text-text-primary">Ordem da Cerimônia</h3>
          {sortedParticipants.map((p, idx) => (
            <div key={p.id} className="group flex items-center gap-md p-md border-b border-border-light transition-colors duration-200 ease-[ease] last:border-b-0 hover:bg-surface-alt">
              <div className="flex flex-col items-center gap-[4px] min-w-[40px]">
                <span className="font-serif text-[1.2rem] font-semibold text-primary">{p.order}</span>
                {isAuthenticated && (
                  <div className="flex gap-[2px]">
                    <button className="w-5 h-5 text-[0.7rem] bg-border-light rounded-[4px] flex items-center justify-center border-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed" disabled={idx === 0} onClick={() => moveOrder(p.id, -1)}>↑</button>
                    <button className="w-5 h-5 text-[0.7rem] bg-border-light rounded-[4px] flex items-center justify-center border-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed" disabled={idx === sortedParticipants.length - 1} onClick={() => moveOrder(p.id, 1)}>↓</button>
                  </div>
                )}
              </div>
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
                {p.photoUrl ? <img src={p.photoUrl} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-primary-lighter text-primary font-semibold">{p.name.charAt(0)}</div>}
              </div>
              <div className="flex-1">
                <h4 className="text-[1rem] font-semibold text-text-primary mb-[4px]">{p.name} {p.age && <span className="text-[0.85rem] text-text-muted font-normal">({p.age} anos)</span>}</h4>
                <span className="inline-block px-sm py-[2px] bg-surface-alt border border-border rounded-[20px] text-[0.75rem] text-text-secondary">{p.role}</span>
                {p.notes && <p className="text-[0.8rem] text-text-muted mt-[4px] italic">{p.notes}</p>}
              </div>
              {isAuthenticated && (
                <div className="flex gap-[4px] opacity-0 transition-opacity duration-200 ease-[ease] group-hover:opacity-100">
                  <button className="w-7 h-7 rounded-sm bg-transparent text-text-muted flex items-center justify-center border-none cursor-pointer hover:bg-border-light hover:text-text-primary" onClick={() => openEdit(p)}><Edit3 size={14} /></button>
                  <button className="w-7 h-7 rounded-sm bg-transparent text-text-muted flex items-center justify-center border-none cursor-pointer hover:bg-badge-high hover:text-badge-high-text" onClick={() => handleDelete(p.id)}><Trash2 size={14} /></button>
                </div>
              )}
            </div>
          ))}
          {isAuthenticated && (
            <button className="flex items-center justify-center gap-md p-md border border-dashed border-b-0 border-border rounded-md transition-colors duration-200 ease-[ease] text-primary font-medium cursor-pointer mt-md bg-transparent font-[inherit] text-[length:inherit] hover:bg-primary-lighter hover:border-primary" onClick={openNew}>
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
