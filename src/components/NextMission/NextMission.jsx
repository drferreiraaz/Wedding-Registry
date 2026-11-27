import React from 'react';
import { useNavigate } from 'react-router-dom';

function NextMission({ phases, weddingDate }) {
  const navigate = useNavigate();

  return (
    <div className="bg-surface border border-border-light rounded-lg p-lg relative overflow-hidden" id="next-mission">
      <div className="flex gap-sm mb-md">
        <span className="text-[0.7rem] px-[10px] py-[3px] rounded-[4px] font-medium bg-badge-high text-badge-high-text">Prioridade Alta</span>
        <span className="text-[0.7rem] px-[10px] py-[3px] rounded-[4px] font-medium bg-badge-pending text-badge-pending-text">Pendente</span>
      </div>

      <div className="absolute top-md right-md opacity-15">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.15">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </div>

      <h3 className="font-serif text-[1.3rem] font-semibold text-text-primary mb-sm pr-[60px]">Definir o local da cerimônia</h3>

      <div className="flex items-center gap-xs text-[0.8rem] text-text-secondary mb-lg">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span>Prazo: 30/09/2026</span>
      </div>

      <button
        className="inline-flex items-center gap-sm px-lg py-[12px] bg-primary text-white rounded-sm text-[0.875rem] font-medium transition-colors duration-200 ease-[ease] hover:bg-primary-hover"
        onClick={() => navigate('/planejamento')}
      >
        Continuar planejamento
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>
    </div>
  );
}

export default NextMission;
