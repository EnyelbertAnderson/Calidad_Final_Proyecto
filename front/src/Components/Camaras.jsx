import { Layout } from "./Layout";
import { MapaCamaras } from "./MapaCamaras";

export function Camaras() {
  return (
    <Layout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Cámaras</h1>
            <p className="mt-1 text-sm text-[#9eb7a8]">Visualice y gestione el mapa completo de cámaras</p>
          </div>
        </div>

        <div className="rounded-xl border border-[#3d5245] bg-[#1c2620]/50 p-4 shadow-lg">
          <MapaCamaras heightClass={'h-[calc(100vh-180px)]'} />
        </div>
      </div>
    </Layout>
  );
}
