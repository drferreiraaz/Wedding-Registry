import React from 'react';
import { useOutletContext } from 'react-router-dom';
import PageHeader from '../../components/PageHeader/PageHeader';
import ImagePlaceholder from '../../components/ImagePlaceholder/ImagePlaceholder';
import { calculateOverallProgress, calculateDaysUntil } from '../../utils/calculations';
import './style.css';

function Casamento() {
  const { data } = useOutletContext();
  const overallProgress = calculateOverallProgress(data.phases);
  const daysUntil = calculateDaysUntil(data.wedding.date);

  return (
    <div className="wedding" id="wedding">
      <PageHeader title="Nosso Casamento" subtitle="Tudo sobre o nosso grande dia" showProgress={false} />

      <div className="wedding-hero">
        <div className="wedding-hero-content">
          <h1 className="wedding-hero-title">Nosso Casamento</h1>
          <p className="wedding-hero-text">{data.wedding.tagline}</p>

          <div className="wedding-hero-details">
            <div className="wedding-detail-card">
              <span className="wedding-detail-label">Data</span>
              <span className="wedding-detail-value">{data.wedding.dateFormatted}</span>
            </div>
            <div className="wedding-detail-card">
              <span className="wedding-detail-label">Contagem regressiva</span>
              <span className="wedding-detail-value">{daysUntil} dias</span>
            </div>
            <div className="wedding-detail-card">
              <span className="wedding-detail-label">Progresso</span>
              <span className="wedding-detail-value">{overallProgress}%</span>
            </div>
          </div>
        </div>

        <div className="wedding-hero-image">
          <ImagePlaceholder
            description="Foto do nosso casamento"
            className="wedding-hero-image-placeholder"
          />
        </div>
      </div>

      <div className="wedding-info-grid">
        <div className="wedding-info-card">
          <h3 className="wedding-info-title">Nossa História</h3>
          <p className="wedding-info-text">
            Davi e Nicolly estão construindo juntos o casamento dos sonhos. Cada detalhe é pensado com muito amor e carinho para tornar esse dia inesquecível.
          </p>
        </div>

        <div className="wedding-info-card">
          <h3 className="wedding-info-title">O Grande Dia</h3>
          <p className="wedding-info-text">
            18 de julho de 2027 será o dia em que diremos "sim" um para o outro, cercados pelas pessoas que mais amamos.
          </p>
        </div>

        <div className="wedding-info-card">
          <h3 className="wedding-info-title">Nossos Sonhos</h3>
          <p className="wedding-info-text">
            Uma cerimônia emocionante, uma festa alegre e uma vida inteira de felicidade juntos. Esse é o nosso sonho.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Casamento;