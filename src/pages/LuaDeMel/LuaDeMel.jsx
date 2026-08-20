import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import PageHeader from '../../components/PageHeader/PageHeader';
import Modal from '../../components/Modal/Modal';
import { calculateHoneymoonProgress, formatCurrency } from '../../utils/calculations';
import ImagePlaceholder from '../../components/ImagePlaceholder/ImagePlaceholder';
import { Plus, Trash2, Edit3, Plane } from 'lucide-react';
import './style.css';

function LuaDeMel() {
  const { data, updateData } = useOutletContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    estimatedValue: '',
    completed: false,
    notes: '',
  });

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
    setFormData({
      name: item.name,
      estimatedValue: item.estimatedValue.toString(),
      completed: item.completed,
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
          honeymoon: {
            ...prev.honeymoon,
            items: prev.honeymoon.items.map((i) =>
              i.id === editingItem.id
                ? { ...i, ...formData, estimatedValue: parseFloat(formData.estimatedValue) || 0 }
                : i
            ),
          },
        };
      }
      return {
        ...prev,
        honeymoon: {
          ...prev.honeymoon,
          items: [
            ...prev.honeymoon.items,
            { id: `hm-${Date.now()}`, ...formData, estimatedValue: parseFloat(formData.estimatedValue) || 0 },
          ],
        },
      };
    });
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    updateData((prev) => ({
      ...prev,
      honeymoon: {
        ...prev.honeymoon,
        items: prev.honeymoon.items.filter((i) => i.id !== id),
      },
    }));
  };

  const toggleCompleted = (id) => {
    updateData((prev) => ({
      ...prev,
      honeymoon: {
        ...prev.honeymoon,
        items: prev.honeymoon.items.map((i) =>
          i.id === id ? { ...i, completed: !i.completed } : i
        ),
      },
    }));
  };

  return (
    <div className="honeymoon" id="honeymoon">
      <PageHeader title="Lua de Mel" subtitle="Planejando nossa viagem dos sonhos" />

      <div className="honeymoon-hero">
        <div className="honeymoon-hero-image">
          <ImagePlaceholder
            description="Foto do destino da nossa lua de mel"
            className="honeymoon-hero-image-placeholder"
          />
        </div>
        <div className="honeymoon-hero-content">
          <div className="honeymoon-hero-icon">
            <Plane size={24} />
          </div>
          <h2 className="honeymoon-hero-title">Lua de Mel — {honeymoonProgress}% planejada</h2>
          <p className="honeymoon-hero-subtitle">
            Orçamento: {formatCurrency(totalBudget)} | Estimado: {formatCurrency(totalEstimated)}
          </p>
          <div className="honeymoon-hero-progress">
            <div className="honeymoon-hero-progress-track">
              <div className="honeymoon-hero-progress-fill" style={{ width: `${honeymoonProgress}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="honeymoon-content">
        <div className="honeymoon-toolbar">
          <h2 className="honeymoon-section-title">Itens da viagem</h2>
          <button className="honeymoon-add-btn" onClick={openNew}>
            <Plus size={16} />
            <span>Novo Item</span>
          </button>
        </div>

        <div className="honeymoon-list">
          {data.honeymoon.items.length === 0 ? (
            <div className="honeymoon-empty">
              Nenhum item cadastrado
            </div>
          ) : (
            data.honeymoon.items.map((item) => (
              <div key={item.id} className={`honeymoon-item ${item.completed ? 'honeymoon-item-done' : ''}`}>
                <button
                  className="honeymoon-item-check"
                  onClick={() => toggleCompleted(item.id)}
                  aria-label={item.completed ? 'Desmarcar' : 'Marcar como feito'}
                >
                  {item.completed ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <div className="honeymoon-item-check-empty" />
                  )}
                </button>
                <div className="honeymoon-item-content">
                  <h3 className={`honeymoon-item-name ${item.completed ? 'honeymoon-item-name-done' : ''}`}>
                    {item.name}
                  </h3>
                  {item.notes && <p className="honeymoon-item-notes">{item.notes}</p>}
                </div>
                <span className="honeymoon-item-value">
                  {item.estimatedValue > 0 ? formatCurrency(item.estimatedValue) : '-'}
                </span>
                <div className="honeymoon-item-actions">
                  <button className="honeymoon-action-btn" onClick={() => openEdit(item)} aria-label="Editar">
                    <Edit3 size={14} />
                  </button>
                  <button className="honeymoon-action-btn honeymoon-action-btn-danger" onClick={() => handleDelete(item.id)} aria-label="Excluir">
                    <Trash2 size={14} />
                  </button>
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
        <div className="honeymoon-modal-form">
          <div className="form-group">
            <label className="form-label" htmlFor="hm-name">Nome</label>
            <input
              id="hm-name"
              className="form-input"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Passagens aéreas..."
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="hm-value">Valor estimado (R$)</label>
            <input
              id="hm-value"
              className="form-input"
              type="number"
              min="0"
              value={formData.estimatedValue}
              onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="hm-notes">Observação</label>
            <textarea
              id="hm-notes"
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

export default LuaDeMel;