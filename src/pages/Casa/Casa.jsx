import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import PageHeader from '../../components/PageHeader/PageHeader';
import Modal from '../../components/Modal/Modal';
import { calculateHomeProgress, formatCurrency } from '../../utils/calculations';
import { Plus, Trash2, Edit3, Home } from 'lucide-react';
import './style.css';

function Casa() {
  const { data, updateData } = useOutletContext();
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
      name: item.name,
      category: item.category,
      estimatedValue: item.estimatedValue.toString(),
      purchased: item.purchased,
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
    <div className="home" id="home">
      <PageHeader title="Nossa Casa" subtitle="Preparando nosso lar juntos" />

      <div className="home-hero">
        <div className="home-hero-icon">
          <Home size={24} />
        </div>
        <div className="home-hero-content">
          <h2 className="home-hero-title">Nossa casa está {homeProgress}% pronta</h2>
          <p className="home-hero-subtitle">
            {formatCurrency(totalPurchased)} de {formatCurrency(totalEstimated)} investidos
          </p>
        </div>
        <div className="home-hero-progress">
          <div className="home-hero-progress-track">
            <div className="home-hero-progress-fill" style={{ width: `${homeProgress}%` }} />
          </div>
        </div>
      </div>

      <div className="home-content">
        <div className="home-toolbar">
          <h2 className="home-section-title">Itens para a casa</h2>
          <div className="home-toolbar-actions">
            <select
              className="home-filter"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="Todas">Todas categorias</option>
              {data.home.categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button className="home-add-btn" onClick={openNew}>
              <Plus size={16} />
              <span>Novo Item</span>
            </button>
          </div>
        </div>

        <div className="home-grid">
          {filteredItems.length === 0 ? (
            <div className="home-empty">
              Nenhum item cadastrado
            </div>
          ) : (
            filteredItems.map((item) => (
              <div key={item.id} className={`home-item-card ${item.purchased ? 'home-item-purchased' : ''}`}>
                <div className="home-item-header">
                  <h3 className="home-item-name">{item.name}</h3>
                  <span className="home-item-category">{item.category}</span>
                </div>
                <div className="home-item-value">
                  {formatCurrency(item.estimatedValue)}
                </div>
                {item.notes && (
                  <p className="home-item-notes">{item.notes}</p>
                )}
                <div className="home-item-footer">
                  <button
                    className={`home-item-toggle ${item.purchased ? 'home-item-toggle-done' : ''}`}
                    onClick={() => togglePurchased(item.id)}
                  >
                    {item.purchased ? '✓ Comprado' : 'Pendente'}
                  </button>
                  <div className="home-item-actions">
                    <button className="home-action-btn" onClick={() => openEdit(item)} aria-label="Editar">
                      <Edit3 size={14} />
                    </button>
                    <button className="home-action-btn home-action-btn-danger" onClick={() => handleDelete(item.id)} aria-label="Excluir">
                      <Trash2 size={14} />
                    </button>
                  </div>
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
        <div className="home-modal-form">
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
              <button className="form-btn form-btn-primary" onClick={handleSave}>
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