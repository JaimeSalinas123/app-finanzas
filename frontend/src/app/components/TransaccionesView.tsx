'use client';

import { useState, useEffect, FormEvent } from 'react';
import { apiFetch } from '../lib/api';

type RangoFiltro = '7d' | '1m' | '1a' | 'all';

// ───────── Clases de diseño reutilizables ─────────
const card =
  'rounded-[28px] bg-[#f7f1e3] p-5 shadow-[0_12px_28px_rgba(190,110,80,0.14)] sm:p-7';
const cardTitle = 'text-xl font-bold text-[#4a3a36]';
const input =
  'w-full min-w-0 rounded-2xl border-[1.5px] border-[#e6d9c6] bg-[#fffdf8] px-4 py-3 text-[0.95rem] font-medium text-[#4a3a36] outline-none transition placeholder:text-[#b9a9a1] focus:border-[#ee8e6e] focus:ring-4 focus:ring-[#ee8e6e]/25 motion-reduce:transition-none';
const btnBase =
  'rounded-full font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ee8e6e] motion-reduce:transition-none';
const btnPrimary = `${btnBase} bg-[#5f9e86] px-5 py-3 text-[0.95rem] text-white shadow-[0_8px_16px_rgba(95,158,134,0.32)] hover:bg-[#4c8a72]`;
const btnSmallGreen = `${btnBase} bg-[#5f9e86] px-3.5 py-2 text-[0.8rem] text-white hover:bg-[#4c8a72]`;
const btnSmallNeutral = `${btnBase} bg-[#e9dfcf] px-3.5 py-2 text-[0.8rem] text-[#6b5a53] hover:bg-[#dfd2bd]`;
const btnSmallDanger = `${btnBase} bg-[#fde4dc] px-3.5 py-2 text-[0.8rem] text-[#c4482a] hover:bg-[#f9d0c3]`;
const row =
  'rounded-2xl bg-[#fffdf8] p-3.5 sm:px-4';

