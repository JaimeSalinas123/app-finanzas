import { Router, Request, Response } from 'express';
import { query } from '../config/db';
import { requireAuth } from '../middlewares/auth';

const router = Router();
router.use(requireAuth);

router.get('/', async (_req: Request, res: Response) => {
  try {
    const hace7Dias = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);
    const hoy = new Date();
    const inicioMes = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-01`;

    // 1. Totales históricos de Ingresos y Gastos
    const totalesTx = await query(
      `
      SELECT 
        COALESCE(SUM(CASE WHEN tipo = 'ingreso' THEN monto ELSE 0 END), 0) AS total_ingresos,
        COALESCE(SUM(CASE WHEN tipo = 'gasto' THEN monto ELSE 0 END), 0) AS total_gastos,
        COALESCE(SUM(CASE WHEN tipo = 'gasto' AND fecha >= $1 THEN monto ELSE 0 END), 0) AS gastos_7_dias,
        COALESCE(SUM(CASE WHEN tipo = 'ingreso' AND fecha >= $1 THEN monto ELSE 0 END), 0) AS ingresos_7_dias
      FROM transacciones
      `,
      [hace7Dias]
    );

    // 2. Total retenido en Metas
    const totalesMetas = await query(`
      SELECT COALESCE(SUM(monto_actual), 0) AS total_metas, COUNT(*) AS cantidad_metas
      FROM metas
    `);

    // 3. Total retenido en Ahorros
    const totalesAhorros = await query(`
      SELECT COALESCE(SUM(monto), 0) AS total_ahorros
      FROM ahorros
    `);

    // 4. Total de Horas Extra del mes actual
    const totalesJornada = await query(
      `
      SELECT COALESCE(SUM(horas_extra), 0) AS horas_extra_mes
      FROM jornada_laboral
      WHERE fecha >= $1
      `,
      [inicioMes]
    );

    // 5. Últimos 5 movimientos para vista rápida
    const ultimosMovimientos = await query(`
      SELECT id, tipo, monto, categoria, descripcion, fecha
      FROM transacciones
      ORDER BY fecha DESC
      LIMIT 5
    `);

    const ingresos = Number(totalesTx.rows[0].total_ingresos);
    const gastos = Number(totalesTx.rows[0].total_gastos);
    const metas = Number(totalesMetas.rows[0].total_metas);
    const ahorros = Number(totalesAhorros.rows[0].total_ahorros);

    const dineroEnBanco = Number((ingresos - gastos - metas - ahorros).toFixed(2));

    res.json({
      ok: true,
      data: {
        dineroEnBanco,
        totalIngresos: ingresos,
        totalGastos: gastos,
        gastosUltimos7Dias: Number(totalesTx.rows[0].gastos_7_dias),
        ingresosUltimos7Dias: Number(totalesTx.rows[0].ingresos_7_dias),
        totalMetas: metas,
        cantidadMetas: Number(totalesMetas.rows[0].cantidad_metas),
        totalAhorros: ahorros,
        horasExtraMes: Number(totalesJornada.rows[0].horas_extra_mes),
        ultimosMovimientos: ultimosMovimientos.rows,
      },
    });
  } catch (error: any) {
    console.error('Error en dashboard:', error);
    res.status(500).json({
      error: `Error SQL en dashboard: ${error.message || 'Error desconocido'}`,
    });
  }
});

export default router;