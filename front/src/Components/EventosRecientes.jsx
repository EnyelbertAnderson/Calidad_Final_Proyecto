export function EventosRecientes({ eventos }) {
  if (!eventos || eventos.length === 0) {
    return (
      <div className="rounded-lg border border-[#3d5245] bg-[#1c2620]/50 p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">Eventos Recientes</h3>
        <p className="text-[#9eb7a8]">No hay eventos registrados</p>
      </div>
    );
  }

  const getSeveridadColor = (severidad) => {
    const colors = {
      critica: "text-red-400 bg-red-500/20 border-red-400",
      alta: "text-orange-400 bg-orange-500/20 border-orange-400",
      media: "text-yellow-400 bg-yellow-500/20 border-yellow-400",
      baja: "text-blue-400 bg-blue-500/20 border-blue-400",
    };
    return colors[severidad] || colors.baja;
  };

  const getEstadoColor = (estado) => {
    const colors = {
      pendiente: "text-yellow-400",
      en_atencion: "text-blue-400",
      resuelto: "text-[#38e07b]",
      cerrado: "text-[#9eb7a8]",
    };
    return colors[estado] || colors.pendiente;
  };

  return (
    <div className="rounded-lg border border-[#3d5245] bg-[#1c2620]/50 p-6">
      <h3 className="mb-4 text-lg font-semibold text-white">Eventos Recientes</h3>
      <div className="space-y-3">
        {eventos.map((evento) => (
          <div
            key={evento.id}
            className="rounded-lg border border-[#3d5245] bg-[#111714]/50 p-4 transition-colors hover:bg-[#1c2620]"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-white">{evento.titulo}</h4>
                <p className="mt-1 text-sm text-[#9eb7a8]">
                  {evento.camara_info?.direccion || "Sin dirección"}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span
                    className={`rounded border px-2 py-1 text-xs font-medium ${getSeveridadColor(evento.severidad)}`}
                  >
                    {evento.severidad_display}
                  </span>
                  <span className={`text-xs font-medium ${getEstadoColor(evento.estado)}`}>
                    {evento.estado_display}
                  </span>
                </div>
              </div>
              <span className="text-xs text-[#9eb7a8]">
                {new Date(evento.fecha_registro).toLocaleDateString('es-PE')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}