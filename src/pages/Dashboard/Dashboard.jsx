import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PhaseCard from '../../components/PhaseCard/PhaseCard';
import StatsGrid from '../../components/StatsGrid/StatsGrid';
import NextMission from '../../components/NextMission/NextMission';
import ImagePlaceholder from '../../components/ImagePlaceholder/ImagePlaceholder';
import { calculateOverallProgress, calculateDaysUntil } from '../../utils/calculations';
import { Calendar, Edit3, Lock } from 'lucide-react';
import './style.css';

function Dashboard() {
  const { data, updateData } = useOutletContext();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const overallProgress = calculateOverallProgress(data.phases);
  const daysUntil = data.wedding.date ? calculateDaysUntil(data.wedding.date) : 0;

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/') || file.size > 3 * 1024 * 1024) {
      alert('Selecione uma imagem válida de até 3MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => updateData(prev => ({ ...prev, wedding: { ...prev.wedding, dressPhotoUrl: event.target.result } }));
    reader.readAsDataURL(file);
  };

  return (
    <div className="dashboard" id="dashboard">
      <div className="dashboard-hero">
        <div className="dashboard-hero-content">
          <h1 className="dashboard-hero-title">Nosso Casamento</h1>
          <p className="dashboard-hero-text">{data.wedding.tagline}</p>

          <div className="dashboard-hero-date">
            <div className="dashboard-date-display">
              <Calendar size={16} />
              <span className="dashboard-date-text">
                {data.wedding.dateFormatted || 'Data não definida'}
              </span>
            </div>
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
          {isAuthenticated ? (
            <div className="dashboard-dress-upload">
              {data.wedding.dressPhotoUrl ? (
                <img src={data.wedding.dressPhotoUrl} alt="Vestido de noiva" className="dashboard-dress-img" />
              ) : (
                <ImagePlaceholder
                  description="Foto do vestido de noiva"
                  className="dashboard-hero-image-placeholder"
                />
              )}
              <label className="dashboard-dress-upload-btn">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
                <span>📷 {data.wedding.dressPhotoUrl ? 'Trocar foto' : 'Adicionar foto'}</span>
              </label>
            </div>
          ) : data.wedding.dressPhotoUrl ? (
            <img src={data.wedding.dressPhotoUrl} alt="Vestido de noiva" className="dashboard-dress-img" />
          ) : (
            <div className="dashboard-locked-content">
              <Lock size={32} />
              <span>Faça login para ver</span>
            </div>
          )}
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
              <div key={phase.id} className={!isAuthenticated ? 'dashboard-phase-locked' : ''}>
                {isAuthenticated ? (
                  <PhaseCard
                    phase={phase}
                    onClick={() => navigate('/planejamento')}
                  />
                ) : (
                  <div className="phase-card phase-card-locked">
                    <div className="phase-card-header">
                      <div className="phase-card-icon">
                        <Lock size={16} />
                      </div>
                      <h3 className="phase-card-title">
                        {phase.number}. {phase.name}
                      </h3>
                    </div>
                    <div className="phase-card-body">
                      <div className="phase-card-locked-message">
                        <Lock size={14} />
                        <span>Área restrita aos noivos</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {isAuthenticated ? (
            <button className="dashboard-phases-more" onClick={() => navigate('/planejamento')}>
              Ver todas as 10 fases
            </button>
          ) : (
            <div className="dashboard-phases-more dashboard-phases-more-locked">
              <Lock size={14} />
              <span>Faça login para ver todas as fases</span>
            </div>
          )}
        </div>

        <div className="dashboard-focus">
          <h2 className="dashboard-section-title">Foco Atual</h2>
          {isAuthenticated ? (
            data.phases.some(p => p.tasks.length > 0) ? (
              <NextMission phases={data.phases} weddingDate={data.wedding.date} />
            ) : (
              <div className="dashboard-empty-focus">
                <p>Nenhuma tarefa criada ainda.</p>
                <button className="dashboard-empty-focus-btn" onClick={() => navigate('/planejamento')}>
                  Começar planejamento
                </button>
              </div>
            )
          ) : (
            <div className="dashboard-locked-focus">
              <Lock size={32} />
              <p>Faça login para ver o foco atual</p>
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