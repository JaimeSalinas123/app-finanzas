'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from './lib/api';

import DashboardView from './components/DashboardView';
import TransaccionesView from './components/TransaccionesView';
import MetasView from './components/MetasView';
import AhorrosView from './components/AhorrosView';
import JornadaView from './components/JornadaView';

type Tab = 'dashboard' | 'ganancias' | 'gastos' | 'metas' | 'ahorros' | 'jornada';

const Svg = ({ children }: { children: ReactNode }) => (
  <svg
    viewBox="0 0 24 24"
    width="22"
    height="22"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const NAV: { id: Tab; label: string; short: string; icon: ReactNode }[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    short: 'Inicio',
    icon: (
      <Svg>
        <rect x="3" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" />
      </Svg>
    ),
  },
  {
    id: 'ganancias',
    label: 'Mis Ganancias',
    short: 'Ingresos',
    icon: (
      <Svg>
        <path d="M12 19V5M6 11l6-6 6 6" />
      </Svg>
    ),
  },
  {
    id: 'gastos',
    label: 'Mis Gastos',
    short: 'Gastos',
    icon: (
      <Svg>
        <path d="M12 5v14M6 13l6 6 6-6" />
      </Svg>
    ),
  },
  {
    id: 'metas',
    label: 'Metas',
    short: 'Metas',
    icon: (
      <Svg>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4" />
      </Svg>
    ),
  },
  {
    id: 'ahorros',
    label: 'Ahorros',
    short: 'Ahorros',
    icon: (
      <Svg>
        <rect x="3" y="8" width="18" height="12" rx="4" />
        <path d="M12 8V4M9 12h6" />
      </Svg>
    ),
  },
  {
    id: 'jornada',
    label: 'Horas Extra',
    short: 'Horas',
    icon: (
      <Svg>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </Svg>
    ),
  },
];

export default function FinanzasApp() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [dash, setDash] = useState({
    dineroEnBanco: 0,
    totalIngresos: 0,
    totalGastos: 0,
    gastosUltimos7Dias: 0,
    ingresosUltimos7Dias: 0,
    totalMetas: 0,
    cantidadMetas: 0,
    totalAhorros: 0,
    horasExtraMes: 0,
    ultimosMovimientos: [] as any[],
  });

  const cargarResumen = async () => {
    setError('');
    try {
      const resDash = await apiFetch('/dashboard');
      setDash(resDash.data);
    } catch (err: any) {
      setError(err.message || 'Error cargando el resumen financiero');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarResumen();
  }, [activeTab]);

  const cerrarSesion = async () => {
    await apiFetch('/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#f8e3da] text-[#4a3a36]">
      {/* ───────── Cabecera ───────── */}
      <header className="relative overflow-hidden rounded-b-[32px] bg-gradient-to-br from-[#f4b79f] to-[#ee8e6e] px-4 pb-5 pt-4 text-white shadow-[0_14px_30px_rgba(238,142,110,0.35)] md:rounded-b-[36px] md:px-8 md:pb-4">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 800 200"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0 120C140 70 260 170 420 120C560 78 680 60 800 100V200H0Z" fill="#fff" opacity=".13" />
        </svg>

        <div className="relative mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 md:gap-x-6">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/25" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M14.5 9.2c-.5-.8-1.4-1.2-2.5-1.2-1.4 0-2.5.7-2.5 1.8 0 2.6 5 1.4 5 4 0 1.1-1.1 1.9-2.5 1.9-1.1 0-2.1-.5-2.6-1.3M12 6v2M12 16v2" />
              </svg>
            </span>
            <h1 className="text-lg font-bold leading-tight tracking-tight md:text-xl">Sistema Financiero</h1>
          </div>

          {/* Navegación (solo PC / tablet) */}
          <nav className="order-3 hidden w-full flex-wrap gap-1.5 md:order-none md:flex md:w-auto" aria-label="Secciones">
            {NAV.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  aria-current={active ? 'page' : undefined}
                  className={`rounded-full px-4 py-2 text-[0.9rem] font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none ${
                    active ? 'bg-white text-[#d9694a] shadow-md' : 'text-white/90 hover:bg-white/20'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <span className="rounded-full bg-white/25 px-3 py-1.5 text-[0.8rem] font-bold backdrop-blur-sm md:px-4 md:text-[0.9rem]">
              Disponible: ${dash.dineroEnBanco.toFixed(2)}
            </span>
            <button
              onClick={cerrarSesion}
              className="rounded-full bg-[#fffdf8] px-4 py-1.5 text-[0.85rem] font-bold text-[#d9694a] shadow-md transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none md:py-2 md:text-[0.9rem]"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* ───────── Contenido ───────── */}
      <main className="mx-auto max-w-[1200px] px-4 pb-28 pt-6 md:px-6 md:pb-10 md:pt-8">
        {error && (
          <div
            role="alert"
            className="mb-6 rounded-2xl border border-[#f4b9a8] bg-[#fde4dc] p-4 text-[0.95rem] font-semibold text-[#a43c24]"
          >
            {error}
          </div>
        )}

        {loading ? (
          <p className="py-10 text-center font-medium text-[#8d7a73]">
            Cargando datos desde TiDB Cloud...
          </p>
        ) : (
          <>
            {activeTab === 'dashboard' && <DashboardView dash={dash} />}
            {activeTab === 'ganancias' && <TransaccionesView tipo="ingreso" onUpdate={cargarResumen} />}
            {activeTab === 'gastos' && <TransaccionesView tipo="gasto" onUpdate={cargarResumen} />}
            {activeTab === 'metas' && <MetasView onUpdate={cargarResumen} />}
            {activeTab === 'ahorros' && <AhorrosView onUpdate={cargarResumen} />}
            {activeTab === 'jornada' && <JornadaView onUpdate={cargarResumen} />}
          </>
        )}
      </main>

      {/* ───────── Barra inferior (solo móvil) ───────── */}
      <nav
        className="fixed inset-x-0 bottom-0 z-20 rounded-t-[28px] bg-[#f7f1e3] px-2 pt-2 shadow-[0_-10px_30px_rgba(190,110,80,0.22)] pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden"
        aria-label="Secciones"
      >
        <ul className="mx-auto flex max-w-md items-stretch justify-between">
          {NAV.map((item) => {
            const active = activeTab === item.id;
            return (
              <li key={item.id} className="flex-1">
                <button
                  onClick={() => setActiveTab(item.id)}
                  aria-current={active ? 'page' : undefined}
                  className={`mx-auto flex w-full flex-col items-center gap-0.5 rounded-2xl px-1 py-2 text-[0.68rem] font-bold transition focus-visible:outline-2 focus-visible:outline-[#ee8e6e] motion-reduce:transition-none ${
                    active ? 'bg-[#f8e3da] text-[#d9694a]' : 'text-[#a8978f]'
                  }`}
                >
                  {item.icon}
                  <span>{item.short}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}