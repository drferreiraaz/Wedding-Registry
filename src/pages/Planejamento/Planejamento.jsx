import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/PageHeader/PageHeader';
import TaskCard from '../../components/TaskCard/TaskCard';
import Modal from '../../components/Modal/Modal';
import { calculatePhaseProgress } from '../../utils/calculations';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';

function Planejamento() {
  const { data, updateData } = useOutletContext();
  const { isAuthenticated } = useAuth();
  const [expandedPhase, setExpandedPhase] = useState(data.phases[0]?.id);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTaskPhase, setNewTaskPhase] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    responsible: 'Ambos',
    deadline: '',
    notes: '',
    weight: 5,
  });

  const toggleTask = (phaseId, taskId) => {
    updateData((prev) => ({
      ...prev,
      phases: prev.phases.map((phase) =>
        phase.id === phaseId
          ? {
              ...phase,
              tasks: phase.tasks.map((task) =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
              ),
            }
          : phase
      ),
    }));
  };

  const openNewTask = (phaseId) => {
    setNewTaskPhase(phaseId);
    setEditingTask(null);
    setFormData({ title: '', responsible: 'Ambos', deadline: '', notes: '', weight: 5 });
    setModalOpen(true);
  };

  const openEditTask = (phaseId, task) => {
    setNewTaskPhase(phaseId);
    setEditingTask(task);
    setFormData({
      title: task.title,
      responsible: task.responsible || 'Ambos',
      deadline: task.deadline || '',
      notes: task.notes || '',
      weight: task.weight || 5,
    });
    setModalOpen(true);
  };

  const handleSaveTask = () => {
    if (!formData.title.trim()) return;

    updateData((prev) => ({
      ...prev,
      phases: prev.phases.map((phase) => {
        if (phase.id !== newTaskPhase) return phase;
        if (editingTask) {
          return {
            ...phase,
            tasks: phase.tasks.map((task) =>
              task.id === editingTask.id
                ? { ...task, ...formData }
                : task
            ),
          };
        }
        return {
          ...phase,
          tasks: [
            ...phase.tasks,
            {
              id: `t-${Date.now()}`,
              ...formData,
              completed: false,
            },
          ],
        };
      }),
    }));
    setModalOpen(false);
  };

  const handleDeleteTask = (phaseId, taskId) => {
    updateData((prev) => ({
      ...prev,
      phases: prev.phases.map((phase) =>
        phase.id === phaseId
          ? { ...phase, tasks: phase.tasks.filter((t) => t.id !== taskId) }
          : phase
      ),
    }));
  };

  return (
    <div className="p-xl max-w-[900px] max-mobile:p-md" id="planning">
      <PageHeader title="Planejamento do casamento" />

      <div className="relative pl-lg">
        <div className="absolute left-[7px] top-[20px] bottom-[20px] w-[2px] bg-border-light" aria-hidden="true" />

        {data.phases.map((phase) => {
          const progress = calculatePhaseProgress(phase);
          const completedCount = phase.tasks.filter((t) => t.completed).length;
          const totalCount = phase.tasks.length;
          const isExpanded = expandedPhase === phase.id;

          return (
            <div key={phase.id} className="relative mb-lg">
              <div className="absolute -left-[20px] top-[28px] w-3 h-3 rounded-full bg-primary border-2 border-background z-[1]" />

              <div className="bg-surface border border-border-light rounded-lg overflow-hidden">
                <button
                  className="flex items-center justify-between p-lg w-full text-left bg-transparent border-none cursor-pointer transition-colors duration-200 ease-[ease] hover:bg-surface-alt max-mobile:flex-col max-mobile:items-start max-mobile:gap-sm"
                  onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
                  aria-expanded={isExpanded}
                >
                  <div className="flex flex-col gap-[2px]">
                    <span className="text-[0.7rem] text-text-muted font-medium tracking-[0.5px]">Fase {String(phase.number).padStart(2, '0')}</span>
                    <h2 className="font-serif text-[1.4rem] font-semibold text-text-primary">{phase.name}</h2>
                  </div>
                  <div className="flex items-center gap-md text-text-muted">
                    <div className="flex flex-col items-end gap-[2px]">
                      <span className="font-serif text-[1.3rem] font-semibold text-primary">{progress}%</span>
                      <span className="text-[0.75rem] text-text-muted">
                        {completedCount}/{totalCount} concluídas
                      </span>
                    </div>
                    {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-lg pb-lg border-t border-border-light">
                    <div className="w-full h-1 bg-progress-track rounded-[2px] overflow-hidden my-md">
                      <div
                        className="h-full bg-primary rounded-[2px] transition-[width] duration-[400ms] ease-[ease]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="flex flex-col gap-sm mb-md">
                      {phase.tasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onToggle={(taskId) => toggleTask(phase.id, taskId)}
                          onEdit={(t) => openEditTask(phase.id, t)}
                          readOnly={!isAuthenticated}
                        />
                      ))}
                    </div>

                    {isAuthenticated && (
                      <button
                        className="flex items-center gap-sm px-md py-sm text-[0.85rem] text-text-secondary rounded-sm transition-all duration-200 ease-[ease] hover:bg-surface-alt hover:text-primary"
                        onClick={() => openNewTask(phase.id)}
                      >
                        <Plus size={16} />
                        <span>Nova Tarefa</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
      >
        <div className="flex flex-col gap-md">
          <div className="form-group">
            <label className="form-label" htmlFor="task-title">Título</label>
            <input
              id="task-title"
              className="form-input"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Descreva a tarefa..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="task-responsible">Responsável</label>
              <select
                id="task-responsible"
                className="form-select"
                value={formData.responsible}
                onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
              >
                <option value="Davi">Davi</option>
                <option value="Nicolly">Nicolly</option>
                <option value="Ambos">Nós dois</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="task-deadline">Prazo</label>
              <input
                id="task-deadline"
                className="form-input"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="task-weight">Peso (1-10)</label>
            <input
              id="task-weight"
              className="form-input"
              type="number"
              min="1"
              max="10"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: parseInt(e.target.value) || 1 })}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="task-notes">Observações</label>
            <textarea
              id="task-notes"
              className="form-textarea"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Adicione observações..."
              rows={3}
            />
          </div>

          <div className="form-actions">
            {editingTask && (
              <button
                className="form-btn form-btn-danger"
                onClick={() => {
                  handleDeleteTask(newTaskPhase, editingTask.id);
                  setModalOpen(false);
                }}
              >
                Excluir
              </button>
            )}
            <div className="form-actions-right">
              <button className="form-btn form-btn-secondary" onClick={() => setModalOpen(false)}>
                Cancelar
              </button>
              <button className="form-btn form-btn-primary" onClick={handleSaveTask}>
                {editingTask ? 'Salvar' : 'Adicionar'}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Planejamento;
