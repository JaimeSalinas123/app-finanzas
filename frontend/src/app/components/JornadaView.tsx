'use client';

import { useState, useEffect, FormEvent } from 'react';
import { apiFetch } from '../lib/api';

// ───────── Clases de diseño reutilizables ─────────
const card =
  'rounded-[28px] bg-[#f7f1e3] p-5 shadow-[0_12px_28px_rgba(190,110,80,0.14)] sm:p-7';
const input =
  'w-full min-w-0 rounded-2xl border-[1.5px] border-[#e6d9c6] bg-[#fffdf8] px-4 py-3 text-[0.95rem] font-medium text-[#4a3a36] outline-none transition placeholder:text-[#b9a9a1] focus:border-[#ee8e6e] focus:ring-4 focus:ring-[#ee8e6e]/25 motion-reduce:transition-none';
const label = 'pl-1 text-[0.8rem] font-semibold text-[#8d7a73]';
const btnBase =
  'rounded-full font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ee8e6e] motion-reduce:transition-none';
const btnPrimary = `${btnBase} bg-[#5f9e86] px-5 py-3 text-[0.95rem] text-white shadow-[0_8px_16px_rgba(95,158,134,0.32)] hover:bg-[#4c8a72]`;
const btnSmallNeutral = `${btnBase} bg-[#e9dfcf] px-3.5 py-2 text-[0.8rem] text-[#6b5a53] hover:bg-[#dfd2bd]`;
const btnSmallDanger = `${btnBase} bg-[#fde4dc] px-3.5 py-2 text-[0.8rem] text-[#c4482a] hover:bg-[#f9d0c3]`;

