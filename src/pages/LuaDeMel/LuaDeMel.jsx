import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/PageHeader/PageHeader';
import Modal from '../../components/Modal/Modal';
import ImageUpload from '../../components/ImageUpload/ImageUpload';
import { calculateHoneymoonProgress, formatCurrency } from '../../utils/calculations';
import { Plus, Trash2, Edit3, Plane } from 'lucide-react';
import './style.css';

function LuaDeMel() {
  const { data, updateData } = useOutletContext();
  const { isAuthenticated } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingMain, setEditingMain] = useState(false);
  
  const [mainFormData, setMainFormData] = useState({
    destination: data.honeymoon.destination,
    description: data.honeymoon.description,
    date: data.honeymoon.date,
    budget: data.honeymoon.budget,
    imageUrl: data.honeymoon.imageUrl
  });

  const [formData, setFormData] = useState({ name: '', estimatedValue: '', completed: false, notes: '' });

  const honeymoonProgress = calculateHoneymoonProgress(data.honeymoon.items);
  const totalBudget = data.honeymoon.budget;
  const totalEstimated = data.honeymoon.items.reduce((sum, item) => sum + (item.estimatedValue || 0), 0);

  const openNew = () => {
    setEditingItem(null);
    setFormData({ name: '', estimatedValue: '', completed: false, notes: '' });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setFormData({ ...item });
    setModalOpen(true);
  };

  const handleSaveItem = () => {
    if (!formData.name.trim()) return;
    updateData(prev => {
      if (editingItem) {
        return { ...prev, honeymoon: { ...prev.honeymoon, items: prev.honeymoon.items.map(i => i.id === editingItem.id ? { ...formData, id: editingItem.id } : i) } };
      }
      return { ...prev, honeymoon: { ...prev.honeymoon, items: [...prev.honeymoon.items, { id: `hm-${Date.now()}`, ...formData }] } };
    });
    setModalOpen(false);
  };

  const handleDeleteItem = (id) => {
    updateData(prev => ({ ...prev, honeymoon: { ...prev.honeymoon, items: prev.honeymoon.items.filter(i => i.id !== id) } }));
  };

  const toggleCompleted = (id) => {
    updateData(prev => ({ ...prev, honeymoon: { ...prev.honeymoon, items: prev.honeymoon.items.map(i => i.id === id ? { ...i, completed: !i.completed } : i) } }));
  };

  const handleSaveMain = () => {
    updateData(prev => ({ ...prev, honeymoon: { ...prev.honeymoon, ...mainFormData } }));
    setEditingMain(false);
  };

  const isPlanned = data.honeymoon.destination || data.honeymoon.items.length > 0;

  return (
    <div className="honeymoon" id="honeymoon">
      <PageHeader title="Lua de Mel" subtitle="Planejando nossa viagem dos sonhos" />

      {!isPlanned && !isAuthenticated ? (
        <div className="empty-state">
          <p>Nossa lua de mel ainda não foi planejada.</p>
        </div>
      ) : (
        <>
          <div className="honeymoon-hero">
            <div className="honeymoon-hero-image">
              {isAuthenticated ? (
                <ImageUpload 
                  currentImage={data.honeymoon.imageUrl} 
                  onImageChange={url => updateData(prev => ({ ...prev, honeymoon: { ...prev.honeymoon, imageUrl: url } }))} 
                  label="Foto do destino" 
                  description="Foto do destino da nossa lua de mel"
                />
              ) : data.honeymoon.imageUrl ? (
                <img src={data.honeymoon.imageUrl} alt="Destino" className="honeymoon-hero-img" />
              ) : (
                <div className="honeymoon-hero-placeholder">Foto do destino da nossa lua de mel</div>
              )}
            </div>
            <div className="honeymoon-hero-content">
              {isAuthenticated && !editingMain ? (
                <button className="admin-btn-small" onClick={() => { setMainFormData({ destination: data.honeymoon.destination, description: data.honeymoon.description, date: data.honeymoon.date, budget: data.honeymoon.budget, imageUrl: data.honeymoon.imageUrl }); setEditingMain(true); }}>
                  <Edit3 size={14} /> Editar detalhes
                </button>
              ) : null}
              
              {editingMain ? (
                <div className="honeymoon-edit-form">
                  <input className="form-input" placeholder="Destino" value={mainFormData.destination} onChange={e => setMainFormData({...mainFormData, destination: e.target.value})} />
                  <input className="form-input" placeholder="Descrição" value={mainFormData.description} onChange={e => setMainFormData({...mainFormData, description: e.target.value})} />
                  <div className="form-row">
                    <input className="form-input" type="date" value={mainFormData.date} onChange={e => setMainFormData({...mainFormData, date: e.target.value})} />
                    <input className="form-input" type="number" placeholder="Orçamento" value={mainFormData.budget} onChange={e => setMainFormData({...mainFormData, budget: parseFloat(e.target.value) || 0})} />
                  </div>
                  <div className="form-actions" style={{ marginTop: 'var(--spacing-sm)' }}>
                    <button className="form-btn form-btn-secondary" onClick={() => setEditingMain(false)}>Cancelar</button>
                    <button className="form-btn form-btn-primary" onClick={handleSaveMain}>Salvar</button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="honeymoon-hero-title">{data.honeymoon.destination || 'Destino a definir'}</h2>
                  <p className="honeymoon-hero-subtitle">{data.honeymoon.description || 'Detalhes da viagem serão adicionados em breve.'}</p>
                  {data.honeymoon.date && <p className="honeymoon-hero-date">📅 {new Date(data.honeymoon.date + 'T00:00:00').toLocaleDateString('pt-BR')}</p>}
                  <div className="honeymoon-hero-progress">
                    <div className="honeymoon-hero-progress-track">
                      <div className="honeymoon-hero-progress-fill" style={{ width: `${honeymoonProgress}%` }} />
                    </div>
                    <span className="honeymoon-hero-progress-text">{honeymoonProgress}% planejado • Orçamento: {formatCurrency(totalBudget)}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="honeymoon-content">
            <div className="honeymoon-toolbar">
              <h2 className="honeymoon-section-title">Itens da viagem</h2>
              {isAuthenticated && (
                <button className="honeymoon-add-btn" onClick={openNew}>
                  <Plus size={16} /> <span>Novo Item</span>
                </button>
              )}
            </div>

            <div className="honeymoon-list">
              {data.honeymoon.items.length === 0 ? (
                <div className="honeymoon-empty">
                  <p>Nenhum item cadastrado.</p>
                  {isAuthenticated && <button className="empty-state-btn" onClick={openNew}>+ Adicionar item</button>}
                </div>
              ) : (
                data.honeymoon.items.map((item) => (
                  <div key={item.id} className={`honeymoon-item ${item.completed ? 'honeymoon-item-done' : ''}`}>
                    <button className="honeymoon-item-check" onClick={() => isAuthenticated && toggleCompleted(item.id)} disabled={!isAuthenticated}>
                      {item.completed ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      ) : (
                        <div className="honeymoon-item-check-empty" />
                      )}
                    </button>
                    <div className="honeymoon-item-content">
                      <h3 className={`honeymoon-item-name ${item.completed ? 'honeymoon-item-name-done' : ''}`}>{item.name}</h3>
                      {item.notes && <p className="honeymoon-item-notes">{item.notes}</p>}
                    </div>
                    <span className="honeymoon-item-value">{item.estimatedValue > 0 ? formatCurrency(item.estimatedValue) : '-'}</span>
                    {isAuthenticated && (
                      <div className="honeymoon-item-actions">
                        <button onClick={() => openEdit(item)}><Edit3 size={14} /></button>
                        <button className="danger" onClick={() => handleDeleteItem(item.id)}><Trash2 size={14} /></button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingItem ? 'Editar Item' : 'Novo Item'}>
        <div className="form-group">
          <label className="form-label">Nome</label>
          <input className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Passagens aéreas" />
        </div>
        <div className="form-group">
          <label className="form-label">Valor estimado (R$)</label>
          <input className="form-input" type="number" min="0" value={formData.estimatedValue} onChange={e => setFormData({...formData, estimatedValue: e.target.value})} />
        </div>
        <div className="form-group">
          <label className="form-label">Observação</label>
          <textarea className="form-textarea" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} rows={2} />
        </div>
        <div className="form-actions">
          <div />
          <div className="form-actions-right">
            <button className="form-btn form-btn-secondary" onClick={() => setModalOpen(false)}>Cancelar</button>
            <button className="form-btn form-btn-primary" onClick={handleSaveItem}>{editingItem ? 'Salvar' : 'Adicionar'}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default LuaDeMel;