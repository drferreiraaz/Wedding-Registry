import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/PageHeader/PageHeader';
import Modal from '../../components/Modal/Modal';
import ImageUpload from '../../components/ImageUpload/ImageUpload';
import { calculateHoneymoonProgress, formatCurrency } from '../../utils/calculations';
import { Plus, Trash2, Edit3, Plane } from 'lucide-react';

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
    <div className="p-xl max-w-[900px] max-[768px]:p-md" id="honeymoon">
      <PageHeader title="Lua de Mel" subtitle="Planejando nossa viagem dos sonhos" />

      {!isPlanned && !isAuthenticated ? (
        <div className="empty-state">
          <p>Nossa lua de mel ainda não foi planejada.</p>
        </div>
      ) : (
        <>
          <div className="bg-surface border border-border-light rounded-lg p-xl flex items-center gap-xl mb-xl max-[768px]:flex-col max-[768px]:text-center">
            <div className="w-[200px] h-[160px] shrink-0 rounded-md overflow-hidden max-[768px]:w-full max-[768px]:max-w-[300px] max-[768px]:h-[180px]">
              {isAuthenticated ? (
                <ImageUpload 
                  currentImage={data.honeymoon.imageUrl} 
                  onImageChange={url => updateData(prev => ({ ...prev, honeymoon: { ...prev.honeymoon, imageUrl: url } }))} 
                  label="Foto do destino" 
                  description="Foto do destino da nossa lua de mel"
                />
              ) : data.honeymoon.imageUrl ? (
                <img src={data.honeymoon.imageUrl} alt="Destino" className="w-full h-full object-cover rounded-md" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-surface-alt border-2 border-dashed border-border rounded-md text-text-muted text-[0.85rem] text-center p-md">Foto do destino da nossa lua de mel</div>
              )}
            </div>
            <div className="flex-1">
              {isAuthenticated && !editingMain ? (
                <button className="admin-btn-small" onClick={() => { setMainFormData({ destination: data.honeymoon.destination, description: data.honeymoon.description, date: data.honeymoon.date, budget: data.honeymoon.budget, imageUrl: data.honeymoon.imageUrl }); setEditingMain(true); }}>
                  <Edit3 size={14} /> Editar detalhes
                </button>
              ) : null}
              
              {editingMain ? (
                <div className="flex flex-col gap-sm w-full">
                  <input className="form-input" placeholder="Destino" value={mainFormData.destination} onChange={e => setMainFormData({...mainFormData, destination: e.target.value})} />
                  <input className="form-input" placeholder="Descrição" value={mainFormData.description} onChange={e => setMainFormData({...mainFormData, description: e.target.value})} />
                  <div className="form-row">
                    <input className="form-input" type="date" value={mainFormData.date} onChange={e => setMainFormData({...mainFormData, date: e.target.value})} />
                    <input className="form-input" type="number" placeholder="Orçamento" value={mainFormData.budget} onChange={e => setMainFormData({...mainFormData, budget: parseFloat(e.target.value) || 0})} />
                  </div>
                  <div className="form-actions mt-sm">
                    <button className="form-btn form-btn-secondary" onClick={() => setEditingMain(false)}>Cancelar</button>
                    <button className="form-btn form-btn-primary" onClick={handleSaveMain}>Salvar</button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="font-serif text-[1.3rem] font-semibold text-text-primary mb-[4px]">{data.honeymoon.destination || 'Destino a definir'}</h2>
                  <p className="text-[0.85rem] text-text-secondary mb-md">{data.honeymoon.description || 'Detalhes da viagem serão adicionados em breve.'}</p>
                  {data.honeymoon.date && <p className="text-[0.9rem] text-primary font-medium mb-md">📅 {new Date(data.honeymoon.date + 'T00:00:00').toLocaleDateString('pt-BR')}</p>}
                  <div className="max-w-[300px] max-[768px]:max-w-full">
                    <div className="w-full h-[6px] bg-progress-track rounded-[3px] overflow-hidden">
                      <div className="h-full bg-primary rounded-[3px] transition-[width] duration-[400ms] ease-[ease]" style={{ width: `${honeymoonProgress}%` }} />
                    </div>
                    <span className="text-[0.75rem] text-text-muted mt-[4px] block">{honeymoonProgress}% planejado • Orçamento: {formatCurrency(totalBudget)}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-surface border border-border-light rounded-lg p-lg">
            <div className="flex items-center justify-between mb-lg">
              <h2 className="font-serif text-[1.2rem] font-semibold text-text-primary">Itens da viagem</h2>
              {isAuthenticated && (
                <button className="flex items-center gap-sm px-md py-sm bg-primary text-white rounded-sm text-[0.85rem] font-medium transition-colors duration-200 ease-[ease] hover:bg-primary-hover" onClick={openNew}>
                  <Plus size={16} /> <span>Novo Item</span>
                </button>
              )}
            </div>

            <div className="flex flex-col gap-sm">
              {data.honeymoon.items.length === 0 ? (
                <div className="text-center p-2xl text-text-muted italic">
                  <p>Nenhum item cadastrado.</p>
                  {isAuthenticated && <button className="empty-state-btn" onClick={openNew}>+ Adicionar item</button>}
                </div>
              ) : (
                data.honeymoon.items.map((item) => (
                  <div key={item.id} className={`flex items-center gap-md p-md bg-surface-alt border border-border-light rounded-md transition-all duration-200 ease-[ease] hover:border-border ${item.completed ? 'opacity-60' : ''}`}>
                    <button className="shrink-0 bg-transparent border-none p-0 flex items-center cursor-pointer disabled:cursor-default group" onClick={() => isAuthenticated && toggleCompleted(item.id)} disabled={!isAuthenticated}>
                      {item.completed ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      ) : (
                        <div className={`w-[22px] h-[22px] rounded-full border-2 transition-[border-color] duration-200 ease-[ease] ${isAuthenticated ? 'border-border group-hover:border-primary' : 'border-border-light'}`} />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-[0.95rem] font-medium mb-[2px] ${item.completed ? 'line-through text-text-muted' : 'text-text-primary'}`}>{item.name}</h3>
                      {item.notes && <p className="text-[0.8rem] text-text-muted italic">{item.notes}</p>}
                    </div>
                    <span className="text-[0.9rem] font-semibold text-text-primary whitespace-nowrap">{item.estimatedValue > 0 ? formatCurrency(item.estimatedValue) : '-'}</span>
                    {isAuthenticated && (
                      <div className="flex gap-xs shrink-0">
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