export default function JornadaView({ onUpdate }: { onUpdate: () => void }) {
  const [jornadas, setJornadas] = useState<any[]>([]);
  const [totalExtraGlobal, setTotalExtraGlobal] = useState(0);
  const [jornadaForm, setJornadaForm] = useState({
    id: '',
    fecha: '',
    hora_entrada: '07:30',
    hora_salida_simbolica: '15:30',
    hora_inicio_extra: '16:00',
    hora_salida_real: '19:30',
    notas: '',
  });

  const cargarJornadas = async () => {
    const res = await apiFetch('/jornada');
    setJornadas(res.data);
    setTotalExtraGlobal(res.totalHorasExtra);
  };

  useEffect(() => {
    cargarJornadas();
  }, []);

  const guardarJornada = async (e: FormEvent) => {
    e.preventDefault();
    if (jornadaForm.id) {
      await apiFetch(`/jornada/${jornadaForm.id}`, { method: 'PUT', body: JSON.stringify(jornadaForm) });
    } else {
      await apiFetch('/jornada', { method: 'POST', body: JSON.stringify(jornadaForm) });
    }
    setJornadaForm({ id: '', fecha: '', hora_entrada: '07:30', hora_salida_simbolica: '15:30', hora_inicio_extra: '16:00', hora_salida_real: '19:30', notas: '' });
    await cargarJornadas();
    onUpdate();
  };

  const eliminarJornada = async (id: string) => {
    await apiFetch(`/jornada/${id}`, { method: 'DELETE' });
    await cargarJornadas();
    onUpdate();
  };

  return (
    <div className="flex flex-col gap-5 font-medium text-[#4a3a36] md:gap-6">
      {/* ───────── Encabezado + formulario ───────── */}
      <div className={card}>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h3 className="text-xl font-bold">Control de Jornada y Horas Extra</h3>
            <p className="mt-1 text-[0.9rem] text-[#8d7a73]">
              Horario simbólico: <strong className="font-bold text-[#4a3a36]">07:30 a 15:30</strong> | Conteo de
              horas extra desde las <strong className="font-bold text-[#4a3a36]">16:00</strong>.
            </p>
          </div>

          <div className="relative shrink-0 overflow-hidden rounded-3xl bg-gradient-to-br from-[#f4b79f] to-[#ee8e6e] px-6 py-3.5 text-center text-white shadow-[0_12px_24px_rgba(238,142,110,0.38)]">
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 200 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d="M0 70C50 40 90 90 140 65C170 50 190 45 200 55V100H0Z" fill="#fff" opacity=".15" />
            </svg>
            <div className="relative text-[0.8rem] font-semibold text-white/90">Total Horas Extra</div>
            <div className="relative text-2xl font-bold">{totalExtraGlobal} hrs</div>
          </div>
        </div>

        <form onSubmit={guardarJornada} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-1.5">
            <span className={label}>Fecha</span>
            <input
              className={input}
              type="date"
              value={jornadaForm.fecha}
              onChange={(e) => setJornadaForm({ ...jornadaForm, fecha: e.target.value })}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={label}>Entrada</span>
            <input
              className={input}
              type="time"
              value={jornadaForm.hora_entrada}
              onChange={(e) => setJornadaForm({ ...jornadaForm, hora_entrada: e.target.value })}
              required
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={label}>Salida Simbólica</span>
            <input
              className={input}
              type="time"
              value={jornadaForm.hora_salida_simbolica}
              onChange={(e) => setJornadaForm({ ...jornadaForm, hora_salida_simbolica: e.target.value })}
              required
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={label}>Inicio Extra</span>
            <input
              className={input}
              type="time"
              value={jornadaForm.hora_inicio_extra}
              onChange={(e) => setJornadaForm({ ...jornadaForm, hora_inicio_extra: e.target.value })}
              required
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="pl-1 text-[0.8rem] font-bold text-[#d9694a]">Salida Real</span>
            <input
              className={input}
              type="time"
              value={jornadaForm.hora_salida_real}
              onChange={(e) => setJornadaForm({ ...jornadaForm, hora_salida_real: e.target.value })}
              required
            />
          </label>
          <label className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-2">
            <span className={label}>Notas</span>
            <input
              className={input}
              placeholder="Opcional"
              value={jornadaForm.notas}
              onChange={(e) => setJornadaForm({ ...jornadaForm, notas: e.target.value })}
            />
          </label>
          <div className="flex items-end sm:col-span-2 lg:col-span-1">
            <button type="submit" className={`${btnPrimary} w-full`}>
              {jornadaForm.id ? 'Actualizar' : '+ Registrar'}
            </button>
          </div>
        </form>
      </div>

      {/* ───────── Historial ───────── */}
      <div className={card}>
        <h3 className="mb-5 text-xl font-bold">Historial de Días Trabajados</h3>

        {jornadas.length === 0 ? (
          <p className="text-[#8d7a73]">Aún no hay días registrados.</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {jornadas.map((j) => (
              <div
                key={j.id}
                className="flex flex-col gap-3 rounded-2xl bg-[#fffdf8] p-3.5 sm:px-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="min-w-0">
                  <strong className="block text-base font-bold">{String(j.fecha).slice(0, 10)}</strong>
                  <div className="mt-0.5 flex flex-wrap gap-x-4 gap-y-0.5 text-[0.88rem] text-[#8d7a73]">
                    <span>
                      Base: {String(j.hora_entrada).slice(0, 5)} - {String(j.hora_salida_simbolica).slice(0, 5)}
                    </span>
                    <span>
                      Salida real:{' '}
                      <strong className="font-bold text-[#4a3a36]">{String(j.hora_salida_real).slice(0, 5)}</strong>
                    </span>
                  </div>
                  {j.notas && <div className="mt-1 break-words text-[0.8rem] text-[#a8978f]">Nota: {j.notas}</div>}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 md:justify-end">
                  <span className="rounded-full bg-[#fde4dc] px-3.5 py-1.5 text-[0.85rem] font-bold text-[#c4482a]">
                    +{Number(j.horas_extra)} hrs extra
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setJornadaForm({
                          id: j.id,
                          fecha: String(j.fecha).slice(0, 10),
                          hora_entrada: String(j.hora_entrada).slice(0, 5),
                          hora_salida_simbolica: String(j.hora_salida_simbolica).slice(0, 5),
                          hora_inicio_extra: String(j.hora_inicio_extra).slice(0, 5),
                          hora_salida_real: String(j.hora_salida_real).slice(0, 5),
                          notas: j.notas || '',
                        })
                      }
                      className={btnSmallNeutral}
                    >
                      Editar
                    </button>
                    <button onClick={() => eliminarJornada(j.id)} className={btnSmallDanger}>
                      Borrar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}