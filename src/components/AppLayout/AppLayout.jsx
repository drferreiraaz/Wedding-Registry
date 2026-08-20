import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import MobileNav from '../MobileNav/MobileNav';
import { loadData, saveData, clearData } from '../../utils/storage';
import initialData from '../../data/initialData';
import './style.css';

function AppLayout() {
  const [data, setData] = useState(() => {
    const stored = loadData();
    if (stored) {
      return {
        ...initialData,
        ...stored,
        wedding: { ...initialData.wedding, ...stored.wedding },
        finances: { ...initialData.finances, ...stored.finances },
        home: { ...initialData.home, ...stored.home },
        honeymoon: { ...initialData.honeymoon, ...stored.honeymoon },
        postWedding: { ...initialData.postWedding, ...stored.postWedding },
        couple: { ...initialData.couple, ...stored.couple },
        ourStory: stored.ourStory || initialData.ourStory,
        godparents: stored.godparents || initialData.godparents,
        participants: stored.participants || initialData.participants,
      };
    }
    return JSON.parse(JSON.stringify(initialData));
  });

  useEffect(() => {
    saveData(data);
  }, [data]);

  const updateData = (updater) => {
    setData((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      return next;
    });
  };

  const handleReset = () => {
    if (window.confirm('Tem certeza que deseja resetar todos os dados? Esta ação não pode ser desfeita.')) {
      clearData();
      setData(JSON.parse(JSON.stringify(initialData)));
    }
  };

  return (
    <div className="app-layout">
      <Sidebar couple={data.couple} updateData={updateData} onReset={handleReset} />
      <MobileNav couple={data.couple} onReset={handleReset} updateData={updateData} />
      <main className="app-main">
        <Outlet context={{ data, updateData }} />
      </main>
    </div>
  );
}

export default AppLayout;