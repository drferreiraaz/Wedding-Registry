import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import PageHeader from '../../components/PageHeader/PageHeader';
import Modal from '../../components/Modal/Modal';
import { getGuestStats } from '../../utils/calculations';
import { Plus, Trash2, Edit3, Search } from 'lucide-react';
import './style.css';

function Convidados() {
  const { data, updateData } = useOutletContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [filterRsvp, setFilterRsvp] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    family: '',
    rsvp: 'Pendente',
    table: '',
    notes: '',
  });

  const stats = getGuestStats(data.guests);

  const filteredGuests = data.guests.filter((g) => {
    const matchRsvp = filterRsvp === 'Todos' || g.rsvp === filterRsvp;
    const matchSearch = g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.family.toLowerCase().includes(searchTerm.toLowerCase());
    return matchRsvp && matchSearch;
  });

  const openNew = () => {
    setEditingGuest(null);
    setFormData({ name: '', family: '', rsvp: 'Pendente', table: '', notes: '' });
    setModalOpen(true);
  };

  const openEdit = (guest) => {
    setEditingGuest(guest);
    setFormData({
      name: guest.name,
      family: guest.family,
      rsvp: guest.rsvp,
      table: guest.table.toString(),
      notes: guest.notes || '',
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;

    updateData((prev) => {
      if (editingGuest) {
        return {
          ...prev,
          guests: prev.guests.map((g) =>
            g.id === editingGuest.id
              ? { ...g, ...formData, table: parseInt(formData.table) || 0 }
              : g
          ),
        };
      }
      return {
        ...prev,
        guests: [
          ...prev.guests,
          { id: `g-${Date.now()}`, ...formData, table: parseInt(formData.table) || 0 },
        ],
      };
    });
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    updateData((prev) => ({
      ...prev,
      guests: prev.guests.filter((g) => g.id !== id),
    }));
  };

  return (
    <div className="guests" id="guest-statistics">
      <PageHeader title="Convidados" subtitle="Gerencie sua lista de convidados" />

      <div className="guests-stats">
        <div className="guests-stat-card">
          <span className="guests-stat-value">{stats.total}</span>
          <span className="guests-stat-label">Total</span>
        </div>
        <div className="guests-stat-card guests-stat-confirmed">
          <span className="guests-stat-value">{stats.confirmed}</span>
          <span className="guests-stat-label">Confirmados</span>
        </div>
        <div className="guests-stat-card guests-stat-pending">
          <span className="guests-stat-value">{stats.pending}</span>
          <span className="guests-stat-label">Pendentes</span>
        </div>
        <div className="guests-stat-card guests-stat-declined">
          <span className="guests-stat-value">{stats.declined}</span>
          <span className="guests-stat-label">Recusaram</span>
        </div>
      </div>

      <div className="guests-content">
        <div className="guests-toolbar">
          <div className="guests-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Buscar convidado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="guests-search-input"
            />
          </div>
          <div className="guests-toolbar-actions">
            <select
              className="guests-filter"
              value={filterRsvp}
              onChange={(e) => setFilterRsvp(e.target.value)}
            >
              <option value="Todos">Todos</option>
              <option value="Confirmado">Confirmados</option>
              <option value="Pendente">Pendentes</option>
              <option value="Recusou">Recusaram</option>
            </select>
            <button className="guests-add-btn" onClick={openNew}>
              <Plus size={16} />
              <span>Novo Convidado</span>
            </button>
          </div>
        </div>

        <div className="guests-table-wrapper">
          <table className="guests-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Família</th>
                <th>RSVP</th>
                <th>Mesa</th>
                <th>Observação</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="guests-empty">
                    Nenhum convidado encontrado
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => (
                  <tr key={guest.id}>
                    <td className="guests-table-name">{guest.name}</td>
                    <td>{guest.family}</td>
                    <td>
                      <span className={`guests-rsvp-badge guests-rsvp-${guest.rsvp.toLowerCase()}`}>
                        {guest.rsvp}
                      </span>
                    </td>
                    <td>{guest.table > 0 ? guest.table : '-'}</td>
                    <td className="guests-table-notes">{guest.notes || '-'}</td>
                    <td>
                      <div className="guests-table-actions">
                        <button className="guests-action-btn" onClick={() => openEdit(guest)} aria-label="Editar">
                          <Edit3 size={14} />
                        </button>
                        <button className="guests-action-btn guests-action-btn-danger" onClick={() => handleDelete(guest.id)} aria-label="Excluir">
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
        title={editingGuest ? 'Editar Convidado' : 'Novo Convidado'}
      >
        <div className="guests-modal-form">
          <div className="form-group">
            <label className="form-label" htmlFor="guest-name">Nome</label>
            <input
              id="guest-name"
              className="form-input"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nome do convidado ou família..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="guest-family">Família</label>
              <input
                id="guest-family"
                className="form-input"
                type="text"
                value={formData.family}
                onChange={(e) => setFormData({ ...formData, family: e.target.value })}
                placeholder="Sobrenome..."
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="guest-rsvp">RSVP</label>
              <select
                id="guest-rsvp"
                className="form-select"
                value={formData.rsvp}
                onChange={(e) => setFormData({ ...formData, rsvp: e.target.value })}
              >
                <option value="Pendente">Pendente</option>
                <option value="Confirmado">Confirmado</option>
                <option value="Recusou">Recusou</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="guest-table">Mesa</label>
              <input
                id="guest-table"
                className="form-input"
                type="number"
                min="0"
                value={formData.table}
                onChange={(e) => setFormData({ ...formData, table: e.target.value })}
                placeholder="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="guest-notes">Observação</label>
            <textarea
              id="guest-notes"
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
                {editingGuest ? 'Salvar' : 'Adicionar'}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Convidados;