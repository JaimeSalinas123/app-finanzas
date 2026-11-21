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

// Colores de las tarjetas de metas (tomados de tu referencia)
const ACCENTS = ['#8b9fb0', '#6fa68d', '#e6b06a', '#9c7d66', '#9a9c72', '#ee8e6e'];

export default function MetasView({ onUpdate }: { onUpdate: () => void }) {
  const [metas, setMetas] = useState<any[]>([]);
  const [metaForm, setMetaForm] = useState({ id: '', nombre: '', monto_objetivo: '', monto_actual: '' });
  const [abonoMeta, setAbonoMeta] = useState<{ [key: string]: string }>({});

  const cargarMetas = async () => {
    const res = await apiFetch('/metas');
    setMetas(res.data);
  };

  useEffect(() => {
    cargarMetas();
  }, []);

  const guardarMeta = async (e: FormEvent) => {
    e.preventDefault();
    if (metaForm.id) {
      await apiFetch(`/metas/${metaForm.id}`, { method: 'PUT', body: JSON.stringify(metaForm) });
    } else {
      await apiFetch('/metas', { method: 'POST', body: JSON.stringify(metaForm) });
    }
    setMetaForm({ id: '', nombre: '', monto_objetivo: '', monto_actual: '' });
    await cargarMetas();
    onUpdate();
  };

  const modificarSaldoMeta = async (id: string, signo: 1 | -1) => {
    const valor = Number(abonoMeta[id] || 0);
    if (valor <= 0) return;
    await apiFetch(`/metas/${id}/abonar`, { method: 'PATCH', body: JSON.stringify({ cantidad: valor * signo }) });
    setAbonoMeta({ ...abonoMeta, [id]: '' });
    await cargarMetas();
    onUpdate();
  };

  const eliminarMeta = async (id: string) => {
    await apiFetch(`/metas/${id}`, { method: 'DELETE' });
    await cargarMetas();
    onUpdate();
  };

  return (
    <div className="flex flex-col gap-5 font-medium text-[#4a3a36] md:gap-6">
      {/* ───────── Formulario ───────── */}
      <div className={card}>
        <h3 className="mb-5 text-xl font-bold">
          {metaForm.id ? 'Editar Meta' : 'Nueva Meta (Ej: Comprar Proteína)'}
        </h3>
        <form onSubmit={guardarMeta} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input
            className={input}
            placeholder="Nombre de la meta"
            value={metaForm.nombre}
            onChange={(e) => setMetaForm({ ...metaForm, nombre: e.target.value })}
            required
          />
          <input
            className={input}
            type="number"
            step="0.01"
            placeholder="Meta Objetivo ($)"
            value={metaForm.monto_objetivo}
            onChange={(e) => setMetaForm({ ...metaForm, monto_objetivo: e.target.value })}
            required
          />
          <input
            className={input}
            type="number"
            step="0.01"
            placeholder="Dinero Inicial ($)"
            value={metaForm.monto_actual}
            onChange={(e) => setMetaForm({ ...metaForm, monto_actual: e.target.value })}
          />
          <button type="submit" className={`${btnPrimary} sm:col-span-2 lg:col-span-1`}>
            {metaForm.id ? 'Actualizar Meta' : 'Crear Meta'}
          </button>
        </form>
      </div>

      {/* ───────── Tarjetas de metas ───────── */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {metas.map((meta, i) => {
          const progreso = Math.min(100, (Number(meta.monto_actual) / Number(meta.monto_objetivo)) * 100);
          const accent = ACCENTS[i % ACCENTS.length];
          return (
            <div key={meta.id} className={`${card} flex flex-col`}>
              <div className="flex items-start gap-3">
                <span
                  className="mt-0.5 h-10 w-10 shrink-0 rounded-2xl shadow-[0_6px_12px_rgba(120,60,40,0.18)]"
                  style={{ backgroundColor: accent }}
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="break-words text-lg font-bold leading-tight">{meta.nombre}</h4>
                  <span className="text-[0.9rem] font-bold text-[#c98a2b]">
                    ${Number(meta.monto_actual).toFixed(2)} / ${Number(meta.monto_objetivo).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <div
                  className="h-3 flex-1 overflow-hidden rounded-full bg-[#e9dfcf]"
                  role="progressbar"
                  aria-valuenow={Math.round(progreso)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="h-full rounded-full bg-[#5f9e86] transition-all motion-reduce:transition-none"
                    style={{ width: `${progreso}%` }}
                  />
                </div>
                <span className="w-10 text-right text-[0.8rem] font-bold text-[#8d7a73]">
                  {Math.round(progreso)}%
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <input
                  className={`${input} basis-full sm:basis-0 sm:flex-1`}
                  type="number"
                  step="0.01"
                  placeholder="Monto ($)"
                  value={abonoMeta[meta.id] || ''}
                  onChange={(e) => setAbonoMeta({ ...abonoMeta, [meta.id]: e.target.value })}
                />
                <button onClick={() => modificarSaldoMeta(meta.id, 1)} className={`${btnAdd} flex-1 sm:flex-none`}>
                  + Meter
                </button>
                <button onClick={() => modificarSaldoMeta(meta.id, -1)} className={`${btnRemove} flex-1 sm:flex-none`}>
                  - Quitar
                </button>
              </div>

              <div className="mt-4 flex justify-end gap-2 border-t border-[#e6d9c6] pt-4">
                <button
                  onClick={() =>
                    setMetaForm({
                      id: meta.id,
                      nombre: meta.nombre,
                      monto_objetivo: meta.monto_objetivo,
                      monto_actual: meta.monto_actual,
                    })
                  }
                  className={btnSmallNeutral}
                >
                  Editar
                </button>
                <button onClick={() => eliminarMeta(meta.id)} className={btnSmallDanger}>
                  Borrar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}