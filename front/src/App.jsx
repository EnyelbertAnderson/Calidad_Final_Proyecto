import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from './Components/Login';
import { Dashboard } from './Components/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App