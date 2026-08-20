import './style.css';
import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import PageHeader from '../../components/PageHeader/PageHeader';
import Modal from '../../components/Modal/Modal';
import { CheckCircle, Circle, Plus, Trash2, Edit3 } from 'lucide-react';

function Cronograma() {
  const { data, updateData } = useOutletContext();
  const [expandedItem, setExpandedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [currentTimelineId, setCurrentTimelineId] = useState(null);

  const [formData, setFormData] = useState({
    label: '',
    date: '',
    tasks: [],
  });

  const [taskFormData, setTaskFormData] = useState({
    text: '',
  });

  const toggleTaskInItem = (timelineId, taskIndex) => {
    const key = `${timelineId}-${taskIndex}`;
    updateData((prev) => ({
      ...prev,
      timeline: prev.timeline.map((item) => {
        if (item.id !== timelineId) return item;
        const completedTasks = item.completedTasks || [];
        const hasKey = completedTasks.includes(key);
        return {
          ...item,
          completedTasks: hasKey
            ? completedTasks.filter((k) => k !== key)
            : [...completedTasks, key],
        };
      }),
    }));
  };

  const openNewItem = () => {
    setEditingItem(null);
    setFormData({ label: '', date: '', tasks: [] });
    setModalOpen(true);
  };

  const openEditItem = (item) => {
    setEditingItem(item);
    setFormData({ label: item.label, date: item.date, tasks: item.tasks });
    setModalOpen(true);
  };

  const handleSaveItem = () => {
    if (!formData.label.trim()) return;

    updateData((prev) => {
      if (editingItem) {
        return {
          ...prev,
          timeline: prev.timeline.map((i) =>
            i.id === editingItem.id ? { ...i, ...formData } : i
          ),
        };
      }
      return {
        ...prev,
        timeline: [
          ...prev.timeline,
          { id: `tl-${Date.now()}`, ...formData, completedTasks: [] },
        ],
      };
    });
    setModalOpen(false);
  };

  const handleDeleteItem = (id) => {
    updateData((prev) => ({
      ...prev,
      timeline: prev.timeline.filter((i) => i.id !== id),
    }));
  };

  const openNewTask = (timelineId) => {
    setCurrentTimelineId(timelineId);
    setEditingTask(null);
    setTaskFormData({ text: '' });
    setTaskModalOpen(true);
  };

  const openEditTask = (timelineId, taskIndex) => {
    const item = data.timeline.find((i) => i.id === timelineId);
    if (!item) return;
    setCurrentTimelineId(timelineId);
    setEditingTask({ index: taskIndex, text: item.tasks[taskIndex] });
    setTaskFormData({ text: item.tasks[taskIndex] });
    setTaskModalOpen(true);
  };

  const handleSaveTask = () => {
    if (!taskFormData.text.trim()) return;

    updateData((prev) => ({
      ...prev,
      timeline: prev.timeline.map((item) => {
        if (item.id !== currentTimelineId) return item;
        const newTasks = [...item.tasks];
        if (editingTask !== null) {
          newTasks[editingTask.index] = taskFormData.text;
        } else {
          newTasks.push(taskFormData.text);
        }
        return { ...item, tasks: newTasks };
      }),
    }));
    setTaskModalOpen(false);
  };

  const handleDeleteTask = (timelineId, taskIndex) => {
    updateData((prev) => ({
      ...prev,
      timeline: prev.timeline.map((item) => {
        if (item.id !== timelineId) return item;
        const newTasks = item.tasks.filter((_, i) => i !== taskIndex);
        const key = `${timelineId}-${taskIndex}`;
        const completedTasks = (item.completedTasks || []).filter((k) => k !== key);
        return { ...item, tasks: newTasks, completedTasks };
      }),
    }));
  };

  return (
    <div className="timeline" id="timeline">
      <PageHeader title="Cronograma" subtitle="Linha do tempo do planejamento" />

      <div className="timeline-toolbar">
        <button className="timeline-add-btn" onClick={openNewItem}>
          <Plus size={16} />
          <span>Novo Marco</span>
        </button>
      </div>

      <div className="timeline-list">
        {data.timeline.length === 0 ? (
          <div className="timeline-empty">
            <p>Nenhum marco no cronograma ainda.</p>
            <p className="timeline-empty-sub">Adicione marcos como "12 meses antes", "6 meses antes", etc.</p>
          </div>
        ) : (
          data.timeline.map((item) => {
            const completedTasks = item.completedTasks || [];
            const completedCount = completedTasks.length;
            const totalCount = item.tasks.length;
            const isExpanded = expandedItem === item.id;

            return (
              <div key={item.id} className="timeline-item">
                <div className="timeline-item-dot" />

                <div className="timeline-item-card">
                  <button
                    className="timeline-item-header"
                    onClick={() => setExpandedItem(isExpanded ? null : item.id)}
                    aria-expanded={isExpanded}
                  >
                    <div className="timeline-item-header-left">
                      <span className="timeline-item-label">{item.label}</span>
                      <h3 className="timeline-item-date">
                        {item.date ? new Date(item.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Sem data'}
                      </h3>
                    </div>
                    <div className="timeline-item-header-right">
                      <span className="timeline-item-count">
                        {completedCount}/{totalCount}
                      </span>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="timeline-item-body">
                      <div className="timeline-item-actions">
                        <button className="timeline-item-edit-btn" onClick={() => openEditItem(item)}>
                          <Edit3 size={14} />
                        </button>
                        <button className="timeline-item-delete-btn" onClick={() => handleDeleteItem(item.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {item.tasks.map((task, taskIndex) => {
                        const key = `${item.id}-${taskIndex}`;
                        const isDone = completedTasks.includes(key);
                        return (
                          <div key={key} className="timeline-task">
                            <button
                              className="timeline-task-check"
                              onClick={() => toggleTaskInItem(item.id, taskIndex)}
                              aria-label={isDone ? 'Desmarcar' : 'Marcar como feito'}
                            >
                              {isDone ? (
                                <CheckCircle size={18} className="timeline-task-check-icon timeline-task-check-done" />
                              ) : (
                                <Circle size={18} className="timeline-task-check-icon timeline-task-check-empty" />
                              )}
                            </button>
                            <span className={`timeline-task-text ${isDone ? 'timeline-task-text-done' : ''}`}>
                              {task}
                            </span>
                            <div className="timeline-task-actions">
                              <button className="timeline-task-edit-btn" onClick={() => openEditTask(item.id, taskIndex)}>
                                <Edit3 size={12} />
                              </button>
                              <button className="timeline-task-delete-btn" onClick={() => handleDeleteTask(item.id, taskIndex)}>
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      <button className="timeline-add-task-btn" onClick={() => openNewTask(item.id)}>
                        <Plus size={14} />
                        <span>Adicionar tarefa</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Editar Marco' : 'Novo Marco'}
      >
        <div className="timeline-modal-form">
          <div className="form-group">
            <label className="form-label" htmlFor="tl-label">Label</label>
            <input
              id="tl-label"
              className="form-input"
              type="text"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              placeholder="Ex: 12 meses antes"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="tl-date">Data</label>
            <input
              id="tl-date"
              className="form-input"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div className="form-actions">
            <div />
            <div className="form-actions-right">
              <button className="form-btn form-btn-secondary" onClick={() => setModalOpen(false)}>
                Cancelar
              </button>
              <button className="form-btn form-btn-primary" onClick={handleSaveItem}>
                {editingItem ? 'Salvar' : 'Adicionar'}
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        title={editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
      >
        <div className="timeline-modal-form">
          <div className="form-group">
            <label className="form-label" htmlFor="task-text">Tarefa</label>
            <input
              id="task-text"
              className="form-input"
              type="text"
              value={taskFormData.text}
              onChange={(e) => setTaskFormData({ ...taskFormData, text: e.target.value })}
              placeholder="Descreva a tarefa..."
            />
          </div>

          <div className="form-actions">
            <div />
            <div className="form-actions-right">
              <button className="form-btn form-btn-secondary" onClick={() => setTaskModalOpen(false)}>
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

export default Cronograma;