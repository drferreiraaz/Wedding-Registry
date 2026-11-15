import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppLayout from './components/AppLayout/AppLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import Casamento from './pages/Casamento/Casamento';
import NossaHistoria from './pages/NossaHistoria/NossaHistoria';
import Planejamento from './pages/Planejamento/Planejamento';
import Financeiro from './pages/Financeiro/Financeiro';
import Convidados from './pages/Convidados/Convidados';
import Padrinhos from './pages/Padrinhos/Padrinhos';
import Participantes from './pages/Participantes/Participantes';
import Fornecedores from './pages/Fornecedores/Fornecedores';
import Cronograma from './pages/Cronograma/Cronograma';
import Casa from './pages/Casa/Casa';
import LuaDeMel from './pages/LuaDeMel/LuaDeMel';
import PosCasamento from './pages/PosCasamento/PosCasamento';
import Configuracoes from './pages/Configuracoes/Configuracoes';
import Login from './pages/Login/Login';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/casamento" element={<Casamento />} />
            <Route path="/nossa-historia" element={<NossaHistoria />} />
            <Route path="/planejamento" element={<Planejamento />} />
            <Route path="/financeiro" element={<Financeiro />} />
            <Route path="/convidados" element={<Convidados />} />
            <Route path="/padrinhos" element={<Padrinhos />} />
            <Route path="/participantes" element={<Participantes />} />
            <Route path="/fornecedores" element={<Fornecedores />} />
            <Route path="/cronograma" element={<Cronograma />} />
            <Route path="/casa" element={<Casa />} />
            <Route path="/lua-de-mel" element={<LuaDeMel />} />
            <Route path="/pos-casamento" element={<PosCasamento />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;