import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dashboardService, zonasService, camarasService } from "../services/api";
import { DashboardStats } from "./DashboardStats";
import { EventosRecientes } from "./EventosRecientes";

export function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [selectedZona, setSelectedZona] = useState("todas");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verificar si hay token
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

      // Obtener datos en paralelo
      const [statsRes, eventosRes, zonasRes] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getEventosRecientes(5),
        zonasService.getAll(),
      ]);

      setStats(statsRes.data);
      setEventos(eventosRes.data);
      setZonas(zonasRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      if (err.response?.status === 401) {
        // Token inválido o expirado
        localStorage.removeItem("token");
        navigate("/");
      } else {
        setError("Error al cargar los datos del dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#111714]">
        <div className="text-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#3d5245] border-t-[#38e07b]"></div>
          <p className="mt-4 text-[#9eb7a8]">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#111714]">
        <div className="rounded-lg border border-red-500 bg-red-500/20 p-6 text-center">
          <p className="text-red-400">{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 rounded bg-[#38e07b] px-4 py-2 text-[#111714] hover:bg-[#85f8b3]"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111714] p-4 text-white md:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold text-white">Panel de Control</h1>
        <button
          onClick={handleLogout}
          className="rounded-lg border border-[#3d5245] bg-[#1c2620] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#3d5245]"
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar cámaras..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-12 w-full rounded-lg border border-[#3d5245] bg-[#1c2620] px-4 text-white placeholder:text-[#9eb7a8] focus:border-[#38e07b] focus:outline-none focus:ring-1 focus:ring-[#38e07b]"
          />
        </div>
        <select
          value={selectedZona}
          onChange={(e) => setSelectedZona(e.target.value)}
          className="h-12 rounded-lg border border-[#3d5245] bg-[#1c2620] px-4 text-white focus:border-[#38e07b] focus:outline-none focus:ring-1 focus:ring-[#38e07b]"
        >
          <option value="todas">Todas las Zonas</option>
          {zonas.map((zona) => (
            <option key={zona.id} value={zona.id}>
              {zona.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Estadísticas */}
      <DashboardStats stats={stats} />

      {/* Grid de contenido */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Mapa (Placeholder) */}
        <div className="lg:col-span-2">
          <div className="h-[400px] rounded-lg border border-[#3d5245] bg-[#1c2620]/50 p-6">
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <svg
                  className="mx-auto h-16 w-16 text-[#3d5245]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
                <p className="mt-4 text-[#9eb7a8]">Mapa interactivo</p>
                <p className="text-sm text-[#9eb7a8]">
                  (Próximamente con integración de Leaflet)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Panel lateral */}
        <div className="space-y-6">
          {/* Resumen General */}
          <div className="rounded-lg border border-[#3d5245] bg-[#1c2620]/50 p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">Resumen General</h3>
            
            {/* Distribución por Zona */}
            <div className="mb-4">
              <h4 className="mb-2 text-sm font-medium text-[#9eb7a8]">
                Distribución por Zona
              </h4>
              {stats?.distribucion_por_zona?.map((item, index) => (
                <div key={index} className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-white">{item.zona__nombre}</span>
                  <span className="text-sm font-medium text-[#38e07b]">
                    {item.total}
                  </span>
                </div>
              ))}
            </div>

            {/* Distribución por Tecnología */}
            <div className="mb-4">
              <h4 className="mb-2 text-sm font-medium text-[#9eb7a8]">
                Por Tecnología
              </h4>
              {stats?.distribucion_por_tecnologia?.map((item, index) => (
                <div key={index} className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-white">{item.tecnologia}</span>
                  <span className="text-sm font-medium text-[#38e07b]">
                    {item.total}
                  </span>
                </div>
              ))}
            </div>

            {/* Estado del Sistema */}
            <div className="mt-4 rounded-lg border border-[#38e07b]/30 bg-[#38e07b]/10 p-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#38e07b]"></div>
                <span className="text-sm font-medium text-[#38e07b]">
                  Todos los sistemas operativos
                </span>
              </div>
            </div>
          </div>

          {/* Eventos Críticos */}
          {stats?.eventos_criticos > 0 && (
            <div className="rounded-lg border border-red-400 bg-red-500/20 p-4">
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-red-400">
                    {stats.eventos_criticos} Eventos Críticos
                  </p>
                  <p className="text-xs text-red-300">Requieren atención inmediata</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Eventos Recientes */}
      <div className="mt-6">
        <EventosRecientes eventos={eventos} />
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-sm text-[#9eb7a8]">
        <p>© 2024 Municipalidad Distrital de La Perla. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}