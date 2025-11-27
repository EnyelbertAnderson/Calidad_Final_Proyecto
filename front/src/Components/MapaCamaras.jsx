import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';

// Fix para los iconos de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Iconos personalizados por estado
const getIconoEstado = (estado) => {
  const colores = {
    operativa: '#38e07b',
    inactiva: '#ef4444',
    mantenimiento: '#fbbf24',
  };

  const color = colores[estado] || colores.operativa;

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="position: relative;">
        <svg width="32" height="42" viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.163 0 0 7.163 0 16c0 8.837 16 26 16 26s16-17.163 16-26C32 7.163 24.837 0 16 0z" fill="${color}"/>
          <circle cx="16" cy="16" r="6" fill="#111714"/>
        </svg>
      </div>
    `,
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42],
  });
};

// Componente para ajustar el mapa a los marcadores
function FitBounds({ camaras }) {
  const map = useMap();

  useEffect(() => {
    if (camaras.length > 0) {
      const bounds = camaras
        .filter(c => c.ubicacion?.coordinates)
        .map(c => [c.ubicacion.coordinates[1], c.ubicacion.coordinates[0]]);
      
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [camaras, map]);

  return null;
}

export function MapaCamaras() {
  const [camaras, setCamaras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('todas');

  useEffect(() => {
    fetchCamaras();
  }, [filtroEstado]);

  const fetchCamaras = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: filtroEstado !== 'todas' ? { estado: filtroEstado } : {},
      };

      const response = await axios.get(
        'http://localhost:8000/api/vigilancia/camaras/',
        config
      );

      // Filtrar solo cámaras con coordenadas válidas
      const camarasConUbicacion = response.data.results?.filter(
        c => c.ubicacion?.coordinates && 
             c.ubicacion.coordinates[0] !== 0 && 
             c.ubicacion.coordinates[1] !== 0
      ) || [];

      setCamaras(camarasConUbicacion);
    } catch (error) {
      console.error('Error al cargar cámaras:', error);
    } finally {
      setLoading(false);
    }
  };

  // Centro por defecto: La Perla, Callao
  const centroDefecto = [-12.0675, -77.1248];

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-lg bg-[#111714]">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#3d5245] border-t-[#38e07b]"></div>
          <p className="mt-4 text-sm text-[#9eb7a8]">Cargando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[400px] w-full">
      {/* Controles superiores */}
      <div className="absolute left-4 top-4 z-[1000] flex gap-2">
        {['todas', 'operativa', 'inactiva', 'mantenimiento'].map((estado) => (
          <button
            key={estado}
            onClick={() => setFiltroEstado(estado)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium shadow-lg transition-all ${
              filtroEstado === estado
                ? 'bg-[#38e07b] text-[#111714]'
                : 'border border-[#3d5245] bg-[#1c2620] text-[#9eb7a8] hover:bg-[#3d5245]'
            }`}
          >
            {estado === 'todas' ? 'Todas' : estado.charAt(0).toUpperCase() + estado.slice(1)}
          </button>
        ))}
      </div>

      {/* Contador de cámaras */}
      <div className="absolute right-4 top-4 z-[1000] rounded-lg border border-[#3d5245] bg-[#1c2620]/95 px-3 py-2 shadow-lg backdrop-blur-sm">
        <p className="text-xs text-[#9eb7a8]">
          <span className="font-semibold text-[#38e07b]">{camaras.length}</span> cámaras
        </p>
      </div>

      {/* Mapa */}
      <MapContainer
        center={centroDefecto}
        zoom={14}
        className="h-full w-full rounded-lg"
        style={{ background: '#111714' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
        />

        {camaras.map((camara) => {
          const [lng, lat] = camara.ubicacion.coordinates;
          return (
            <Marker
              key={camara.id}
              position={[lat, lng]}
              icon={getIconoEstado(camara.estado)}
            >
              <Popup className="custom-popup">
                <div className="min-w-[200px] p-2">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-[#111714]">Cámara #{camara.id}</h3>
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-medium ${
                        camara.estado === 'operativa'
                          ? 'bg-green-100 text-green-800'
                          : camara.estado === 'inactiva'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {camara.estado}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-700">
                    <p className="flex items-start gap-1">
                      <svg className="mt-0.5 h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="flex-1">{camara.direccion}</span>
                    </p>
                    
                    <p className="flex items-center gap-1">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>{camara.tipo}</span>
                    </p>

                    <p className="flex items-center gap-1">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span>{camara.marca}</span>
                    </p>

                    {camara.zona && (
                      <p className="flex items-center gap-1">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        <span>Zona: {camara.zona.nombre}</span>
                      </p>
                    )}
                  </div>

                  <button className="mt-3 w-full rounded-lg bg-[#38e07b] px-3 py-1.5 text-xs font-medium text-[#111714] hover:bg-[#85f8b3]">
                    Ver detalles
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}

        <FitBounds camaras={camaras} />
      </MapContainer>
    </div>
  );
}