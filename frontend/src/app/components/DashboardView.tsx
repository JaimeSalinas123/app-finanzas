'use client';

import type { ReactNode } from 'react';

// Íconos simples en SVG (sin dependencias)
const Icon = ({ children }: { children: ReactNode }) => (
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

const BankIcon = () => (
  <Icon>
    <path d="M3 10l9-6 9 6" />
    <path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 21h18" />
  </Icon>
);
const ArrowDownIcon = () => (
  <Icon>
    <path d="M12 5v14M6 13l6 6 6-6" />
  </Icon>
);
const ArrowUpIcon = () => (
  <Icon>
    <path d="M12 19V5M6 11l6-6 6 6" />
  </Icon>
);
const TargetIcon = () => (
  <Icon>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="4" />
  </Icon>
);
const PiggyIcon = () => (
  <Icon>
    <rect x="3" y="8" width="18" height="12" rx="4" />
    <path d="M12 8V4M9 12h6" />
  </Icon>
);

const smallCard =
  'flex flex-col justify-between rounded-3xl bg-[#fffdf8] p-5 shadow-[0_12px_28px_rgba(190,110,80,0.14)] sm:p-6';

export default function DashboardView({ dash }: { dash: any }) {
  return (
    <div className="flex flex-col gap-5 font-medium text-[#4a3a36] md:gap-6">
      {/* ───────── Tarjetas resumen ───────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Tarjeta principal: dinero disponible */}
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#f4b79f] to-[#ee8e6e] p-6 text-white shadow-[0_18px_36px_rgba(238,142,110,0.4)] sm:col-span-2 sm:p-8 lg:row-span-2 lg:flex lg:flex-col lg:justify-between">
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 400 300"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M0 190C90 140 160 240 250 200C320 168 360 130 400 150V300H0Z" fill="#fff" opacity=".14" />
          </svg>

          <div className="relative flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/25">
              <BankIcon />
            </span>
            <p className="text-[0.95rem] font-semibold text-white/90">Dinero en Banco (Disponible)</p>
          </div>

          <div className="relative mt-8 lg:mt-12">
            <h2 className="break-words text-4xl font-bold tracking-tight sm:text-5xl">
              ${dash.dineroEnBanco.toFixed(2)}
            </h2>
            <small className="mt-2 block text-[0.85rem] text-white/85">
              Descuenta gastos, metas y ahorros
            </small>
          </div>
        </div>

        {/* Gastos */}
        <div className={smallCard}>
          <span className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-[#fde4dc] text-[#d9694a]">
            <ArrowDownIcon />
          </span>
          <div>
            <p className="text-[0.85rem] text-[#8d7a73]">Gastos (Últimos 7 días)</p>
            <h2 className="mt-1 break-words text-2xl font-bold text-[#d9694a]">
              ${dash.gastosUltimos7Dias.toFixed(2)}
            </h2>
            <small className="text-[0.8rem] text-[#a8978f]">
              Total histórico: ${dash.totalGastos.toFixed(2)}
            </small>
          </div>
        </div>

        {/* Ingresos */}
        <div className={smallCard}>
          <span className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-[#e3ebf1] text-[#5f7d94]">
            <ArrowUpIcon />
          </span>
          <div>
            <p className="text-[0.85rem] text-[#8d7a73]">Mis Ganancias / Ingresos</p>
            <h2 className="mt-1 break-words text-2xl font-bold text-[#5f7d94]">
              ${dash.totalIngresos.toFixed(2)}
            </h2>
            <small className="text-[0.8rem] text-[#a8978f]">
              Últimos 7 días: ${dash.ingresosUltimos7Dias.toFixed(2)}
            </small>
          </div>
        </div>

        {/* Metas */}
        <div className={smallCard}>
          <span className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-[#fbeacb] text-[#c98a2b]">
            <TargetIcon />
          </span>
          <div>
            <p className="text-[0.85rem] text-[#8d7a73]">Apartado en Metas ({dash.cantidadMetas})</p>
            <h2 className="mt-1 break-words text-2xl font-bold text-[#c98a2b]">
              ${dash.totalMetas.toFixed(2)}
            </h2>
            <small className="text-[0.8rem] text-[#a8978f]">Separado de tu saldo principal</small>
          </div>
        </div>

        {/* Ahorros */}
        <div className={smallCard}>
          <span className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-[#dcebe3] text-[#4c8a72]">
            <PiggyIcon />
          </span>
          <div>
            <p className="text-[0.85rem] text-[#8d7a73]">Total Ahorrado</p>
            <h2 className="mt-1 break-words text-2xl font-bold text-[#4c8a72]">
              ${dash.totalAhorros.toFixed(2)}
            </h2>
            <small className="text-[0.8rem] text-[#a8978f]">Emergencia, U, Repuestos, etc.</small>
          </div>
        </div>
      </div>

      {/* ───────── Últimos movimientos ───────── */}
      <div className="rounded-[28px] bg-[#f7f1e3] p-5 shadow-[0_12px_28px_rgba(190,110,80,0.14)] sm:p-7">
        <h3 className="mb-4 text-xl font-bold">Últimos Movimientos</h3>

        {dash.ultimosMovimientos.length === 0 ? (
          <p className="text-[#8d7a73]">Aún no hay movimientos registrados.</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {dash.ultimosMovimientos.map((m: any) => {
              const esIngreso = m.tipo === 'ingreso';
              return (
                <div
                  key={m.id}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-[#fffdf8] px-3.5 py-3 sm:px-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${
                        esIngreso ? 'bg-[#dcebe3] text-[#4c8a72]' : 'bg-[#fde4dc] text-[#d9694a]'
                      }`}
                    >
                      {esIngreso ? <ArrowUpIcon /> : <ArrowDownIcon />}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate">
                        <strong className="font-bold">{m.categoria}</strong>{' '}
                        {m.descripcion && <span className="text-[#8d7a73]">— {m.descripcion}</span>}
                      </p>
                      <div className="text-[0.8rem] text-[#a8978f]">{String(m.fecha).slice(0, 10)}</div>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 font-bold ${esIngreso ? 'text-[#4c8a72]' : 'text-[#d9694a]'}`}
                  >
                    {esIngreso ? '+' : '-'}${Number(m.monto).toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}