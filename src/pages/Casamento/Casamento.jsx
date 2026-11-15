import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ImageUpload from '../../components/ImageUpload/ImageUpload';
import { calculateOverallProgress, calculateDaysUntil } from '../../utils/calculations';
import { Edit3, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

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
    <div className="p-xl max-w-[1200px] mx-auto max-nav:p-lg max-mobile:p-md" id="wedding">
      <div className="page-header-simple">
        <span className="page-header-tag">NOSSO CASAMENTO</span>
        <h1 className="page-header-title">Nosso Casamento</h1>
        <p className="page-header-subtitle">Tudo sobre o nosso grande dia</p>
      </div>

      {isAuthenticated && !editing && (
        <div className="admin-toolbar">
          <button className="admin-btn-small max-mobile:w-full max-mobile:justify-center" onClick={() => {
            setFormData({ tagline: data.wedding.tagline, date: data.wedding.date });
            setEditing(true);
          }}>
            <Edit3 size={14} /> Editar página
          </button>
          <button className="admin-btn-small max-mobile:w-full max-mobile:justify-center" onClick={handleAddSection}>
            <Plus size={14} /> Adicionar seção
          </button>
        </div>
      )}

      <div className="bg-surface border border-border-light rounded-lg p-2xl flex items-center gap-2xl mb-xl max-nav:flex-col max-nav:text-center max-nav:p-xl max-mobile:p-lg">
        <div className="flex-1 min-w-0 max-nav:w-full">
          {editing ? (
            <div className="flex flex-col gap-md w-full max-w-[500px]">
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
              <h1 className="font-serif text-[2.5rem] font-bold text-text-primary mb-sm max-mobile:text-[1.5rem]">Nosso Casamento</h1>
              <p className="text-[1rem] text-text-secondary leading-[1.6] mb-xl max-w-[600px] max-nav:mx-auto max-mobile:text-[0.9rem]">{data.wedding.tagline}</p>
              <div className="flex gap-md flex-wrap max-nav:justify-center max-tiny:flex-col max-tiny:w-full">
                <div className="bg-surface-alt border border-border-light rounded-md px-lg py-md flex flex-col gap-[4px] min-w-[120px] max-mobile:px-md max-mobile:py-sm max-mobile:min-w-[100px] max-tiny:w-full">
                  <span className="text-[0.75rem] text-text-muted uppercase tracking-[0.5px]">Data</span>
                  <span className="font-serif text-[1.1rem] font-semibold text-text-primary max-mobile:text-[1rem]">{data.wedding.dateFormatted || 'A definir'}</span>
                </div>
                {data.wedding.date && (
                  <div className="bg-surface-alt border border-border-light rounded-md px-lg py-md flex flex-col gap-[4px] min-w-[120px] max-mobile:px-md max-mobile:py-sm max-mobile:min-w-[100px] max-tiny:w-full">
                    <span className="text-[0.75rem] text-text-muted uppercase tracking-[0.5px]">Contagem regressiva</span>
                    <span className="font-serif text-[1.1rem] font-semibold text-text-primary max-mobile:text-[1rem]">{daysUntil} dias</span>
                  </div>
                )}
                <div className="bg-surface-alt border border-border-light rounded-md px-lg py-md flex flex-col gap-[4px] min-w-[120px] max-mobile:px-md max-mobile:py-sm max-mobile:min-w-[100px] max-tiny:w-full">
                  <span className="text-[0.75rem] text-text-muted uppercase tracking-[0.5px]">Progresso</span>
                  <span className="font-serif text-[1.1rem] font-semibold text-text-primary max-mobile:text-[1rem]">{overallProgress}%</span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="w-[280px] h-[220px] shrink-0 rounded-md overflow-hidden max-nav:w-full max-nav:max-w-[400px] max-nav:h-[250px]">
          {isAuthenticated ? (
            <ImageUpload
              currentImage={data.wedding.dressPhotoUrl}
              onImageChange={(url) => updateData(prev => ({ ...prev, wedding: { ...prev.wedding, dressPhotoUrl: url } }))}
              label="Foto do vestido"
              description="Foto do vestido de noiva"
            />
          ) : data.wedding.dressPhotoUrl ? (
            <img src={data.wedding.dressPhotoUrl} alt="Vestido de noiva" className="w-full h-full object-cover rounded-md" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-surface-alt border-2 border-dashed border-border rounded-md text-text-muted text-[0.9rem] text-center p-md cursor-pointer transition-all duration-200 ease-[ease] hover:border-primary hover:text-primary">Foto do vestido de noiva</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-md mt-xl max-lg:grid-cols-2 max-nav:grid-cols-1">
        {storyData.map((section, idx) => (
          <div key={section.id} className="story-card">
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
            
            <h3 className="font-serif text-[1.1rem] font-semibold text-text-primary mb-sm">{section.title}</h3>
            <p className="text-[0.9rem] text-text-secondary leading-[1.6]">{section.text}</p>
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
