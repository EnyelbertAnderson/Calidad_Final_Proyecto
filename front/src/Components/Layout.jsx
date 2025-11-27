import { useState } from "react";
import { Sidebar } from "./Sidebar";

export function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-[#111714]">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Contenido principal */}
      <div className="flex flex-1 flex-col lg:ml-64">
        {/* Header superior */}
        <header className="sticky top-0 z-10 border-b border-[#3d5245] bg-[#1c2620]/95 backdrop-blur-sm">
          <div className="flex items-center justify-between px-4 py-4 md:px-6">
            <button
              onClick={toggleSidebar}
              className="text-[#9eb7a8] hover:text-white lg:hidden"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Buscar..."
                  className="h-10 w-64 rounded-lg border border-[#3d5245] bg-[#111714] px-4 pl-10 text-sm text-white placeholder:text-[#9eb7a8] focus:border-[#38e07b] focus:outline-none focus:ring-1 focus:ring-[#38e07b]"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-[#9eb7a8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <button className="relative rounded-lg border border-[#3d5245] bg-[#111714] p-2 text-[#9eb7a8] hover:text-white">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  3
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Contenido */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}