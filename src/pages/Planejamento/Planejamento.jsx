import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import PageHeader from '../../components/PageHeader/PageHeader';
import TaskCard from '../../components/TaskCard/TaskCard';
import Modal from '../../components/Modal/Modal';
import { calculatePhaseProgress } from '../../utils/calculations';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import './style.css';

function Planejamento() {
  const { data, updateData } = useOutletContext();
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
    <div className="planning" id="planning">
      <PageHeader title="Planejamento do casamento" />

      <div className="planning-timeline">
        {data.phases.map((phase) => {
          const progress = calculatePhaseProgress(phase);
          const completedCount = phase.tasks.filter((t) => t.completed).length;
          const totalCount = phase.tasks.length;
          const isExpanded = expandedPhase === phase.id;

          return (
            <div key={phase.id} className="planning-phase">
              <div className="planning-phase-dot" />

              <div className="planning-phase-card">
                <button
                  className="planning-phase-header"
                  onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
                  aria-expanded={isExpanded}
                >
                  <div className="planning-phase-header-left">
                    <span className="planning-phase-number">Fase {String(phase.number).padStart(2, '0')}</span>
                    <h2 className="planning-phase-name">{phase.name}</h2>
                  </div>
                  <div className="planning-phase-header-right">
                    <div className="planning-phase-progress-text">
                      <span className="planning-phase-progress-value">{progress}%</span>
                      <span className="planning-phase-progress-count">
                        {completedCount}/{totalCount} concluídas
                      </span>
                    </div>
                    {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="planning-phase-body">
                    <div className="planning-phase-progress-bar">
                      <div
                        className="planning-phase-progress-fill"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="planning-tasks">
                      {phase.tasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onToggle={(taskId) => toggleTask(phase.id, taskId)}
                          onEdit={(t) => openEditTask(phase.id, t)}
                        />
                      ))}
                    </div>

                    <button
                      className="planning-add-task"
                      onClick={() => openNewTask(phase.id)}
                    >
                      <Plus size={16} />
                      <span>Nova Tarefa</span>
                    </button>
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
        <div className="planning-modal-form">
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