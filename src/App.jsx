import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout/AppLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import Casamento from './pages/Casamento/Casamento';
import Planejamento from './pages/Planejamento/Planejamento';
import Financeiro from './pages/Financeiro/Financeiro';
import Convidados from './pages/Convidados/Convidados';
import Fornecedores from './pages/Fornecedores/Fornecedores';
import Cronograma from './pages/Cronograma/Cronograma';
import Casa from './pages/Casa/Casa';
import LuaDeMel from './pages/LuaDeMel/LuaDeMel';
import PosCasamento from './pages/PosCasamento/PosCasamento';
import './styles/variables.css';
import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/casamento" element={<Casamento />} />
          <Route path="/planejamento" element={<Planejamento />} />
          <Route path="/financeiro" element={<Financeiro />} />
          <Route path="/convidados" element={<Convidados />} />
          <Route path="/fornecedores" element={<Fornecedores />} />
          <Route path="/cronograma" element={<Cronograma />} />
          <Route path="/casa" element={<Casa />} />
          <Route path="/lua-de-mel" element={<LuaDeMel />} />
          <Route path="/pos-casamento" element={<PosCasamento />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;