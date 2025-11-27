export function DashboardStats({ stats }) {
  if (!stats) return null;

  const cards = [
    {
      title: "Total Cámaras",
      value: stats.total_camaras || 0,
      color: "bg-gradient-to-br from-[#3d5245] to-[#2a3a30]",
      textColor: "text-white",
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: "Cámaras Activas",
      value: stats.camaras_operativas || 0,
      subtitle: `${stats.porcentaje_operativas?.toFixed(1) || 0}% del total`,
      color: "bg-[#38e07b]/10",
      textColor: "text-[#38e07b]",
      border: "border-[#38e07b]/30",
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Cámaras Inactivas",
      value: stats.camaras_inactivas || 0,
      subtitle: `${stats.porcentaje_inactivas?.toFixed(1) || 0}% del total`,
      color: "bg-red-500/10",
      textColor: "text-red-400",
      border: "border-red-400/30",
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "En Mantenimiento",
      value: stats.camaras_mantenimiento || 0,
      subtitle: `${stats.porcentaje_mantenimiento?.toFixed(1) || 0}% del total`,
      color: "bg-yellow-500/10",
      textColor: "text-yellow-400",
      border: "border-yellow-400/30",
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`group relative overflow-hidden rounded-xl ${card.color} ${card.border || 'border border-[#3d5245]'} p-6 shadow-lg transition-all hover:scale-105 hover:shadow-xl`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-[#9eb7a8]">{card.title}</p>
              <p className={`mt-2 text-3xl font-bold ${card.textColor}`}>
                {card.value.toLocaleString()}
              </p>
              {card.subtitle && (
                <p className="mt-2 text-xs text-[#9eb7a8]">{card.subtitle}</p>
              )}
            </div>
            <div className={`${card.textColor} opacity-20 transition-opacity group-hover:opacity-30`}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}