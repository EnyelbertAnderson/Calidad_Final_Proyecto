import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from './Components/Login';
import { Dashboard } from './Components/Dashboard';

const Camaras = () => <div className="text-white">Módulo de Cámaras (próximamente)</div>;
const Eventos = () => <div className="text-white">Módulo de Eventos (próximamente)</div>;
const Zonas = () => <div className="text-white">Módulo de Zonas (próximamente)</div>;
const Reportes = () => <div className="text-white">Módulo de Reportes (próximamente)</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/camaras" element={<Camaras />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/zonas" element={<Zonas />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App