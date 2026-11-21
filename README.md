# Finanzas

Proyecto inicial para una aplicación de finanzas personales, organizado en dos aplicaciones independientes:

- `backend/`: API REST con Node.js, Express y TypeScript.
- `frontend/`: interfaz web con Next.js, React y TypeScript.

## Requisitos

- Node.js 20.9 o superior.
- npm.

## Estructura

```text
finanzas/
├── backend/
│   ├── src/index.ts
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/app/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── .gitignore
└── README.md
```

## Instalación y ejecución

Abre dos terminales desde la carpeta raíz:

```bash
cd backend
npm install
npm run dev
```

En la segunda terminal:

```bash
cd frontend
npm install
npm run dev
```

La aplicación web estará en [http://localhost:3000](http://localhost:3000) y la API en [http://localhost:4000](http://localhost:4000). El endpoint `GET /api/health` permite comprobar que la API está activa.

## Variables de entorno

Cada aplicación tiene su propio `.env` y `.env.example`. Los valores incluidos son locales de desarrollo. Actualiza las variables según tu entorno; no guardes credenciales ni secretos en el repositorio. Los archivos `.env` están excluidos por `.gitignore`.

Backend (`backend/.env`):

| Variable | Descripción | Valor local |
|---|---|---|
| `PORT` | Puerto del servidor Express | `4000` |
| `CORS_ORIGIN` | Origen autorizado para solicitudes del frontend | `http://localhost:3000` |

Frontend (`frontend/.env`):

| Variable | Descripción | Valor local |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | URL base de la API disponible en el navegador | `http://localhost:4000` |

Las variables con prefijo `NEXT_PUBLIC_` se exponen al navegador. No coloques secretos en ellas.

## Scripts disponibles

Desde `backend/`:

- `npm run dev`: inicia el servidor en modo desarrollo.
- `npm run build`: compila TypeScript en `backend/dist/`.
- `npm start`: inicia el servidor compilado.

Desde `frontend/`:

- `npm run dev`: inicia Next.js en modo desarrollo.
- `npm run build`: genera la versión de producción.
- `npm start`: sirve la versión de producción.

## Próximos pasos

El panel inicial usa datos de ejemplo. Antes de usarlo con información financiera real, agrega persistencia, autenticación, validación de datos y controles de seguridad adecuados.
