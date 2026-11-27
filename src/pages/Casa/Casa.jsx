import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/PageHeader/PageHeader';
import Modal from '../../components/Modal/Modal';
import { calculateHomeProgress, formatCurrency } from '../../utils/calculations';
import { Plus, Trash2, Edit3, Home } from 'lucide-react';

function Casa() {
  const { data, updateData } = useOutletContext();
  const { isAuthenticated } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filterCategory, setFilterCategory] = useState('Todas');

  const [formData, setFormData] = useState({
    name: '',
    category: 'Sala',
    estimatedValue: '',
    purchased: false,
    notes: '',
  });

  const homeProgress = calculateHomeProgress(data.home.items);
  const totalEstimated = data.home.items.reduce((sum, item) => sum + (item.estimatedValue || 0), 0);
  const totalPurchased = data.home.items.filter((i) => i.purchased).reduce((sum, item) => sum + (item.estimatedValue || 0), 0);

  const filteredItems =
    filterCategory === 'Todas'
      ? data.home.items
      : data.home.items.filter((i) => i.category === filterCategory);

  const openNew = () => {
    setEditingItem(null);
    setFormData({ name: '', category: 'Sala', estimatedValue: '', purchased: false, notes: '' });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      category: item.category || 'Sala',
      estimatedValue: (item.estimatedValue ?? '').toString(),
      purchased: !!item.purchased,
      notes: item.notes || '',
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;

    updateData((prev) => {
      if (editingItem) {
        return {
          ...prev,
          home: {
            ...prev.home,
            items: prev.home.items.map((i) =>
              i.id === editingItem.id
                ? { ...i, ...formData, estimatedValue: parseFloat(formData.estimatedValue) || 0 }
                : i
            ),
          },
        };
      }
      return {
        ...prev,
        home: {
          ...prev.home,
          items: [
            ...prev.home.items,
            { id: `h-${Date.now()}`, ...formData, estimatedValue: parseFloat(formData.estimatedValue) || 0 },
          ],
        },
      };
    });
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este item?')) return;
    updateData((prev) => ({
      ...prev,
      home: {
        ...prev.home,
        items: prev.home.items.filter((i) => i.id !== id),
      },
    }));
  };

  const togglePurchased = (id) => {
    updateData((prev) => ({
      ...prev,
      home: {
        ...prev.home,
        items: prev.home.items.map((i) =>
          i.id === id ? { ...i, purchased: !i.purchased } : i
        ),
      },
    }));
  };

  return (
    <div className="p-xl max-w-[1100px] max-mobile:p-md" id="home">
      <PageHeader title="Nossa Casa" subtitle="Preparando nosso lar juntos" />

      <div className="bg-surface border border-border-light rounded-lg p-xl flex items-center gap-lg mb-xl max-mobile:flex-col max-mobile:text-center">
        <div className="w-14 h-14 rounded-md bg-primary-lighter flex items-center justify-center text-primary shrink-0">
          <Home size={24} />
        </div>
        <div className="flex-1">
          <h2 className="font-serif text-[1.3rem] font-semibold text-text-primary mb-[4px]">Nossa casa está {homeProgress}% pronta</h2>
          <p className="text-[0.85rem] text-text-secondary">
            {formatCurrency(totalPurchased)} de {formatCurrency(totalEstimated)} investidos
          </p>
        </div>
        <div className="w-[200px] shrink-0 max-mobile:w-full">
          <div className="w-full h-2 bg-progress-track rounded-[4px] overflow-hidden">
            <div className="h-full bg-primary rounded-[4px] transition-[width] duration-[400ms] ease-[ease]" style={{ width: `${homeProgress}%` }} />
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border-light rounded-lg p-lg">
        <div className="flex items-center justify-between mb-lg flex-wrap gap-md max-mobile:flex-col max-mobile:items-start">
          <h2 className="font-serif text-[1.2rem] font-semibold text-text-primary">Itens para a casa</h2>
          <div className="flex items-center gap-sm">
            <select
              className="px-[12px] py-sm border border-border rounded-sm text-[0.85rem] text-text-secondary bg-surface"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="Todas">Todas categorias</option>
              {data.home.categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {isAuthenticated && (
              <button className="flex items-center gap-sm px-md py-sm bg-primary text-white rounded-sm text-[0.85rem] font-medium transition-colors duration-200 ease-[ease] hover:bg-primary-hover" onClick={openNew}>
                <Plus size={16} />
                <span>Novo Item</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-md max-mobile:grid-cols-1">
          {filteredItems.length === 0 ? (
            <div className="text-center p-2xl text-text-muted italic col-span-full flex flex-col items-center gap-sm">
              <Home size={28} className="text-border" />
              <p className="text-[0.9rem]">
                {data.home.items.length === 0
                  ? 'Nenhum item cadastrado ainda.'
                  : 'Nenhum item encontrado nessa categoria.'}
              </p>
              {data.home.items.length === 0 && isAuthenticated && (
                <button className="empty-state-btn not-italic" onClick={openNew}>+ Adicionar item</button>
              )}
            </div>
          ) : (
            filteredItems.map((item) => (
              <div key={item.id} className={`bg-surface-alt border border-border-light rounded-md p-md flex flex-col gap-sm transition-all duration-200 ease-[ease] hover:border-border ${item.purchased ? 'opacity-70' : ''}`}>
                <div className="flex items-start justify-between gap-sm">
                  <h3 className="font-serif text-[1rem] font-semibold text-text-primary">{item.name}</h3>
                  <span className="text-[0.7rem] px-sm py-[2px] bg-primary-lighter text-primary rounded-[20px] font-medium whitespace-nowrap">{item.category}</span>
                </div>
                <div className="text-[1.1rem] font-semibold text-text-primary">
                  {formatCurrency(item.estimatedValue)}
                </div>
                {item.notes && (
                  <p className="text-[0.8rem] text-text-muted italic">{item.notes}</p>
                )}
                <div className="flex items-center justify-between mt-auto pt-sm border-t border-border-light">
                  <button
                    className={`text-[0.8rem] px-[12px] py-[4px] rounded-[20px] font-medium transition-all duration-200 ease-[ease] ${item.purchased ? 'bg-badge-done text-badge-done-text' : 'bg-badge-pending text-badge-pending-text hover:bg-badge-progress'}`}
                    onClick={() => isAuthenticated && togglePurchased(item.id)}
                    disabled={!isAuthenticated}
                  >
                    {item.purchased ? '✓ Comprado' : 'Pendente'}
                  </button>
                  {isAuthenticated && (
                    <div className="flex gap-[4px]">
                      <button className="flex items-center justify-center w-7 h-7 rounded-sm text-text-muted transition-all duration-200 ease-[ease] hover:bg-surface hover:text-text-primary" onClick={() => openEdit(item)} aria-label="Editar">
                        <Edit3 size={14} />
                      </button>
                      <button className="flex items-center justify-center w-7 h-7 rounded-sm text-text-muted transition-all duration-200 ease-[ease] hover:bg-badge-high hover:text-badge-high-text" onClick={() => handleDelete(item.id)} aria-label="Excluir">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Editar Item' : 'Novo Item'}
      >
        <div className="flex flex-col gap-md">
          <div className="form-group">
            <label className="form-label" htmlFor="home-name">Nome</label>
            <input
              id="home-name"
              className="form-input"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nome do item..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="home-category">Categoria</label>
              <select
                id="home-category"
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {data.home.categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="home-value">Valor estimado (R$)</label>
              <input
                id="home-value"
                className="form-input"
                type="number"
                min="0"
                value={formData.estimatedValue}
                onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="home-notes">Observação</label>
            <textarea
              id="home-notes"
              className="form-textarea"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Observações..."
              rows={2}
            />
          </div>

          <div className="form-actions">
            <div />
            <div className="form-actions-right">
              <button className="form-btn form-btn-secondary" onClick={() => setModalOpen(false)}>
                Cancelar
              </button>
              <button className="form-btn form-btn-primary" onClick={handleSave} disabled={!formData.name.trim()}>
                {editingItem ? 'Salvar' : 'Adicionar'}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Casa;