export default function TransaccionesView({
  tipo,
  onUpdate,
}: {
  tipo: 'ingreso' | 'gasto';
  onUpdate: () => void;
}) {
  const [rango, setRango] = useState<RangoFiltro>('all');
  const [transacciones, setTransacciones] = useState<any[]>([]);
  const [txForm, setTxForm] = useState({ id: '', monto: '', categoria: '', descripcion: '', fecha: '' });

  const [gastosFijos, setGastosFijos] = useState<any[]>([]);
  const [fijoForm, setFijoForm] = useState({ id: '', nombre: '', categoria: 'Fijo', monto: '', frecuencia: 'mensual' });

  const cargarLista = async () => {
    const resTx = await apiFetch(`/transacciones?tipo=${tipo}&rango=${rango}`);
    setTransacciones(resTx.data);

    if (tipo === 'gasto') {
      const resFijos = await apiFetch('/gastos-fijos');
      setGastosFijos(resFijos.data);
    }
  };

  useEffect(() => {
    setTxForm({ id: '', monto: '', categoria: '', descripcion: '', fecha: '' });
    cargarLista();
  }, [tipo, rango]);

  const guardarTransaccion = async (e: FormEvent) => {
    e.preventDefault();
    if (txForm.id) {
      await apiFetch(`/transacciones/${txForm.id}`, { method: 'PUT', body: JSON.stringify(txForm) });
    } else {
      await apiFetch('/transacciones', { method: 'POST', body: JSON.stringify({ ...txForm, tipo }) });
    }
    setTxForm({ id: '', monto: '', categoria: '', descripcion: '', fecha: '' });
    await cargarLista();
    onUpdate();
  };

  const eliminarTransaccion = async (id: string) => {
    await apiFetch(`/transacciones/${id}`, { method: 'DELETE' });
    await cargarLista();
    onUpdate();
  };

  const guardarGastoFijo = async (e: FormEvent) => {
    e.preventDefault();
    if (fijoForm.id) {
      await apiFetch(`/gastos-fijos/${fijoForm.id}`, { method: 'PUT', body: JSON.stringify(fijoForm) });
    } else {
      await apiFetch('/gastos-fijos', { method: 'POST', body: JSON.stringify(fijoForm) });
    }
    setFijoForm({ id: '', nombre: '', categoria: 'Fijo', monto: '', frecuencia: 'mensual' });
    await cargarLista();
  };

  const ejecutarGastoFijo = async (id: string) => {
    await apiFetch(`/gastos-fijos/${id}/ejecutar`, { method: 'POST' });
    await cargarLista();
    onUpdate();
  };

  const eliminarGastoFijo = async (id: string) => {
    await apiFetch(`/gastos-fijos/${id}`, { method: 'DELETE' });
    await cargarLista();
  };

  const colorMonto = (t: string) => (t === 'ingreso' ? 'text-[#4c8a72]' : 'text-[#d9694a]');

  return (
    <div className="flex flex-col gap-5 font-medium text-[#4a3a36] md:gap-6">
      {/* ───────── Gastos fijos (solo en gastos) ───────── */}
      {tipo === 'gasto' && (
        <div className={`${card} border-2 border-[#ee8e6e]/40`}>
          <h3 className={`${cardTitle} mb-1`}>Mis Gastos Fijos</h3>
          <p className="mb-5 text-[0.9rem] text-[#8d7a73]">Pagos de 1 clic</p>

          <form
            onSubmit={guardarGastoFijo}
            className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
          >
            <input
              className={input}
              placeholder="Nombre (Ej: Internet, Gym)"
              value={fijoForm.nombre}
              onChange={(e) => setFijoForm({ ...fijoForm, nombre: e.target.value })}
              required
            />
            <input
              className={input}
              type="number"
              step="0.01"
              placeholder="Monto ($)"
              value={fijoForm.monto}
              onChange={(e) => setFijoForm({ ...fijoForm, monto: e.target.value })}
              required
            />
            <select
              className={input}
              value={fijoForm.frecuencia}
              onChange={(e) => setFijoForm({ ...fijoForm, frecuencia: e.target.value })}
            >
              <option value="semanal">Semanal</option>
              <option value="mensual">Mensual</option>
            </select>
            <button type="submit" className={btnPrimary}>
              {fijoForm.id ? 'Actualizar Fijo' : '+ Agregar Fijo'}
            </button>
          </form>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {gastosFijos.map((gf) => (
              <div key={gf.id} className={`${row} flex flex-col gap-3`}>
                <div className="min-w-0">
                  <strong className="block truncate font-bold">{gf.nombre}</strong>
                  <div className="text-[0.85rem] text-[#8d7a73]">
                    ${Number(gf.monto).toFixed(2)} ({gf.frecuencia})
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => ejecutarGastoFijo(gf.id)} className={btnSmallGreen}>
                    Pagar 1-Clic
                  </button>
                  <button
                    onClick={() =>
                      setFijoForm({
                        id: gf.id,
                        nombre: gf.nombre,
                        categoria: gf.categoria || 'Fijo',
                        monto: gf.monto,
                        frecuencia: gf.frecuencia,
                      })
                    }
                    className={btnSmallNeutral}
                  >
                    Editar
                  </button>
                  <button onClick={() => eliminarGastoFijo(gf.id)} className={btnSmallDanger}>
                    Borrar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ───────── Formulario ───────── */}
      <div className={card}>
        <h3 className={`${cardTitle} mb-5`}>
          {txForm.id
            ? 'Editando Movimiento'
            : tipo === 'ingreso'
            ? 'Registrar Nueva Ganancia'
            : 'Registrar Nuevo Gasto'}
        </h3>
        <form
          onSubmit={guardarTransaccion}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5"
        >
          <input
            className={input}
            type="number"
            step="0.01"
            placeholder="Monto ($)"
            value={txForm.monto}
            onChange={(e) => setTxForm({ ...txForm, monto: e.target.value })}
            required
          />
          <input
            className={input}
            placeholder={tipo === 'ingreso' ? 'Categoría (Salario, Extra...)' : 'Categoría (Comida, Transporte...)'}
            value={txForm.categoria}
            onChange={(e) => setTxForm({ ...txForm, categoria: e.target.value })}
            required
          />
          <input
            className={input}
            placeholder="Descripción opcional"
            value={txForm.descripcion}
            onChange={(e) => setTxForm({ ...txForm, descripcion: e.target.value })}
          />
          <input
            className={input}
            type="date"
            value={txForm.fecha}
            onChange={(e) => setTxForm({ ...txForm, fecha: e.target.value })}
          />
          <button type="submit" className={`${btnPrimary} sm:col-span-2 xl:col-span-1`}>
            {txForm.id ? 'Guardar Cambios' : 'Guardar'}
          </button>
        </form>
      </div>

      {/* ───────── Historial ───────── */}
      <div className={card}>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className={cardTitle}>Historial de {tipo === 'ingreso' ? 'Ganancias' : 'Gastos'}</h3>

          <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 sm:mx-0 sm:px-0 sm:pb-0">
            {[
              { id: '7d', label: '7 Días' },
              { id: '1m', label: '1 Mes' },
              { id: '1a', label: '1 Año' },
              { id: 'all', label: 'Todos' },
            ].map((f) => {
              const active = rango === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setRango(f.id as RangoFiltro)}
                  aria-pressed={active}
                  className={`${btnBase} shrink-0 px-4 py-2 text-[0.85rem] ${
                    active
                      ? 'bg-[#ee8e6e] text-white shadow-[0_6px_14px_rgba(238,142,110,0.4)]'
                      : 'bg-[#fffdf8] text-[#8d7a73] hover:bg-white'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {transacciones.length === 0 ? (
          <p className="text-[#8d7a73]">No hay registros en este periodo.</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {transacciones.map((tx) => (
              <div
                key={tx.id}
                className={`${row} flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`}
              >
                <div className="min-w-0">
                  <p className="break-words">
                    <strong className="font-bold">{tx.categoria}</strong>{' '}
                    {tx.descripcion && <span className="text-[#8d7a73]">— {tx.descripcion}</span>}
                  </p>
                  <div className="text-[0.8rem] text-[#a8978f]">{String(tx.fecha).slice(0, 10)}</div>
                </div>

                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <span className={`text-lg font-bold ${colorMonto(tx.tipo)}`}>
                    ${Number(tx.monto).toFixed(2)}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setTxForm({
                          id: tx.id,
                          monto: tx.monto,
                          categoria: tx.categoria,
                          descripcion: tx.descripcion || '',
                          fecha: String(tx.fecha).slice(0, 10),
                        })
                      }
                      className={btnSmallNeutral}
                    >
                      Editar
                    </button>
                    <button onClick={() => eliminarTransaccion(tx.id)} className={btnSmallDanger}>
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