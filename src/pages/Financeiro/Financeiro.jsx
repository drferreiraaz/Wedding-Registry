import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/PageHeader/PageHeader';
import Modal from '../../components/Modal/Modal';
import { formatCurrency, calculateTotalExpenses } from '../../utils/calculations';
import { Plus, Trash2, Edit3 } from 'lucide-react';

function Financeiro() {
  const { data, updateData } = useOutletContext();
  const { isAuthenticated } = useAuth();
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
    <div className="p-xl max-w-[1100px] max-mobile:p-md" id="finance-summary">
      <PageHeader title="Financeiro" subtitle="Controle completo dos gastos do casamento" />

      <div className="bg-surface border border-border-light rounded-md p-lg flex flex-col gap-xs">
        <span className="text-[0.8rem] text-text-secondary">Orçamento Total</span>
        {editingBudget ? (
          <div className="flex items-center gap-[4px]">
            <input
              type="number"
              value={tempBudget}
              onChange={(e) => setTempBudget(e.target.value)}
              className="w-[100px] px-sm py-[4px] border border-border rounded-sm text-[0.85rem] text-text-primary bg-surface focus:outline-none focus:border-primary"
              min="0"
            />
            <button className="px-sm py-[4px] bg-primary text-white rounded-sm text-[0.75rem] font-medium transition-colors duration-200 ease-[ease] hover:bg-primary-hover" onClick={handleSaveBudget}>OK</button>
            <button className="px-sm py-[4px] bg-surface-alt text-text-secondary border border-border rounded-sm text-[0.75rem] transition-colors duration-200 ease-[ease] hover:bg-border-light" onClick={() => setEditingBudget(false)}>✕</button>
          </div>
        ) : (
          <div className="flex items-center gap-sm">
            <span className="font-serif text-[1.3rem] font-semibold text-text-primary">{formatCurrency(totalBudget)}</span>
            {isAuthenticated && (
              <button className="flex items-center justify-center w-6 h-6 rounded-sm text-text-muted transition-all duration-200 ease-[ease] shrink-0 hover:bg-border-light hover:text-primary" onClick={() => {
                setTempBudget(totalBudget.toString());
                setEditingBudget(true);
              }}>
                <Edit3 size={12} />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="bg-surface border border-border-light rounded-md p-lg mb-xl">
        <div className="flex justify-between items-center mb-sm">
          <span className="text-[0.85rem] text-text-secondary">Utilização do orçamento</span>
          <span className="font-serif text-[1.1rem] font-semibold text-primary">
            {totalBudget > 0 ? Math.round((totalExpenses / totalBudget) * 100) : 0}%
          </span>
        </div>
        <div className="w-full h-[6px] bg-progress-track rounded-[3px] overflow-hidden">
          <div
            className="h-full bg-primary rounded-[3px] transition-[width] duration-[400ms] ease-[ease]"
            style={{ width: `${totalBudget > 0 ? Math.min((totalExpenses / totalBudget) * 100, 100) : 0}%` }}
          />
        </div>
      </div>

      <div className="bg-surface border border-border-light rounded-lg p-lg">
        <div className="flex items-center justify-between mb-lg flex-wrap gap-md max-mobile:flex-col max-mobile:items-start">
          <h2 className="font-serif text-[1.2rem] font-semibold text-text-primary">Despesas</h2>
          <div className="flex items-center gap-sm">
            <select
              className="px-[12px] py-sm border border-border rounded-sm text-[0.85rem] text-text-secondary bg-surface"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="Todas">Todas categorias</option>
              {data.finances.categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {isAuthenticated && (
              <button className="flex items-center gap-sm px-md py-sm bg-primary text-white rounded-sm text-[0.85rem] font-medium transition-colors duration-200 ease-[ease] hover:bg-primary-hover" onClick={openNew}>
                <Plus size={16} />
                <span>Nova Despesa</span>
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left px-md py-sm text-[0.75rem] font-semibold text-text-muted uppercase tracking-[0.5px] border-b border-border-light">Nome</th>
                <th className="text-left px-md py-sm text-[0.75rem] font-semibold text-text-muted uppercase tracking-[0.5px] border-b border-border-light">Categoria</th>
                <th className="text-left px-md py-sm text-[0.75rem] font-semibold text-text-muted uppercase tracking-[0.5px] border-b border-border-light">Valor</th>
                <th className="text-left px-md py-sm text-[0.75rem] font-semibold text-text-muted uppercase tracking-[0.5px] border-b border-border-light">Data</th>
                <th className="text-left px-md py-sm text-[0.75rem] font-semibold text-text-muted uppercase tracking-[0.5px] border-b border-border-light">Status</th>
                <th className="text-left px-md py-sm text-[0.75rem] font-semibold text-text-muted uppercase tracking-[0.5px] border-b border-border-light">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-xl text-text-muted italic">
                    Nenhuma despesa cadastrada
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((expense) => (
                  <tr key={expense.id}>
                    <td className="p-md text-[0.875rem] text-text-primary border-b border-border-light font-medium">{expense.name}</td>
                    <td className="p-md text-[0.875rem] text-text-primary border-b border-border-light">
                      <span className="inline-block px-[10px] py-[2px] bg-primary-lighter text-primary rounded-[20px] text-[0.75rem] font-medium">{expense.category}</span>
                    </td>
                    <td className="p-md text-[0.875rem] text-text-primary border-b border-border-light font-semibold font-sans">{formatCurrency(expense.value)}</td>
                    <td className="p-md text-[0.875rem] text-text-primary border-b border-border-light">{expense.date ? new Date(expense.date + 'T00:00:00').toLocaleDateString('pt-BR') : '-'}</td>
                    <td className="p-md text-[0.875rem] text-text-primary border-b border-border-light">
                      <span className={`inline-block px-[10px] py-[3px] rounded-[20px] text-[0.7rem] font-medium ${expense.status === 'Pago' ? 'bg-badge-done text-badge-done-text' : expense.status === 'Parcial' ? 'bg-badge-progress text-badge-progress-text' : 'bg-badge-pending text-badge-pending-text'}`}>
                        {expense.status}
                      </span>
                    </td>
                    <td className="p-md text-[0.875rem] text-text-primary border-b border-border-light">
                      {isAuthenticated && (
                        <div className="flex gap-[4px]">
                          <button className="flex items-center justify-center w-7 h-7 rounded-sm text-text-muted transition-all duration-200 ease-[ease] hover:bg-surface-alt hover:text-text-primary" onClick={() => openEdit(expense)} aria-label="Editar">
                            <Edit3 size={14} />
                          </button>
                          <button className="flex items-center justify-center w-7 h-7 rounded-sm text-text-muted transition-all duration-200 ease-[ease] hover:bg-badge-high hover:text-badge-high-text" onClick={() => handleDelete(expense.id)} aria-label="Excluir">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
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
        <div className="flex flex-col gap-md">
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
