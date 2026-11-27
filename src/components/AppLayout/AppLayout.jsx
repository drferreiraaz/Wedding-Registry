import React, { useState, useEffect, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import MobileNav from '../MobileNav/MobileNav';
import { clearData } from '../../utils/storage';
import initialData from '../../data/initialData';
import { getWeddingData, saveWeddingData } from '../../services/firestore';

function AppLayout() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ==========================================
  // 1. CARREGAR DADOS DO FIRESTORE AO INICIAR
  // ==========================================
  useEffect(() => {
    async function loadData() {
      try {
        const storedData = await getWeddingData();

        if (storedData) {
          // Mescla dados do banco com a estrutura inicial
          // (garante que campos novos não quebrem o app)
          setData({
            ...initialData,
            ...storedData,
            wedding: { ...initialData.wedding, ...storedData.wedding },
            finances: { ...initialData.finances, ...storedData.finances },
            home: { ...initialData.home, ...storedData.home },
            honeymoon: { ...initialData.honeymoon, ...storedData.honeymoon },
            postWedding: { ...initialData.postWedding, ...storedData.postWedding },
            couple: { ...initialData.couple, ...storedData.couple },
            phases: storedData.phases || initialData.phases,
            guests: storedData.guests || initialData.guests,
            suppliers: storedData.suppliers || initialData.suppliers,
            timeline: storedData.timeline || initialData.timeline,
            ourStory: storedData.ourStory || initialData.ourStory,
            godparents: storedData.godparents || initialData.godparents,
            participants: storedData.participants || initialData.participants,
          });
        } else {
          // Primeiro acesso: usa dados iniciais e já salva no Firestore
          const freshData = JSON.parse(JSON.stringify(initialData));
          setData(freshData);
          await saveWeddingData(freshData);
        }
      } catch (error) {
        console.error('Erro ao inicializar dados do Firestore:', error);
        // Fallback: se der erro no Firestore, usa dados iniciais
        setData(JSON.parse(JSON.stringify(initialData)));
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // ==========================================
  // 2. ATUALIZAR ESTADO LOCAL
  // ==========================================
  const updateData = useCallback((updater) => {
    setData((prev) => {
      if (!prev) return prev;
      const next =
        typeof updater === 'function'
          ? updater(prev)
          : { ...prev, ...updater };
      return next;
    });
  }, []);

  // ==========================================
  // 3. SALVAR NO FIRESTORE (com debounce)
  // ==========================================
  useEffect(() => {
    if (!data || isLoading) return;

    // Debounce: espera 1.5s após última alteração antes de salvar
    // Evita sobrecarregar o Firestore a cada tecla digitada
    const timeoutId = setTimeout(async () => {
      try {
        await saveWeddingData(data);
      } catch (error) {
        console.error('Erro ao salvar no Firestore:', error);
      }
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [data, isLoading]);

  // ==========================================
  // 4. RESETAR DADOS
  // ==========================================
  const handleReset = async () => {
    if (
      window.confirm(
        'Tem certeza que deseja resetar todos os dados? Esta ação não pode ser desfeita.'
      )
    ) {
      try {
        clearData(); // Limpa localStorage por precaução
        const freshData = JSON.parse(JSON.stringify(initialData));
        setData(freshData);
        await saveWeddingData(freshData); // Sobrescreve o Firestore
      } catch (error) {
        console.error('Erro ao resetar dados:', error);
        alert('Erro ao resetar. Tente novamente.');
      }
    }
  };

  // ==========================================
  // 5. TELA DE CARREGAMENTO
  // ==========================================
  if (isLoading || !data) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-lighter border-t-primary"></div>
          <p className="font-sans text-sm text-text-secondary">
            Carregando o planejamento...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // 6. RENDERIZAÇÃO PRINCIPAL
  // ==========================================
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar
        couple={data.couple}
        updateData={updateData}
        onReset={handleReset}
      />
      <MobileNav
        couple={data.couple}
        onReset={handleReset}
        updateData={updateData}
      />
      <main className="flex-1 ml-[260px] min-h-screen bg-background transition-[margin-left] duration-300 ease-[ease] max-nav:ml-0 max-nav:pt-[60px]">
        <Outlet context={{ data, updateData }} />
      </main>
    </div>
  );
}

export default AppLayout;