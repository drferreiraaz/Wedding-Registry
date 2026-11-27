import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/PageHeader/PageHeader';
import Modal from '../../components/Modal/Modal';
import { formatCurrency } from '../../utils/calculations';
import { Plus, Trash2, Edit3 } from 'lucide-react';

function Fornecedores() {
  const { data, updateData } = useOutletContext();
  const { isAuthenticated } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [filterStatus, setFilterStatus] = useState('Todos');

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    contact: '',
    value: '',
    entry: '',
    installments: '',
    dueDate: '',
    status: 'Pesquisando',
    contract: false,
  });

  const filteredSuppliers =
    filterStatus === 'Todos'
      ? data.suppliers
      : data.suppliers.filter((s) => s.status === filterStatus);

  const openNew = () => {
    setEditingSupplier(null);
    setFormData({ name: '', category: '', contact: '', value: '', entry: '', installments: '', dueDate: '', status: 'Pesquisando', contract: false });
    setModalOpen(true);
  };

  const openEdit = (supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      category: supplier.category,
      contact: supplier.contact,
      value: supplier.value.toString(),
      entry: supplier.entry.toString(),
      installments: supplier.installments.toString(),
      dueDate: supplier.dueDate,
      status: supplier.status,
      contract: supplier.contract,
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;

    updateData((prev) => {
      if (editingSupplier) {
        return {
          ...prev,
          suppliers: prev.suppliers.map((s) =>
            s.id === editingSupplier.id
              ? {
                  ...s,
                  ...formData,
                  value: parseFloat(formData.value) || 0,
                  entry: parseFloat(formData.entry) || 0,
                  installments: parseInt(formData.installments) || 1,
                }
              : s
          ),
        };
      }
      return {
        ...prev,
        suppliers: [
          ...prev.suppliers,
          {
            id: `s-${Date.now()}`,
            ...formData,
            value: parseFloat(formData.value) || 0,
            entry: parseFloat(formData.entry) || 0,
            installments: parseInt(formData.installments) || 1,
          },
        ],
      };
    });
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    updateData((prev) => ({
      ...prev,
      suppliers: prev.suppliers.filter((s) => s.id !== id),
    }));
  };

  const statusColors = {
    'Pesquisando': 'var(--color-badge-pending-text)',
    'Orçamento recebido': 'var(--color-info)',
    'Negociação': 'var(--color-warning)',
    'Contratado': 'var(--color-primary)',
    'Pago': 'var(--color-success)',
  };

  return (
    <div className="p-xl max-w-[1100px] max-mobile:p-md" id="suppliers">
      <PageHeader title="Fornecedores" subtitle="Gerencie todos os fornecedores do casamento" />

      <div className="bg-surface border border-border-light rounded-lg p-lg">
        <div className="flex items-center justify-between mb-lg flex-wrap gap-md max-mobile:flex-col max-mobile:items-start">
          <h2 className="font-serif text-[1.2rem] font-semibold text-text-primary">Lista de Fornecedores</h2>
          <div className="flex items-center gap-sm">
            <select
              className="px-[12px] py-sm border border-border rounded-sm text-[0.85rem] text-text-secondary bg-surface"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="Todos">Todos</option>
              <option value="Pesquisando">Pesquisando</option>
              <option value="Orçamento recebido">Orçamento recebido</option>
              <option value="Negociação">Negociação</option>
              <option value="Contratado">Contratado</option>
              <option value="Pago">Pago</option>
            </select>
            {isAuthenticated && (
              <button className="flex items-center gap-sm px-md py-sm bg-primary text-white rounded-sm text-[0.85rem] font-medium transition-colors duration-200 ease-[ease] hover:bg-primary-hover" onClick={openNew}>
                <Plus size={16} />
                <span>Novo Fornecedor</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-md max-mobile:grid-cols-1">
          {filteredSuppliers.length === 0 ? (
            <div className="text-center p-2xl text-text-muted italic col-span-full">
              Nenhum fornecedor encontrado
            </div>
          ) : (
            filteredSuppliers.map((supplier) => (
              <div key={supplier.id} className="bg-surface-alt border border-border-light rounded-md p-md flex flex-col gap-sm transition-all duration-200 ease-[ease] hover:border-border hover:shadow-sm">
                <div className="flex items-start justify-between gap-sm">
                  <h3 className="font-serif text-[1.05rem] font-semibold text-text-primary">{supplier.name}</h3>
                  <span className="text-[0.7rem] px-sm py-[2px] bg-primary-lighter text-primary rounded-[20px] font-medium whitespace-nowrap">{supplier.category}</span>
                </div>

                <div className="flex-1">
                  <div className="flex flex-col gap-[6px]">
                    <div className="flex justify-between text-[0.8rem]">
                      <span className="text-text-muted">Contato</span>
                      <span className="text-text-primary font-medium">{supplier.contact}</span>
                    </div>
                    <div className="flex justify-between text-[0.8rem]">
                      <span className="text-text-muted">Valor total</span>
                      <span className="text-text-primary font-medium">{formatCurrency(supplier.value)}</span>
                    </div>
                    <div className="flex justify-between text-[0.8rem]">
                      <span className="text-text-muted">Entrada</span>
                      <span className="text-text-primary font-medium">{formatCurrency(supplier.entry)}</span>
                    </div>
                    <div className="flex justify-between text-[0.8rem]">
                      <span className="text-text-muted">Parcelas</span>
                      <span className="text-text-primary font-medium">{supplier.installments}x</span>
                    </div>
                    <div className="flex justify-between text-[0.8rem]">
                      <span className="text-text-muted">Vencimento</span>
                      <span className="text-text-primary font-medium">
                        {supplier.dueDate ? new Date(supplier.dueDate + 'T00:00:00').toLocaleDateString('pt-BR') : '-'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-sm mt-sm flex-wrap">
                    <span
                      className="inline-block px-[10px] py-[3px] rounded-[20px] text-[0.7rem] font-medium"
                      style={{
                        backgroundColor: `${statusColors[supplier.status]}15`,
                        color: statusColors[supplier.status],
                      }}
                    >
                      {supplier.status}
                    </span>
                    {supplier.contract && (
                      <span className="text-[0.7rem] text-success font-medium">Contrato assinado</span>
                    )}
                  </div>
                </div>

                {isAuthenticated && (
                  <div className="flex gap-[4px] pt-sm border-t border-border-light">
                    <button className="flex items-center justify-center w-7 h-7 rounded-sm text-text-muted transition-all duration-200 ease-[ease] hover:bg-surface hover:text-text-primary" onClick={() => openEdit(supplier)} aria-label="Editar">
                      <Edit3 size={14} />
                    </button>
                    <button className="flex items-center justify-center w-7 h-7 rounded-sm text-text-muted transition-all duration-200 ease-[ease] hover:bg-badge-high hover:text-badge-high-text" onClick={() => handleDelete(supplier.id)} aria-label="Excluir">
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSupplier ? 'Editar Fornecedor' : 'Novo Fornecedor'}
      >
        <div className="flex flex-col gap-md">
          <div className="form-group">
            <label className="form-label" htmlFor="sup-name">Nome</label>
            <input
              id="sup-name"
              className="form-input"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nome do fornecedor..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="sup-category">Categoria</label>
              <input
                id="sup-category"
                className="form-input"
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Ex: Fotografia"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="sup-contact">Contato</label>
              <input
                id="sup-contact"
                className="form-input"
                type="text"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                placeholder="Telefone/email..."
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="sup-value">Valor total (R$)</label>
              <input
                id="sup-value"
                className="form-input"
                type="number"
                min="0"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="sup-entry">Entrada (R$)</label>
              <input
                id="sup-entry"
                className="form-input"
                type="number"
                min="0"
                value={formData.entry}
                onChange={(e) => setFormData({ ...formData, entry: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="sup-installments">Parcelas</label>
              <input
                id="sup-installments"
                className="form-input"
                type="number"
                min="1"
                value={formData.installments}
                onChange={(e) => setFormData({ ...formData, installments: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="sup-dueDate">Vencimento</label>
              <input
                id="sup-dueDate"
                className="form-input"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="sup-status">Status</label>
              <select
                id="sup-status"
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Pesquisando">Pesquisando</option>
                <option value="Orçamento recebido">Orçamento recebido</option>
                <option value="Negociação">Negociação</option>
                <option value="Contratado">Contratado</option>
                <option value="Pago">Pago</option>
              </select>
            </div>
            <div className="form-group" style={{ justifyContent: 'flex-end', display: 'flex', flexDirection: 'column' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.contract}
                  onChange={(e) => setFormData({ ...formData, contract: e.target.checked })}
                  style={{ width: '16px', height: '16px' }}
                />
                Contrato assinado
              </label>
            </div>
          </div>

          <div className="form-actions">
            <div />
            <div className="form-actions-right">
              <button className="form-btn form-btn-secondary" onClick={() => setModalOpen(false)}>
                Cancelar
              </button>
              <button className="form-btn form-btn-primary" onClick={handleSave}>
                {editingSupplier ? 'Salvar' : 'Adicionar'}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Fornecedores;
