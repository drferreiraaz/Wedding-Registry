import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/PageHeader/PageHeader';
import Modal from '../../components/Modal/Modal';
import { getGuestStats } from '../../utils/calculations';
import { Plus, Trash2, Edit3, Search, Users } from 'lucide-react';

function Convidados() {
  const { data, updateData } = useOutletContext();
  const { isAuthenticated } = useAuth();
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
    const matchSearch = (g.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (g.family || '').toLowerCase().includes(searchTerm.toLowerCase());
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
      name: guest.name || '',
      family: guest.family || '',
      rsvp: guest.rsvp || 'Pendente',
      table: (guest.table ?? '').toString(),
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
    if (!window.confirm('Tem certeza que deseja excluir este convidado?')) return;
    updateData((prev) => ({
      ...prev,
      guests: prev.guests.filter((g) => g.id !== id),
    }));
  };

  return (
    <div className="p-xl max-w-[1100px] max-mobile:p-md" id="guest-statistics">
      <PageHeader title="Convidados" subtitle="Gerencie sua lista de convidados" />

      <div className="grid grid-cols-4 gap-md mb-xl max-nav:grid-cols-2 max-mobile:grid-cols-2">
        <div className="bg-surface border border-border-light rounded-md p-lg flex flex-col items-center gap-xs">
          <span className="font-serif text-[1.8rem] font-bold text-text-primary">{stats.total}</span>
          <span className="text-[0.8rem] text-text-secondary">Total</span>
        </div>
        <div className="bg-surface border border-border-light rounded-md p-lg flex flex-col items-center gap-xs">
          <span className="font-serif text-[1.8rem] font-bold text-success">{stats.confirmed}</span>
          <span className="text-[0.8rem] text-text-secondary">Confirmados</span>
        </div>
        <div className="bg-surface border border-border-light rounded-md p-lg flex flex-col items-center gap-xs">
          <span className="font-serif text-[1.8rem] font-bold text-warning">{stats.pending}</span>
          <span className="text-[0.8rem] text-text-secondary">Pendentes</span>
        </div>
        <div className="bg-surface border border-border-light rounded-md p-lg flex flex-col items-center gap-xs">
          <span className="font-serif text-[1.8rem] font-bold text-danger">{stats.declined}</span>
          <span className="text-[0.8rem] text-text-secondary">Recusaram</span>
        </div>
      </div>

      <div className="bg-surface border border-border-light rounded-lg p-lg">
        <div className="flex items-center justify-between mb-lg flex-wrap gap-md max-mobile:flex-col max-mobile:items-start">
          <div className="flex items-center gap-sm px-[12px] py-sm border border-border rounded-sm bg-surface text-text-muted">
            <Search size={16} />
            <input
              type="text"
              placeholder="Buscar convidado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-none outline-none text-[0.85rem] text-text-primary bg-transparent w-[200px]"
            />
          </div>
          <div className="flex items-center gap-sm">
            <select
              className="px-[12px] py-sm border border-border rounded-sm text-[0.85rem] text-text-secondary bg-surface"
              value={filterRsvp}
              onChange={(e) => setFilterRsvp(e.target.value)}
            >
              <option value="Todos">Todos</option>
              <option value="Confirmado">Confirmados</option>
              <option value="Pendente">Pendentes</option>
              <option value="Recusou">Recusaram</option>
            </select>
            {isAuthenticated && (
              <button className="flex items-center gap-sm px-md py-sm bg-primary text-white rounded-sm text-[0.85rem] font-medium transition-colors duration-200 ease-[ease] hover:bg-primary-hover" onClick={openNew}>
                <Plus size={16} />
                <span>Novo Convidado</span>
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr>
                <th className="text-left px-md py-sm text-[0.75rem] font-semibold text-text-muted uppercase tracking-[0.5px] border-b border-border-light">Nome</th>
                <th className="text-left px-md py-sm text-[0.75rem] font-semibold text-text-muted uppercase tracking-[0.5px] border-b border-border-light">Família</th>
                <th className="text-left px-md py-sm text-[0.75rem] font-semibold text-text-muted uppercase tracking-[0.5px] border-b border-border-light">RSVP</th>
                <th className="text-left px-md py-sm text-[0.75rem] font-semibold text-text-muted uppercase tracking-[0.5px] border-b border-border-light">Mesa</th>
                <th className="text-left px-md py-sm text-[0.75rem] font-semibold text-text-muted uppercase tracking-[0.5px] border-b border-border-light">Observação</th>
                <th className="text-left px-md py-sm text-[0.75rem] font-semibold text-text-muted uppercase tracking-[0.5px] border-b border-border-light">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-xl">
                    <div className="flex flex-col items-center gap-sm text-text-muted">
                      <Users size={28} className="text-border" />
                      <p className="italic text-[0.9rem]">
                        {data.guests.length === 0
                          ? 'Nenhum convidado cadastrado ainda.'
                          : 'Nenhum convidado encontrado com esse filtro.'}
                      </p>
                      {data.guests.length === 0 && isAuthenticated && (
                        <button className="empty-state-btn" onClick={openNew}>
                          + Adicionar convidado
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => (
                  <tr key={guest.id}>
                    <td className="p-md text-[0.875rem] text-text-primary border-b border-border-light font-medium">{guest.name}</td>
                    <td className="p-md text-[0.875rem] text-text-primary border-b border-border-light">{guest.family}</td>
                    <td className="p-md text-[0.875rem] text-text-primary border-b border-border-light">
                      <span className={`inline-block px-[10px] py-[3px] rounded-[20px] text-[0.7rem] font-medium ${guest.rsvp === 'Confirmado' ? 'bg-badge-done text-badge-done-text' : guest.rsvp === 'Recusou' ? 'bg-badge-high text-badge-high-text' : 'bg-badge-pending text-badge-pending-text'}`}>
                        {guest.rsvp}
                      </span>
                    </td>
                    <td className="p-md text-[0.875rem] text-text-primary border-b border-border-light">{guest.table > 0 ? guest.table : '-'}</td>
                    <td className="p-md text-[0.875rem] text-text-primary border-b border-border-light">{guest.notes || '-'}</td>
                    <td className="p-md text-[0.875rem] text-text-primary border-b border-border-light">
                      {isAuthenticated && (
                        <div className="flex gap-[4px]">
                          <button className="flex items-center justify-center w-7 h-7 rounded-sm text-text-muted transition-all duration-200 ease-[ease] hover:bg-surface-alt hover:text-text-primary" onClick={() => openEdit(guest)} aria-label="Editar">
                            <Edit3 size={14} />
                          </button>
                          <button className="flex items-center justify-center w-7 h-7 rounded-sm text-text-muted transition-all duration-200 ease-[ease] hover:bg-badge-high hover:text-badge-high-text" onClick={() => handleDelete(guest.id)} aria-label="Excluir">
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
        title={editingGuest ? 'Editar Convidado' : 'Novo Convidado'}
      >
        <div className="flex flex-col gap-md">
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
              <button className="form-btn form-btn-primary" onClick={handleSave} disabled={!formData.name.trim()}>
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
