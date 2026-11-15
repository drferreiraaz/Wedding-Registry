import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PhaseCard from '../../components/PhaseCard/PhaseCard';
import StatsGrid from '../../components/StatsGrid/StatsGrid';
import NextMission from '../../components/NextMission/NextMission';
import ImagePlaceholder from '../../components/ImagePlaceholder/ImagePlaceholder';
import { calculateOverallProgress, calculateDaysUntil } from '../../utils/calculations';
import { Calendar, Lock } from 'lucide-react';

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
    <div className="p-xl max-w-[1200px] max-mobile:p-md" id="dashboard">
      <div className="bg-surface border border-border-light rounded-lg p-2xl flex items-center gap-2xl mb-xl max-lg:flex-col max-lg:text-center max-mobile:p-lg">
        <div className="flex-1">
          <h1 className="font-serif text-[2.5rem] font-bold text-text-primary mb-sm max-mobile:text-[1.8rem]">Nosso Casamento</h1>
          <p className="text-[1rem] text-text-secondary leading-[1.6] mb-xl max-w-[500px] max-lg:mx-auto">{data.wedding.tagline}</p>

          <div className="mb-lg">
            <div className="flex items-center gap-sm px-md py-sm bg-surface-alt border border-border-light rounded-sm w-fit mb-sm">
              <Calendar size={16} />
              <span className="text-[0.9rem] text-text-primary font-medium">
                {data.wedding.dateFormatted || 'Data não definida'}
              </span>
            </div>
            {data.wedding.date && (
              <span className="text-[0.85rem] text-primary font-medium">{daysUntil} dias até o grande dia</span>
            )}
          </div>

          <div className="max-w-[500px] max-lg:mx-auto">
            <div className="flex justify-between items-center mb-sm">
              <span className="text-[0.8rem] text-text-secondary">Progresso Geral</span>
              <span className="font-serif text-[1.5rem] font-semibold text-primary">{overallProgress}%</span>
            </div>
            <div className="w-full h-[6px] bg-progress-track rounded-[3px] overflow-hidden">
              <div
                className="h-full bg-primary rounded-[3px] transition-[width] duration-[600ms] ease-[ease]"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="w-[280px] h-[220px] shrink-0 rounded-md overflow-hidden max-lg:w-full max-lg:max-w-[400px] max-lg:h-[200px]">
          {isAuthenticated ? (
            <div className="relative w-full h-full">
              {data.wedding.dressPhotoUrl ? (
                <img src={data.wedding.dressPhotoUrl} alt="Vestido de noiva" className="w-full h-full object-cover rounded-md" />
              ) : (
                <ImagePlaceholder
                  description="Foto do vestido de noiva"
                  variant="plain"
                  className="w-full h-full"
                />
              )}
              <label className="absolute bottom-sm left-1/2 -translate-x-1/2 inline-flex items-center gap-xs px-[14px] py-[6px] bg-primary text-white rounded-sm text-[0.75rem] font-medium cursor-pointer transition-colors duration-200 ease-[ease] hover:bg-primary-hover">
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
            <img src={data.wedding.dressPhotoUrl} alt="Vestido de noiva" className="w-full h-full object-cover rounded-md" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-surface-alt border-2 border-dashed border-border rounded-md text-text-muted gap-sm p-lg text-center">
              <Lock size={32} className="opacity-50" />
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

      <div className="grid grid-cols-[1fr_340px] gap-xl mt-xl max-lg:grid-cols-1">
        <div>
          <h2 className="font-serif text-[1.5rem] font-semibold text-text-primary mb-lg">Nosso caminho até o "sim"</h2>
          <div className="flex flex-col gap-sm">
            {data.phases.slice(0, 4).map((phase) => (
              <div key={phase.id} className={!isAuthenticated ? 'pointer-events-none select-none' : ''}>
                {isAuthenticated ? (
                  <PhaseCard
                    phase={phase}
                    onClick={() => navigate('/planejamento')}
                  />
                ) : (
                  <div className="flex flex-col bg-surface border border-border-light rounded-md p-md text-left w-full opacity-60 cursor-not-allowed">
                    <div className="flex items-center gap-sm mb-md">
                      <div className="w-9 h-9 rounded-sm flex items-center justify-center shrink-0 bg-surface-alt border-[1.5px] border-border text-text-muted">
                        <Lock size={16} />
                      </div>
                      <h3 className="font-serif text-[1.1rem] font-semibold text-text-primary">
                        {phase.number}. {phase.name}
                      </h3>
                    </div>
                    <div className="flex flex-col gap-xs">
                      <div className="flex items-center gap-xs text-[0.75rem] text-text-muted italic">
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
            <button className="block w-full p-md text-center text-[0.85rem] text-text-secondary bg-surface-alt border border-border-light rounded-md mt-md transition-all duration-200 ease-[ease] hover:bg-surface hover:border-border" onClick={() => navigate('/planejamento')}>
              Ver todas as 10 fases
            </button>
          ) : (
            <div className="flex items-center justify-center gap-sm p-md bg-surface-alt border border-dashed border-border rounded-md text-text-muted text-[0.85rem] cursor-not-allowed">
              <Lock size={14} />
              <span>Faça login para ver todas as fases</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-lg">
          <h2 className="font-serif text-[1.5rem] font-semibold text-text-primary mb-lg">Foco Atual</h2>
          {isAuthenticated ? (
            data.phases.some(p => p.tasks.length > 0) ? (
              <NextMission phases={data.phases} weddingDate={data.wedding.date} />
            ) : (
              <div className="bg-surface border border-dashed border-border rounded-lg p-xl text-center">
                <p className="text-text-muted text-[0.9rem] mb-md">Nenhuma tarefa criada ainda.</p>
                <button className="px-lg py-sm bg-primary text-white rounded-sm text-[0.85rem] font-medium transition-colors duration-200 ease-[ease] hover:bg-primary-hover" onClick={() => navigate('/planejamento')}>
                  Começar planejamento
                </button>
              </div>
            )
          ) : (
            <div className="bg-surface border border-dashed border-border rounded-lg p-2xl text-center text-text-muted">
              <Lock size={32} className="mb-md opacity-50" />
              <p className="text-[0.9rem]">Faça login para ver o foco atual</p>
            </div>
          )}

          <div className="bg-surface-alt border border-dashed border-border rounded-md p-lg text-center">
            <div className="text-text-muted mb-sm flex justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18h6" />
                <path d="M10 22h4" />
                <path d="M12 2v1" />
                <path d="M12 7a5 5 0 0 0-5 5c0 2 1 3 2 4h6c1-1 2-2 2-4a5 5 0 0 0-5-5z" />
              </svg>
            </div>
            <p className="text-[0.85rem] text-text-secondary italic leading-[1.6]">
              "O local dita o tom de toda a festa. Visitem lugares que contem uma história parecida com a de vocês."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
