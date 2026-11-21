'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Quicksand } from 'next/font/google';
import { apiFetch } from '../lib/api';

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
});

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-2xl border-[1.5px] border-[#e6d9c6] bg-[#fffdf8] px-[1.1rem] py-3.5 text-base font-medium text-[#4a3a36] outline-none transition focus:border-[#ee8e6e] focus:ring-4 focus:ring-[#ee8e6e]/25 motion-reduce:transition-none';

  const labelClass = 'pl-1 text-[0.85rem] font-semibold text-[#8d7a73]';

  return (
    <main
      className={`${quicksand.className} grid min-h-screen grid-cols-1 grid-rows-[auto_1fr] bg-[#f7f1e3] text-[#4a3a36] md:grid-cols-[1.05fr_1fr] md:grid-rows-1 md:bg-[#f8e3da]`}
    >
      {/* ───────── Panel decorativo (arriba en móvil, izquierda en PC) ───────── */}
      <section className="relative flex items-center justify-center overflow-hidden rounded-b-[44px] bg-gradient-to-br from-[#f4b79f] to-[#ee8e6e] px-5 pb-[6.5rem] pt-10 md:rounded-b-none md:rounded-r-[40px] md:px-6 md:py-10 lg:rounded-r-[56px] lg:px-10 lg:py-12">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 800 800"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 0H800V560C650 470 560 650 380 600C220 555 120 700 0 640Z"
            fill="#f2a58b"
            opacity=".55"
          />
        </svg>
        <svg
          className="absolute inset-0 h-full w-full scale-y-[-1] opacity-60"
          viewBox="0 0 800 800"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 0H800V420C680 350 560 500 400 450C250 405 120 520 0 470Z"
            fill="#ee8e6e"
            opacity=".7"
          />
        </svg>

        <div className="relative z-10 w-full max-w-[420px] text-center text-white">
          <div
            className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-[18px] bg-white/20 backdrop-blur-sm md:mb-5 md:h-16 md:w-16 md:rounded-[20px]"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              width="26"
              height="26"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="10" rx="3" />
              <path d="M7 11V8a5 5 0 0 1 10 0v3" />
            </svg>
          </div>

          <h1 className="mb-2 text-[1.75rem] font-bold leading-tight tracking-tight md:text-3xl lg:text-[2.7rem]">
            Finanzas Personales
          </h1>
          <p className="mx-auto max-w-[28ch] text-[0.95rem] font-medium text-white/90 md:text-base lg:text-[1.05rem]">
            Ingresa tus credenciales de acceso
          </p>

          {/* Mosaico decorativo inspirado en las tarjetas de metas */}
          <div
            className="mx-auto mt-10 hidden max-w-[260px] -rotate-4 grid-cols-3 gap-3.5 md:grid lg:max-w-[330px]"
            aria-hidden="true"
          >
            {['#8b9fb0', '#9c7d66', '#6fa68d', '#e6b06a', '#9a9c72', '#f7d9c8'].map((color) => (
              <span
                key={color}
                style={{ backgroundColor: color }}
                className="aspect-square rounded-[20px] shadow-[0_10px_20px_rgba(120,60,40,0.18)] even:translate-y-3.5"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Formulario ───────── */}
      <section className="relative z-10 -mt-[4.5rem] flex items-start justify-center px-4 pb-8 md:mt-0 md:items-center md:p-8">
        <div className="w-full max-w-[460px] rounded-3xl bg-[#f7f1e3] px-[1.1rem] py-7 shadow-[0_24px_50px_rgba(190,110,80,0.22)] min-[380px]:px-6 min-[380px]:py-8 md:max-w-[420px] md:rounded-[28px] md:px-8 md:py-10">
          <h2 className="mb-1 text-2xl font-bold min-[380px]:text-[1.75rem]">Bienvenido</h2>
          <p className="mb-7 text-[0.95rem] font-medium text-[#8d7a73]">
            Accede para ver tus finanzas
          </p>

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-2xl border border-[#f4b9a8] bg-[#fde4dc] px-4 py-3 text-center text-[0.9rem] font-semibold text-[#a43c24]"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-[1.1rem]">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="username" className={labelClass}>
                Usuario
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className={labelClass}>
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-full bg-[#5f9e86] py-4 text-[1.05rem] font-bold text-white shadow-[0_10px_20px_rgba(95,158,134,0.38)] transition hover:bg-[#4c8a72] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#ee8e6e] enabled:hover:-translate-y-px enabled:active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 motion-reduce:transition-none"
            >
              {loading ? 'Verificando...' : 'Entrar al Sistema'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}