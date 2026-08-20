import './style.css';
import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import PageHeader from '../../components/PageHeader/PageHeader';
import Modal from '../../components/Modal/Modal';
import { formatCurrency, calculateTotalExpenses } from '../../utils/calculations';
import { Plus, Trash2, Edit3 } from 'lucide-react';

function Financeiro() {
  const { data, updateData } = useOutletContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [filterCategory, setFilterCategory] = useState('Todas');
  const [editingBudget, setEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState(data.finances.totalBudget.toString());

  const [formData, setFormData] = useState({
    name: '',
    category: 'Local',
    value: '',
    date: '',
    status: 'Pendente',
    notes: '',
  });

  const totalBudget = data.finances.totalBudget;
  const totalExpenses = calculateTotalExpenses(data.finances.expenses);
  const remaining = totalBudget - totalExpenses;
  const paidExpenses = data.finances.expenses.filter((e) => e.status === 'Pago');
  const paidTotal = paidExpenses.reduce((sum, e) => sum + e.value, 0);

  const filteredExpenses =
    filterCategory === 'Todas'
      ? data.finances.expenses
      : data.finances.expenses.filter((e) => e.category === filterCategory);

  const handleSaveBudget = () => {
    const value = parseFloat(tempBudget) || 0;
    updateData((prev) => ({
      ...prev,
      finances: {
        ...prev.finances,
        totalBudget: value,
      },
    }));
    setEditingBudget(false);
  };

  const openNew = () => {
    setEditingExpense(null);
    setFormData({ name: '', category: 'Local', value: '', date: '', status: 'Pendente', notes: '' });
    setModalOpen(true);
  };

  const openEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      name: expense.name,
      category: expense.category,
      value: expense.value.toString(),
      date: expense.date,
      status: expense.status,
      notes: expense.notes || '',
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.value) return;
    const value = parseFloat(formData.value);

    updateData((prev) => {
      if (editingExpense) {
        return {
          ...prev,
          finances: {
            ...prev.finances,
            expenses: prev.finances.expenses.map((e) =>
              e.id === editingExpense.id
                ? { ...e, ...formData, value }
                : e
            ),
          },
        };
      }
      return {
        ...prev,
        finances: {
          ...prev.finances,
          expenses: [
            ...prev.finances.expenses,
            { id: `exp-${Date.now()}`, ...formData, value },
          ],
        },
      };
    });
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    updateData((prev) => ({
      ...prev,
      finances: {
        ...prev.finances,
        expenses: prev.finances.expenses.filter((e) => e.id !== id),
      },
    }));
  };

  return (
    <div className="finance" id="finance-summary">
      <PageHeader title="Financeiro" subtitle="Controle completo dos gastos do casamento" />

      <div className="finance-card finance-card-budget">
  <span className="finance-card-label">Orçamento Total</span>
  {editingBudget ? (
    <div className="finance-budget-edit">
      <input
        type="number"
        value={tempBudget}
        onChange={(e) => setTempBudget(e.target.value)}
        className="finance-budget-input"
        min="0"
      />
      <button className="finance-budget-save" onClick={handleSaveBudget}>OK</button>
      <button className="finance-budget-cancel" onClick={() => setEditingBudget(false)}>✕</button>
    </div>
  ) : (
    <div className="finance-budget-display">
      <span className="finance-card-value">{formatCurrency(totalBudget)}</span>
      <button className="finance-budget-edit-btn" onClick={() => {
        setTempBudget(totalBudget.toString());
        setEditingBudget(true);
      }}>
        <Edit3 size={12} />
      </button>
    </div>
  )}
</div>

      <div className="finance-progress-section">
        <div className="finance-progress-header">
          <span className="finance-progress-label">Utilização do orçamento</span>
          <span className="finance-progress-value">
            {totalBudget > 0 ? Math.round((totalExpenses / totalBudget) * 100) : 0}%
          </span>
        </div>
        <div className="finance-progress-track">
          <div
            className="finance-progress-fill"
            style={{ width: `${totalBudget > 0 ? Math.min((totalExpenses / totalBudget) * 100, 100) : 0}%` }}
          />
        </div>
      </div>

      <div className="finance-content">
        <div className="finance-toolbar">
          <h2 className="finance-section-title">Despesas</h2>
          <div className="finance-toolbar-actions">
            <select
              className="finance-filter"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="Todas">Todas categorias</option>
              {data.finances.categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button className="finance-add-btn" onClick={openNew}>
              <Plus size={16} />
              <span>Nova Despesa</span>
            </button>
          </div>
        </div>

        <div className="finance-table-wrapper">
          <table className="finance-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Valor</th>
                <th>Data</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan="6" className="finance-empty">
                    Nenhuma despesa cadastrada
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((expense) => (
                  <tr key={expense.id}>
                    <td className="finance-table-name">{expense.name}</td>
                    <td>
                      <span className="finance-category-badge">{expense.category}</span>
                    </td>
                    <td className="finance-table-value">{formatCurrency(expense.value)}</td>
                    <td>{expense.date ? new Date(expense.date + 'T00:00:00').toLocaleDateString('pt-BR') : '-'}</td>
                    <td>
                      <span className={`finance-status-badge finance-status-${expense.status.toLowerCase().replace(' ', '-')}`}>
                        {expense.status}
                      </span>
                    </td>
                    <td>
                      <div className="finance-table-actions">
                        <button className="finance-action-btn" onClick={() => openEdit(expense)} aria-label="Editar">
                          <Edit3 size={14} />
                        </button>
                        <button className="finance-action-btn finance-action-btn-danger" onClick={() => handleDelete(expense.id)} aria-label="Excluir">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingExpense ? 'Editar Despesa' : 'Nova Despesa'}
      >
        <div className="finance-modal-form">
          <div className="form-group">
            <label className="form-label" htmlFor="exp-name">Nome</label>
            <input
              id="exp-name"
              className="form-input"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nome da despesa..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="exp-category">Categoria</label>
              <select
                id="exp-category"
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {data.finances.categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="exp-value">Valor (R$)</label>
              <input
                id="exp-value"
                className="form-input"
                type="number"
                min="0"
                step="0.01"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder="0,00"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="exp-date">Data</label>
              <input
                id="exp-date"
                className="form-input"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="exp-status">Status</label>
              <select
                id="exp-status"
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Pendente">Pendente</option>
                <option value="Pago">Pago</option>
                <option value="Parcial">Parcial</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="exp-notes">Observação</label>
            <textarea
              id="exp-notes"
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
                {editingExpense ? 'Salvar' : 'Adicionar'}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Financeiro;