import { Router, Request, Response } from 'express';
import { query } from '../config/db';
import { requireAuth } from '../middlewares/auth';

const router = Router();
router.use(requireAuth);

// Listar con filtro de tipo ('ingreso' | 'gasto') y rango ('7d' | '1m' | '1a' | 'all')
router.get('/', async (req: Request, res: Response) => {
  try {
    const { tipo, rango } = req.query;
    const params: any[] = [];
    const conditions: string[] = [];

    if (tipo === 'ingreso' || tipo === 'gasto') {
      params.push(tipo);
      conditions.push(`tipo = $${params.length}`);
    }

    if (rango === '7d') {
      conditions.push(`fecha >= CURRENT_DATE - INTERVAL '7 days'`);
    } else if (rango === '1m') {
      conditions.push(`fecha >= CURRENT_DATE - INTERVAL '1 month'`);
    } else if (rango === '1a') {
      conditions.push(`fecha >= CURRENT_DATE - INTERVAL '1 year'`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await query(
      `SELECT * FROM transacciones ${whereClause} ORDER BY fecha DESC, created_at DESC`,
      params
    );

    res.json({ ok: true, data: result.rows });
  } catch (error) {
    console.error('Error listando transacciones:', error);
    res.status(500).json({ error: 'Error al obtener transacciones' });
  }
});

// Crear ganancia o gasto
router.post('/', async (req: Request, res: Response) => {
  try {
    const { tipo, monto, categoria, descripcion, fecha } = req.body;

    if (!['ingreso', 'gasto'].includes(tipo) || !monto || Number(monto) <= 0 || !categoria) {
      res.status(400).json({ error: 'Tipo, categoría y un monto mayor a 0 son obligatorios.' });
      return;
    }

    const result = await query(
      `INSERT INTO transacciones (tipo, monto, categoria, descripcion, fecha)
       VALUES ($1, $2, $3, $4, COALESCE($5, CURRENT_DATE))
       RETURNING *`,
      [tipo, Number(monto), categoria.trim(), descripcion || null, fecha || null]
    );

    res.status(201).json({ ok: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error creando transacción:', error);
    res.status(500).json({ error: 'Error al guardar la transacción' });
  }
});

// Editar ganancia o gasto
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { monto, categoria, descripcion, fecha } = req.body;

    const result = await query(
      `UPDATE transacciones
       SET monto = $1, categoria = $2, descripcion = $3, fecha = COALESCE($4, fecha)
       WHERE id = $5
       RETURNING *`,
      [Number(monto), categoria.trim(), descripcion || null, fecha || null, id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Movimiento no encontrado' });
      return;
    }

    res.json({ ok: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error editando transacción:', error);
    res.status(500).json({ error: 'Error al actualizar la transacción' });
  }
});

// Borrar ganancia o gasto
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM transacciones WHERE id = $1', [id]);
    res.json({ ok: true, message: 'Movimiento eliminado' });
  } catch (error) {
    console.error('Error eliminando transacción:', error);
    res.status(500).json({ error: 'Error al eliminar la transacción' });
  }
});

export default router;