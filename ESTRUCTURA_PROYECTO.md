# Estructura del proyecto

Este documento describe la organización de carpetas y archivos de **Finanzas**. El árbol muestra los archivos del proyecto y omite `node_modules/` y los artefactos de compilación, que se generan localmente.

## Árbol de carpetas

```text
finanzas/
├── backend/
│   ├── src/
│   │   └── index.ts
│   ├── .env                  # Variables locales (ignorado por Git)
│   ├── .env.example          # Plantilla de variables
│   ├── README.md             # Instrucciones del backend
│   ├── package.json          # Dependencias y comandos del backend
│   ├── package-lock.json     # Versiones exactas de dependencias
│   └── tsconfig.json         # Configuración de TypeScript
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── globals.css   # Estilos globales
│   │       ├── layout.tsx    # Layout raíz y metadatos
│   │       └── page.tsx      # Página principal del panel
│   ├── .env                  # Variables locales (ignorado por Git)
│   ├── .env.example          # Plantilla de variables
│   ├── README.md             # Instrucciones del frontend
│   ├── next-env.d.ts         # Tipos generados/requeridos por Next.js
│   ├── next.config.ts        # Configuración de Next.js
│   ├── package.json          # Dependencias y comandos del frontend
│   ├── package-lock.json     # Versiones exactas de dependencias
│   └── tsconfig.json         # Configuración de TypeScript
├── .gitignore                # Archivos excluidos del control de versiones
├── README.md                 # Descripción y guía general
├── ESTRUCTURA_PROYECTO.md    # Este documento
├── package.json              # Dependencias declaradas en la raíz
└── package-lock.json         # Bloqueo de dependencias de la raíz
```

## Responsabilidad de cada parte

- **`backend/`**: API REST construida con Express y TypeScript. Su punto de entrada es `src/index.ts`; actualmente expone `GET /api/health`.
- **`frontend/`**: aplicación web construida con Next.js, React y TypeScript. La ruta principal se implementa en `src/app/page.tsx`, con su layout en `layout.tsx` y estilos en `globals.css`.
- **`package.json` de la raíz**: declara dependencias compartidas o de nivel raíz (`jose` y `pg`). Cada aplicación mantiene su propio `package.json` y archivo de bloqueo.
- **Archivos `.env`**: configuración local de cada aplicación. Los `.env.example` sirven como referencia; los `.env` no se deben compartir ni subir al repositorio.
- **`node_modules/`**: dependencias instaladas por npm. Se omite del árbol porque su contenido depende de la instalación y no forma parte del código fuente.
- **Artefactos generados**: la compilación del backend se produce en `backend/dist/`; Next.js puede generar `frontend/.next/` y `frontend/out/`. Estas carpetas no se listan porque se crean al compilar o ejecutar la aplicación.

## Comandos principales

Ejecuta cada aplicación desde su propia carpeta:

```bash
# Terminal 1: API
cd backend
npm install
npm run dev

# Terminal 2: aplicación web
cd frontend
npm install
npm run dev
```

En desarrollo, el frontend se sirve normalmente en `http://localhost:3000` y la API en `http://localhost:4000`.
