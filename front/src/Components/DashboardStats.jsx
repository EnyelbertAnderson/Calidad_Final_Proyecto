export function DashboardStats({ stats }) {
  if (!stats) return null;

  const cards = [
    {
      title: "Total Cámaras",
      value: stats.total_camaras || 0,
      color: "bg-[#3d5245]",
      textColor: "text-white",
    },
    {
      title: "Cámaras Activas",
      value: stats.camaras_operativas || 0,
      subtitle: `${stats.porcentaje_operativas?.toFixed(1) || 0}% del total`,
      color: "bg-[#38e07b]/20",
      textColor: "text-[#38e07b]",
      border: "border-[#38e07b]",
    },
    {
      title: "Cámaras Inactivas",
      value: stats.camaras_inactivas || 0,
      subtitle: `${stats.porcentaje_inactivas?.toFixed(1) || 0}% del total`,
      color: "bg-red-500/20",
      textColor: "text-red-400",
      border: "border-red-400",
    },
    {
      title: "En Mantenimiento",
      value: stats.camaras_mantenimiento || 0,
      subtitle: `${stats.porcentaje_mantenimiento?.toFixed(1) || 0}% del total`,
      color: "bg-yellow-500/20",
      textColor: "text-yellow-400",
      border: "border-yellow-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`rounded-lg ${card.color} ${card.border || 'border border-[#3d5245]'} p-6 backdrop-blur-sm`}
        >
          <h3 className="text-sm font-medium text-[#9eb7a8]">{card.title}</h3>
          <p className={`mt-2 text-4xl font-bold ${card.textColor}`}>
            {card.value.toLocaleString()}
          </p>
          {card.subtitle && (
            <p className="mt-1 text-sm text-[#9eb7a8]">{card.subtitle}</p>
          )}
        </div>
      ))}
    </div>
  );
}