# Backend

API REST con Node.js, Express y TypeScript.

## Desarrollo

```bash
npm install
npm run dev
```

El servidor usa el puerto `4000` por defecto. `GET /api/health` devuelve el estado del servicio.

## Comandos

- `npm run dev`: servidor con recarga durante el desarrollo.
- `npm run build`: compilación TypeScript a `dist/`.
- `npm start`: ejecuta `dist/index.js`.

Configura el entorno en `.env`; usa `.env.example` como referencia.
