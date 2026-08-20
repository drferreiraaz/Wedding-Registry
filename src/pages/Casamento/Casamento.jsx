import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ImageUpload from '../../components/ImageUpload/ImageUpload';
import { calculateOverallProgress, calculateDaysUntil } from '../../utils/calculations';
import { Edit3, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import './style.css';

function Casamento() {
  const { data, updateData } = useOutletContext();
  const { isAuthenticated } = useAuth();
  const [editing, setEditing] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [formData, setFormData] = useState({ tagline: data.wedding.tagline, date: data.wedding.date });
  const [sectionFormData, setSectionFormData] = useState({ title: '', text: '', imageUrl: null });

  // Proteção: garante que ourStory seja sempre um array
  const storyData = data.ourStory || [];
  const overallProgress = calculateOverallProgress(data.phases);
  const daysUntil = data.wedding.date ? calculateDaysUntil(data.wedding.date) : 0;

  const handleSave = () => {
    const dateFormatted = formData.date ? new Date(formData.date + 'T00:00:00').toLocaleDateString('pt-BR') : '';
    updateData(prev => ({
      ...prev,
      wedding: { ...prev.wedding, tagline: formData.tagline, date: formData.date, dateFormatted }
    }));
    setEditing(false);
  };

  const openEditSection = (section) => {
    setEditingSection(section);
    setSectionFormData({ title: section.title, text: section.text, imageUrl: section.imageUrl });
  };

  const handleSaveSection = () => {
    if (!sectionFormData.title.trim()) return;
    updateData(prev => ({
      ...prev,
      ourStory: prev.ourStory.map(s => s.id === editingSection.id ? { ...sectionFormData, id: editingSection.id } : s)
    }));
    setEditingSection(null);
  };

  const handleAddSection = () => {
    const newSection = { id: `story-${Date.now()}`, title: 'Nova Seção', text: 'Descreva aqui...', imageUrl: null };
    updateData(prev => ({ ...prev, ourStory: [...prev.ourStory, newSection] }));
    openEditSection(newSection);
  };

  const handleDeleteSection = (id) => {
    if (window.confirm('Excluir esta seção?')) {
      updateData(prev => ({ ...prev, ourStory: prev.ourStory.filter(s => s.id !== id) }));
    }
  };

  const moveSection = (id, direction) => {
    const arr = [...storyData];
    const idx = arr.findIndex(s => s.id === id);
    if ((direction === -1 && idx === 0) || (direction === 1 && idx === arr.length - 1)) return;
    [arr[idx], arr[idx + direction]] = [arr[idx + direction], arr[idx]];
    updateData(prev => ({ ...prev, ourStory: arr }));
  };

  return (
    <div className="wedding" id="wedding">
      <div className="page-header-simple">
        <span className="page-header-tag">NOSSO CASAMENTO</span>
        <h1 className="page-header-title">Nosso Casamento</h1>
        <p className="page-header-subtitle">Tudo sobre o nosso grande dia</p>
      </div>

      {isAuthenticated && !editing && (
        <div className="admin-toolbar">
          <button className="admin-btn-small" onClick={() => {
            setFormData({ tagline: data.wedding.tagline, date: data.wedding.date });
            setEditing(true);
          }}>
            <Edit3 size={14} /> Editar página
          </button>
          <button className="admin-btn-small" onClick={handleAddSection}>
            <Plus size={14} /> Adicionar seção
          </button>
        </div>
      )}

      <div className="wedding-hero">
        <div className="wedding-hero-content">
          {editing ? (
            <div className="wedding-edit-form">
              <div className="form-group">
                <label className="form-label">Texto de apresentação</label>
                <textarea className="form-textarea" value={formData.tagline} onChange={e => setFormData({...formData, tagline: e.target.value})} rows={3} />
              </div>
              <div className="form-group">
                <label className="form-label">Data do casamento</label>
                <input type="date" className="form-input" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
              <div className="form-actions">
                <button className="form-btn form-btn-secondary" onClick={() => setEditing(false)}>Cancelar</button>
                <button className="form-btn form-btn-primary" onClick={handleSave}>Salvar</button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="wedding-hero-title">Nosso Casamento</h1>
              <p className="wedding-hero-text">{data.wedding.tagline}</p>
              <div className="wedding-hero-details">
                <div className="wedding-detail-card">
                  <span className="wedding-detail-label">Data</span>
                  <span className="wedding-detail-value">{data.wedding.dateFormatted || 'A definir'}</span>
                </div>
                {data.wedding.date && (
                  <div className="wedding-detail-card">
                    <span className="wedding-detail-label">Contagem regressiva</span>
                    <span className="wedding-detail-value">{daysUntil} dias</span>
                  </div>
                )}
                <div className="wedding-detail-card">
                  <span className="wedding-detail-label">Progresso</span>
                  <span className="wedding-detail-value">{overallProgress}%</span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="wedding-hero-image">
          {isAuthenticated ? (
            <ImageUpload
              currentImage={data.wedding.dressPhotoUrl}
              onImageChange={(url) => updateData(prev => ({ ...prev, wedding: { ...prev.wedding, dressPhotoUrl: url } }))}
              label="Foto do vestido"
              description="Foto do vestido de noiva"
            />
          ) : data.wedding.dressPhotoUrl ? (
            <img src={data.wedding.dressPhotoUrl} alt="Vestido de noiva" className="wedding-hero-img" />
          ) : (
            <div className="wedding-hero-placeholder">Foto do vestido de noiva</div>
          )}
        </div>
      </div>

      <div className="wedding-info-grid">
        {storyData.map((section, idx) => (
          <div key={section.id} className="wedding-info-card story-card">
            {isAuthenticated && (
              <div className="story-card-admin">
                <button onClick={() => moveSection(section.id, -1)} disabled={idx === 0} title="Mover para cima"><ArrowUp size={14} /></button>
                <button onClick={() => moveSection(section.id, 1)} disabled={idx === storyData.length - 1} title="Mover para baixo"><ArrowDown size={14} /></button>
                <button onClick={() => openEditSection(section)} title="Editar"><Edit3 size={14} /></button>
                <button className="danger" onClick={() => handleDeleteSection(section.id)} title="Excluir"><Trash2 size={14} /></button>
              </div>
            )}
            
            {section.imageUrl ? (
              <img src={section.imageUrl} alt={section.title} className="story-card-image" />
            ) : (
              <div className="story-card-image-placeholder">
                {isAuthenticated ? 'Clique em editar para adicionar foto' : 'Sem imagem'}
              </div>
            )}
            
            <h3 className="wedding-info-title">{section.title}</h3>
            <p className="wedding-info-text">{section.text}</p>
          </div>
        ))}
      </div>

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
                <ImageUpload currentImage={sectionFormData.imageUrl} onImageChange={url => setSectionFormData({...sectionFormData, imageUrl: url})} label="Foto da seção" />
              </div>
              <div className="form-group">
                <label className="form-label">Título</label>
                <input className="form-input" value={sectionFormData.title} onChange={e => setSectionFormData({...sectionFormData, title: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Texto</label>
                <textarea className="form-textarea" value={sectionFormData.text} onChange={e => setSectionFormData({...sectionFormData, text: e.target.value})} rows={4} />
              </div>
              <div className="form-actions">
                <div />
                <div className="form-actions-right">
                  <button className="form-btn form-btn-secondary" onClick={() => setEditingSection(null)}>Cancelar</button>
                  <button className="form-btn form-btn-primary" onClick={handleSaveSection}>Salvar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Casamento;