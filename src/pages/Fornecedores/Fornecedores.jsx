import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import PageHeader from '../../components/PageHeader/PageHeader';
import Modal from '../../components/Modal/Modal';
import { formatCurrency } from '../../utils/calculations';
import { Plus, Trash2, Edit3 } from 'lucide-react';
import './style.css';

function Fornecedores() {
  const { data, updateData } = useOutletContext();
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
    <div className="suppliers" id="suppliers">
      <PageHeader title="Fornecedores" subtitle="Gerencie todos os fornecedores do casamento" />

      <div className="suppliers-content">
        <div className="suppliers-toolbar">
          <h2 className="suppliers-section-title">Lista de Fornecedores</h2>
          <div className="suppliers-toolbar-actions">
            <select
              className="suppliers-filter"
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
            <button className="suppliers-add-btn" onClick={openNew}>
              <Plus size={16} />
              <span>Novo Fornecedor</span>
            </button>
          </div>
        </div>

        <div className="suppliers-grid">
          {filteredSuppliers.length === 0 ? (
            <div className="suppliers-empty">
              Nenhum fornecedor encontrado
            </div>
          ) : (
            filteredSuppliers.map((supplier) => (
              <div key={supplier.id} className="supplier-card">
                <div className="supplier-card-header">
                  <h3 className="supplier-card-name">{supplier.name}</h3>
                  <span className="supplier-card-category">{supplier.category}</span>
                </div>

                <div className="supplier-card-body">
                  <div className="supplier-card-info">
                    <div className="supplier-info-row">
                      <span className="supplier-info-label">Contato</span>
                      <span className="supplier-info-value">{supplier.contact}</span>
                    </div>
                    <div className="supplier-info-row">
                      <span className="supplier-info-label">Valor total</span>
                      <span className="supplier-info-value">{formatCurrency(supplier.value)}</span>
                    </div>
                    <div className="supplier-info-row">
                      <span className="supplier-info-label">Entrada</span>
                      <span className="supplier-info-value">{formatCurrency(supplier.entry)}</span>
                    </div>
                    <div className="supplier-info-row">
                      <span className="supplier-info-label">Parcelas</span>
                      <span className="supplier-info-value">{supplier.installments}x</span>
                    </div>
                    <div className="supplier-info-row">
                      <span className="supplier-info-label">Vencimento</span>
                      <span className="supplier-info-value">
                        {supplier.dueDate ? new Date(supplier.dueDate + 'T00:00:00').toLocaleDateString('pt-BR') : '-'}
                      </span>
                    </div>
                  </div>

                  <div className="supplier-card-footer">
                    <span
                      className="supplier-status-badge"
                      style={{
                        backgroundColor: `${statusColors[supplier.status]}15`,
                        color: statusColors[supplier.status],
                      }}
                    >
                      {supplier.status}
                    </span>
                    {supplier.contract && (
                      <span className="supplier-contract-badge">Contrato assinado</span>
                    )}
                  </div>
                </div>

                <div className="supplier-card-actions">
                  <button className="supplier-action-btn" onClick={() => openEdit(supplier)} aria-label="Editar">
                    <Edit3 size={14} />
                  </button>
                  <button className="supplier-action-btn supplier-action-btn-danger" onClick={() => handleDelete(supplier.id)} aria-label="Excluir">
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
        title={editingSupplier ? 'Editar Fornecedor' : 'Novo Fornecedor'}
      >
        <div className="suppliers-modal-form">
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