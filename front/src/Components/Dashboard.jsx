import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Layout } from "./Layout";
import { DashboardStats } from "./DashboardStats";
import { EventosRecientes } from "./EventosRecientes";
import { MapaCamaras } from "./MapaCamaras";

const API_URL = 'http://localhost:8000/api';

export function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const [statsRes, eventosRes, zonasRes] = await Promise.all([
        axios.get(`${API_URL}/vigilancia/dashboard/stats/`, config),
        axios.get(`${API_URL}/vigilancia/dashboard/eventos-recientes/?limit=5`, config),
        axios.get(`${API_URL}/vigilancia/zonas/`, config),
      ]);

      setStats(statsRes.data);
      setEventos(eventosRes.data);
      setZonas(zonasRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
      } else {
        setError("Error al cargar los datos del dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-[#3d5245] border-t-[#38e07b]"></div>
            <p className="mt-4 text-[#9eb7a8]">Cargando dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex h-full items-center justify-center">
          <div className="rounded-lg border border-red-500 bg-red-500/20 p-6 text-center">
            <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-4 text-red-400">{error}</p>
            <button
              onClick={fetchData}
              className="mt-4 rounded-lg bg-[#38e07b] px-6 py-2 font-medium text-[#111714] hover:bg-[#85f8b3]"
            >
              Reintentar
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Título y acciones rápidas */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">
              Panel de Control
            </h1>
            <p className="mt-1 text-sm text-[#9eb7a8]">
              Vista general del sistema de vigilancia
            </p>
          </div>
          
          <div className="flex gap-2">
            <button className="flex items-center gap-2 rounded-lg border border-[#3d5245] bg-[#1c2620] px-4 py-2 text-sm font-medium text-white hover:bg-[#3d5245]">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Exportar
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-[#38e07b] px-4 py-2 text-sm font-medium text-[#111714] hover:bg-[#85f8b3]">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nuevo Evento
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        <DashboardStats stats={stats} />

        {/* Grid principal */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Mapa - 2 columnas */}
          <div className="lg:col-span-2">
  <div className="rounded-xl border border-[#3d5245] bg-[#1c2620]/50 p-6 shadow-lg">
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-lg font-semibold text-white">
        Mapa de Cámaras
      </h3>
      <button
        onClick={() => navigate('/camaras')}
        className="flex items-center gap-2 rounded-lg border border-[#3d5245] bg-[#111714] px-3 py-1.5 text-xs text-[#9eb7a8] hover:text-white"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
        Pantalla completa
      </button>
    </div>
    
    {/* Reemplazar el placeholder con el mapa real */}
    <MapaCamaras />

    {/* fullscreen action now redirects to /camaras (see sidebar) */}
  </div>
</div>

          {/* Panel lateral - 1 columna */}
          <div className="space-y-6">
            {/* Resumen por Zona */}
            <div className="rounded-xl border border-[#3d5245] bg-[#1c2620]/50 p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-semibold text-white">
                Por Zona
              </h3>
              <div className="space-y-3">
                {stats?.distribucion_por_zona?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-[#38e07b]"></div>
                      <span className="text-sm text-white">{item.zona__nombre}</span>
                    </div>
                    <span className="text-sm font-semibold text-[#38e07b]">
                      {item.total}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Resumen por Tecnología */}
            <div className="rounded-xl border border-[#3d5245] bg-[#1c2620]/50 p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-semibold text-white">
                Por Tecnología
              </h3>
              <div className="space-y-3">
                {stats?.distribucion_por_tecnologia?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-white">{item.tecnologia}</span>
                    <span className="text-sm font-semibold text-[#38e07b]">
                      {item.total}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Estado del Sistema */}
            <div className="rounded-xl border border-[#38e07b]/30 bg-[#38e07b]/10 p-4 shadow-lg">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#38e07b]">
                  <svg className="h-3 w-3 text-[#111714]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#38e07b]">
                    Sistema Operativo
                  </p>
                  <p className="mt-1 text-xs text-[#38e07b]/80">
                    Todos los sistemas funcionando correctamente
                  </p>
                </div>
              </div>
            </div>

            {/* Alertas Críticas */}
            {stats?.eventos_criticos > 0 && (
              <div className="rounded-xl border border-red-400 bg-red-500/20 p-4 shadow-lg">
                <div className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-red-400">
                      {stats.eventos_criticos} Eventos Críticos
                    </p>
                    <p className="mt-1 text-xs text-red-300">
                      Requieren atención inmediata
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Eventos Recientes */}
        <EventosRecientes eventos={eventos} />
      </div>
    </Layout>
  );
}