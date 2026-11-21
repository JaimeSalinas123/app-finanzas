'use client';

import { useState, useEffect, FormEvent } from 'react';
import { apiFetch } from '../lib/api';

// ───────── Clases de diseño reutilizables ─────────
const card =
  'rounded-[28px] bg-[#f7f1e3] p-5 shadow-[0_12px_28px_rgba(190,110,80,0.14)] sm:p-7';
const input =
  'w-full min-w-0 rounded-2xl border-[1.5px] border-[#e6d9c6] bg-[#fffdf8] px-4 py-3 text-[0.95rem] font-medium text-[#4a3a36] outline-none transition placeholder:text-[#b9a9a1] focus:border-[#ee8e6e] focus:ring-4 focus:ring-[#ee8e6e]/25 motion-reduce:transition-none';
const btnBase =
  'rounded-full font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ee8e6e] motion-reduce:transition-none';
const btnPrimary = `${btnBase} bg-[#5f9e86] px-5 py-3 text-[0.95rem] text-white shadow-[0_8px_16px_rgba(95,158,134,0.32)] hover:bg-[#4c8a72]`;
const btnAdd = `${btnBase} bg-[#5f9e86] px-4 py-3 text-[0.9rem] text-white hover:bg-[#4c8a72]`;
const btnRemove = `${btnBase} bg-[#f3c27d] px-4 py-3 text-[0.9rem] text-[#6b4510] hover:bg-[#ecb560]`;
const btnSmallNeutral = `${btnBase} bg-[#e9dfcf] px-3.5 py-2 text-[0.8rem] text-[#6b5a53] hover:bg-[#dfd2bd]`;
const btnSmallDanger = `${btnBase} bg-[#fde4dc] px-3.5 py-2 text-[0.8rem] text-[#c4482a] hover:bg-[#f9d0c3]`;

// Colores de los apartados (tomados de tu referencia)
const ACCENTS = ['#9a9c72', '#8b9fb0', '#9c7d66', '#e6b06a', '#6fa68d', '#ee8e6e'];

export default function AhorrosView({ onUpdate }: { onUpdate: () => void }) {
  const [ahorros, setAhorros] = useState<any[]>([]);
  const [ahorroForm, setAhorroForm] = useState({ id: '', categoria: '', descripcion: '', monto: '' });
  const [abonoAhorro, setAbonoAhorro] = useState<{ [key: string]: string }>({});

  const cargarAhorros = async () => {
    const res = await apiFetch('/ahorros');
    setAhorros(res.data);
  };

  useEffect(() => {
    cargarAhorros();
  }, []);

  const guardarAhorro = async (e: FormEvent) => {
    e.preventDefault();
    if (ahorroForm.id) {
      await apiFetch(`/ahorros/${ahorroForm.id}`, { method: 'PUT', body: JSON.stringify(ahorroForm) });
    } else {
      await apiFetch('/ahorros', { method: 'POST', body: JSON.stringify(ahorroForm) });
    }
    setAhorroForm({ id: '', categoria: '', descripcion: '', monto: '' });
    await cargarAhorros();
    onUpdate();
  };

  const modificarSaldoAhorro = async (id: string, signo: 1 | -1) => {
    const valor = Number(abonoAhorro[id] || 0);
    if (valor <= 0) return;
    await apiFetch(`/ahorros/${id}/modificar-monto`, { method: 'PATCH', body: JSON.stringify({ cantidad: valor * signo }) });
    setAbonoAhorro({ ...abonoAhorro, [id]: '' });
    await cargarAhorros();
    onUpdate();
  };

  const eliminarAhorro = async (id: string) => {
    await apiFetch(`/ahorros/${id}`, { method: 'DELETE' });
    await cargarAhorros();
    onUpdate();
  };

  return (
    <div className="flex flex-col gap-5 font-medium text-[#4a3a36] md:gap-6">
      {/* ───────── Formulario ───────── */}
      <div className={card}>
        <h3 className="mb-5 text-xl font-bold">
          {ahorroForm.id ? 'Editar Ahorro' : 'Nuevo Apartado de Ahorro'}
        </h3>
        <form onSubmit={guardarAhorro} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input
            className={input}
            placeholder="Categoría (Emergencia, Universidad, Repuestos...)"
            value={ahorroForm.categoria}
            onChange={(e) => setAhorroForm({ ...ahorroForm, categoria: e.target.value })}
            required
          />
          <input
            className={input}
            placeholder="Descripción o nota"
            value={ahorroForm.descripcion}
            onChange={(e) => setAhorroForm({ ...ahorroForm, descripcion: e.target.value })}
          />
          <input
            className={input}
            type="number"
            step="0.01"
            placeholder="Monto inicial ($)"
            value={ahorroForm.monto}
            onChange={(e) => setAhorroForm({ ...ahorroForm, monto: e.target.value })}
            required
          />
          <button type="submit" className={`${btnPrimary} sm:col-span-2 lg:col-span-1`}>
            {ahorroForm.id ? 'Guardar Cambios' : 'Crear Ahorro'}
          </button>
        </form>
      </div>

      {/* ───────── Tarjetas de ahorros ───────── */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ahorros.map((ah, i) => (
          <div key={ah.id} className={`${card} flex flex-col`}>
            <div className="flex items-start gap-3">
              <span
                className="mt-0.5 h-10 w-10 shrink-0 rounded-2xl shadow-[0_6px_12px_rgba(120,60,40,0.18)]"
                style={{ backgroundColor: ACCENTS[i % ACCENTS.length] }}
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <h4 className="break-words text-lg font-bold leading-tight">{ah.categoria}</h4>
                {ah.descripcion && (
                  <small className="mt-0.5 block break-words text-[0.85rem] text-[#8d7a73]">
                    {ah.descripcion}
                  </small>
                )}
              </div>
              <span className="shrink-0 text-xl font-bold text-[#4c8a72]">
                ${Number(ah.monto).toFixed(2)}
              </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <input
                className={`${input} basis-full sm:basis-0 sm:flex-1`}
                type="number"
                step="0.01"
                placeholder="Monto ($)"
                value={abonoAhorro[ah.id] || ''}
                onChange={(e) => setAbonoAhorro({ ...abonoAhorro, [ah.id]: e.target.value })}
              />
              <button onClick={() => modificarSaldoAhorro(ah.id, 1)} className={`${btnAdd} flex-1 sm:flex-none`}>
                + Ahorrar
              </button>
              <button onClick={() => modificarSaldoAhorro(ah.id, -1)} className={`${btnRemove} flex-1 sm:flex-none`}>
                - Retirar
              </button>
            </div>

            <div className="mt-4 flex justify-end gap-2 border-t border-[#e6d9c6] pt-4">
              <button
                onClick={() =>
                  setAhorroForm({
                    id: ah.id,
                    categoria: ah.categoria,
                    descripcion: ah.descripcion || '',
                    monto: ah.monto,
                  })
                }
                className={btnSmallNeutral}
              >
                Editar
              </button>
              <button onClick={() => eliminarAhorro(ah.id)} className={btnSmallDanger}>
                Borrar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}