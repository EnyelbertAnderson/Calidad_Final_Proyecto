export function EventosRecientes({ eventos }) {
  if (!eventos || eventos.length === 0) {
    return (
      <div className="rounded-xl border border-[#3d5245] bg-[#1c2620]/50 p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-semibold text-white">Eventos Recientes</h3>
        <div className="flex flex-col items-center justify-center py-12">
          <svg className="h-16 w-16 text-[#3d5245]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="mt-4 text-[#9eb7a8]">No hay eventos registrados</p>
        </div>
      </div>
    );
  }

  const getSeveridadColor = (severidad) => {
    const colors = {
      critica: "text-red-400 bg-red-500/20 border-red-400/50",
      alta: "text-orange-400 bg-orange-500/20 border-orange-400/50",
      media: "text-yellow-400 bg-yellow-500/20 border-yellow-400/50",
      baja: "text-blue-400 bg-blue-500/20 border-blue-400/50",
    };
    return colors[severidad] || colors.baja;
  };

  const getEstadoColor = (estado) => {
    const colors = {
      pendiente: "text-yellow-400 bg-yellow-500/10",
      en_atencion: "text-blue-400 bg-blue-500/10",
      resuelto: "text-[#38e07b] bg-[#38e07b]/10",
      cerrado: "text-[#9eb7a8] bg-[#9eb7a8]/10",
    };
    return colors[estado] || colors.pendiente;
  };

  return (
    <div className="rounded-xl border border-[#3d5245] bg-[#1c2620]/50 p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Eventos Recientes</h3>
        <button className="text-sm font-medium text-[#38e07b] hover:text-[#85f8b3]">
          Ver todos →
        </button>
      </div>
      <div className="space-y-3">
        {eventos.map((evento) => (
          <div
            key={evento.id}
            className="group rounded-lg border border-[#3d5245] bg-[#111714]/50 p-4 transition-all hover:border-[#38e07b]/30 hover:bg-[#1c2620]/80"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h4 className="font-medium text-white group-hover:text-[#38e07b]">
                  {evento.titulo}
                </h4>
                <p className="mt-1 text-sm text-[#9eb7a8]">
                  📍 {evento.camara_info?.direccion || "Sin dirección"}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span
                    className={`rounded-lg border px-3 py-1 text-xs font-medium ${getSeveridadColor(evento.severidad)}`}
                  >
                    {evento.severidad_display}
                  </span>
                  <span className={`rounded-lg px-3 py-1 text-xs font-medium ${getEstadoColor(evento.estado)}`}>
                    {evento.estado_display}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-xs text-[#9eb7a8]">
                  {new Date(evento.fecha_registro).toLocaleDateString('es-PE', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
                <button className="rounded-lg border border-[#3d5245] p-2 text-[#9eb7a8] hover:border-[#38e07b] hover:text-[#38e07b]">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}