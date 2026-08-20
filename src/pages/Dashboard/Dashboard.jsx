import './style.css';
import React, { useState, useRef } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import PhaseCard from '../../components/PhaseCard/PhaseCard';
import StatsGrid from '../../components/StatsGrid/StatsGrid';
import NextMission from '../../components/NextMission/NextMission';
import ImagePlaceholder from '../../components/ImagePlaceholder/ImagePlaceholder';
import { calculateOverallProgress, calculateDaysUntil } from '../../utils/calculations';
import { Calendar, Edit3, Upload, X } from 'lucide-react';

function Dashboard() {
  const { data, updateData } = useOutletContext();
  const navigate = useNavigate();
  const overallProgress = calculateOverallProgress(data.phases);
  const [editingDate, setEditingDate] = useState(false);
  const [tempDate, setTempDate] = useState(data.wedding.date || '');
  const fileInputRef = useRef(null);

  const daysUntil = data.wedding.date ? calculateDaysUntil(data.wedding.date) : 0;

  const handleSaveDate = () => {
    if (tempDate) {
      const date = new Date(tempDate + 'T00:00:00');
      const formatted = date.toLocaleDateString('pt-BR');
      updateData((prev) => ({
        ...prev,
        wedding: {
          ...prev.wedding,
          date: tempDate,
          dateFormatted: formatted,
        },
      }));
    }
    setEditingDate(false);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem válida.');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      alert('A imagem é muito grande. O limite é 4MB para não estourar o localStorage.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      updateData((prev) => ({
        ...prev,
        wedding: {
          ...prev.wedding,
          dressPhotoUrl: event.target.result,
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    if (window.confirm('Remover a foto do vestido?')) {
      updateData((prev) => ({
        ...prev,
        wedding: {
          ...prev.wedding,
          dressPhotoUrl: null,
        },
      }));
    }
  };

  return (
    <div className="dashboard" id="dashboard">
      <div className="dashboard-hero">
        <div className="dashboard-hero-content">
          <h1 className="dashboard-hero-title">Nosso Casamento</h1>
          <p className="dashboard-hero-text">{data.wedding.tagline}</p>

          <div className="dashboard-hero-date">
            {editingDate ? (
              <div className="dashboard-date-edit">
                <input
                  type="date"
                  value={tempDate}
                  onChange={(e) => setTempDate(e.target.value)}
                  className="dashboard-date-input"
                />
                <button className="dashboard-date-save" onClick={handleSaveDate}>Salvar</button>
                <button className="dashboard-date-cancel" onClick={() => setEditingDate(false)}>Cancelar</button>
              </div>
            ) : (
              <div className="dashboard-date-display">
                <Calendar size={16} />
                <span className="dashboard-date-text">
                  {data.wedding.dateFormatted || 'Data não definida'}
                </span>
                <button className="dashboard-date-edit-btn" onClick={() => {
                  setTempDate(data.wedding.date || '');
                  setEditingDate(true);
                }}>
                  <Edit3 size={12} />
                </button>
              </div>
            )}
            {data.wedding.date && (
              <span className="dashboard-countdown">{daysUntil} dias até o grande dia</span>
            )}
          </div>

          <div className="dashboard-hero-progress">
            <div className="dashboard-hero-progress-labels">
              <span className="dashboard-hero-progress-label">Progresso Geral</span>
              <span className="dashboard-hero-progress-value">{overallProgress}%</span>
            </div>
            <div className="dashboard-hero-progress-track">
              <div
                className="dashboard-hero-progress-fill"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="dashboard-hero-image">
          {data.wedding.dressPhotoUrl ? (
            <div className="dashboard-dress-photo">
              <img
                src={data.wedding.dressPhotoUrl}
                alt="Foto do vestido de noiva"
                className="dashboard-dress-photo-img"
              />
              <div className="dashboard-dress-photo-overlay">
                <button
                  className="dashboard-dress-photo-btn dashboard-dress-photo-btn-remove"
                  onClick={handleRemovePhoto}
                  title="Remover foto"
                >
                  <X size={16} />
                </button>
                <button
                  className="dashboard-dress-photo-btn dashboard-dress-photo-btn-change"
                  onClick={() => fileInputRef.current?.click()}
                  title="Trocar foto"
                >
                  <Upload size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="dashboard-dress-upload">
              <ImagePlaceholder
                description="Foto do vestido de noiva"
                className="dashboard-hero-image-placeholder"
              />
              <button
                className="dashboard-dress-upload-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={16} />
                <span>Adicionar foto</span>
              </button>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            style={{ display: 'none' }}
            aria-label="Selecionar foto do vestido"
          />
        </div>
      </div>

      <StatsGrid
        finances={data.finances}
        guests={data.guests}
        weddingDate={data.wedding.date}
        expenses={data.finances.expenses}
      />

      <div className="dashboard-bottom">
        <div className="dashboard-phases">
          <h2 className="dashboard-section-title">Nosso caminho até o "sim"</h2>
          <div className="dashboard-phases-list">
            {data.phases.slice(0, 4).map((phase) => (
              <PhaseCard
                key={phase.id}
                phase={phase}
                onClick={() => navigate('/planejamento')}
              />
            ))}
          </div>
          <button className="dashboard-phases-more" onClick={() => navigate('/planejamento')}>
            Ver todas as 10 fases
          </button>
        </div>

        <div className="dashboard-focus">
          <h2 className="dashboard-section-title">Foco Atual</h2>
          {data.phases.some(p => p.tasks.length > 0) ? (
            <NextMission phases={data.phases} weddingDate={data.wedding.date} />
          ) : (
            <div className="dashboard-empty-focus">
              <p>Nenhuma tarefa criada ainda.</p>
              <button className="dashboard-empty-focus-btn" onClick={() => navigate('/planejamento')}>
                Começar planejamento
              </button>
            </div>
          )}

          <div className="dashboard-focus-tip">
            <div className="dashboard-focus-tip-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18h6" />
                <path d="M10 22h4" />
                <path d="M12 2v1" />
                <path d="M12 7a5 5 0 0 0-5 5c0 2 1 3 2 4h6c1-1 2-2 2-4a5 5 0 0 0-5-5z" />
              </svg>
            </div>
            <p className="dashboard-focus-tip-text">
              "O local dita o tom de toda a festa. Visitem lugares que contem uma história parecida com a de vocês."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;