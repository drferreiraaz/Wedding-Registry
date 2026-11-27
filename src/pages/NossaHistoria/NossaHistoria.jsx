import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ImageUpload from '../../components/ImageUpload/ImageUpload';
import { Plus, Trash2, Edit3, ArrowUp, ArrowDown } from 'lucide-react';

function NossaHistoria() {
  const { data, updateData } = useOutletContext();
  const { isAuthenticated } = useAuth();
  const [editingSection, setEditingSection] = useState(null);
  const [formData, setFormData] = useState({ title: '', text: '', imageUrl: null });

  const openEdit = (section) => {
    setEditingSection(section);
    setFormData({ title: section.title, text: section.text, imageUrl: section.imageUrl });
  };

  const handleSave = () => {
    if (!formData.title.trim()) return;
    updateData(prev => ({
      ...prev,
      ourStory: prev.ourStory.map(s => s.id === editingSection.id ? { ...formData, id: editingSection.id } : s)
    }));
    setEditingSection(null);
  };

  const handleAddSection = () => {
    const newSection = { id: `story-${Date.now()}`, title: 'Nova Seção', text: 'Descreva aqui...', imageUrl: null };
    updateData(prev => ({ ...prev, ourStory: [...prev.ourStory, newSection] }));
    openEdit(newSection);
  };

  const handleDelete = (id) => {
    if (window.confirm('Excluir esta seção?')) {
      updateData(prev => ({ ...prev, ourStory: prev.ourStory.filter(s => s.id !== id) }));
    }
  };

  const moveSection = (id, direction) => {
    const arr = [...data.ourStory];
    const idx = arr.findIndex(s => s.id === id);
    if ((direction === -1 && idx === 0) || (direction === 1 && idx === arr.length - 1)) return;
    [arr[idx], arr[idx + direction]] = [arr[idx + direction], arr[idx]];
    updateData(prev => ({ ...prev, ourStory: arr }));
  };

  return (
    <div className="p-xl max-w-[900px] max-mobile:p-md">
      <div className="page-header-simple">
        <span className="page-header-tag">NOSSA HISTÓRIA</span>
        <h1 className="page-header-title">Nossa História</h1>
        <p className="page-header-subtitle">Como tudo começou e nossos sonhos</p>
      </div>

      {isAuthenticated && (
        <div className="admin-toolbar">
          <button className="admin-btn" onClick={handleAddSection}>
            <Plus size={16} /> Adicionar Seção
          </button>
        </div>
      )}

      {data.ourStory.length === 0 ? (
        <div className="empty-state">
          <p>Ainda não temos seções na nossa história.</p>
          {isAuthenticated && <button className="empty-state-btn" onClick={handleAddSection}>+ Adicionar seção</button>}
        </div>
      ) : (
        <div className="flex flex-col gap-lg">
          {data.ourStory.map((section, idx) => (
            <div key={section.id} className="story-card">
              {isAuthenticated && (
                <div className="story-card-admin">
                  <button onClick={() => moveSection(section.id, -1)} disabled={idx === 0} title="Mover para cima">
                    <ArrowUp size={14} />
                  </button>
                  <button onClick={() => moveSection(section.id, 1)} disabled={idx === data.ourStory.length - 1} title="Mover para baixo">
                    <ArrowDown size={14} />
                  </button>
                  <button onClick={() => openEdit(section)} title="Editar">
                    <Edit3 size={14} />
                  </button>
                  <button className="danger" onClick={() => handleDelete(section.id)} title="Excluir">
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
              
              {section.imageUrl ? (
                <img src={section.imageUrl} alt={section.title} className="story-card-image" />
              ) : (
                <div className="story-card-image-placeholder">
                  {isAuthenticated ? 'Clique em editar para adicionar foto' : 'Sem imagem'}
                </div>
              )}
              
              <h3 className="font-serif text-[1.3rem] font-semibold text-text-primary mb-sm">{section.title}</h3>
              <p className="text-[0.95rem] text-text-secondary leading-[1.7]">{section.text}</p>
            </div>
          ))}
        </div>
      )}

      {isAuthenticated && editingSection && (
        <div className="modal-overlay" onClick={() => setEditingSection(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Editar Seção</h2>
              <button className="modal-close" onClick={() => setEditingSection(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Imagem</label>
                <ImageUpload 
                  currentImage={formData.imageUrl} 
                  onImageChange={url => setFormData({...formData, imageUrl: url})} 
                  label="Foto da seção" 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Título</label>
                <input className="form-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Texto</label>
                <textarea className="form-textarea" value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})} rows={4} />
              </div>
              <div className="form-actions">
                <div />
                <div className="form-actions-right">
                  <button className="form-btn form-btn-secondary" onClick={() => setEditingSection(null)}>Cancelar</button>
                  <button className="form-btn form-btn-primary" onClick={handleSave}>Salvar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NossaHistoria;
