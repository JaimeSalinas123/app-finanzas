import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { query, initDB } from './config/db';

import authRoutes from './routes/auth.routes';
import dashboardRoutes from './routes/dashboard.routes';
import transaccionesRoutes from './routes/transacciones.routes';
import gastosFijosRoutes from './routes/gastosFijos.routes';
import metasRoutes from './routes/metas.routes';
import ahorrosRoutes from './routes/ahorros.routes';
import jornadaRoutes from './routes/jornada.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/+$/, '');

app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get('/api/health', async (_req, res) => {
  try {
    const result = await query('SELECT NOW() as fecha_servidor');
    res.json({
      ok: true,
      status: 'Backend y TiDB Cloud conectados correctamente 🚀',
      dbTime: result.rows[0].fecha_servidor,
    });
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      error: 'Error conectando a la base de datos',
      detalle: error.message,
    });
  }
});

// Rutas del sistema
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/transacciones', transaccionesRoutes);
app.use('/api/gastos-fijos', gastosFijosRoutes);
app.use('/api/metas', metasRoutes);
app.use('/api/ahorros', ahorrosRoutes);
app.use('/api/jornada', jornadaRoutes);

// Solo levanta el puerto cuando corre en local (Vercel lo maneja en modo Serverless)
if (!process.env.VERCEL) {
  initDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`✅ Backend completo corriendo en http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error('❌ Error inicializando tablas en TiDB Cloud:', err);
    });
}

export default app;