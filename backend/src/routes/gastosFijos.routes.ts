import { Router, Request, Response } from 'express';
import { query } from '../config/db';
import { requireAuth } from '../middlewares/auth';

const router = Router();
router.use(requireAuth);

router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM gastos_fijos ORDER BY created_at ASC');
    res.json({ ok: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo gastos fijos' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { nombre, categoria, monto, frecuencia } = req.body;
    const result = await query(
      `INSERT INTO gastos_fijos (nombre, categoria, monto, frecuencia)
       VALUES ($1, COALESCE($2, 'Gasto Fijo'), $3, $4)
       RETURNING *`,
      [nombre.trim(), categoria || 'Gasto Fijo', Number(monto), frecuencia]
    );
    res.status(201).json({ ok: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error creando gasto fijo' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre, categoria, monto, frecuencia } = req.body;
    const result = await query(
      `UPDATE gastos_fijos
       SET nombre = $1, categoria = COALESCE($2, categoria), monto = $3, frecuencia = $4
       WHERE id = $5
       RETURNING *`,
      [nombre.trim(), categoria, Number(monto), frecuencia, id]
    );
    res.json({ ok: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error actualizando gasto fijo' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await query('DELETE FROM gastos_fijos WHERE id = $1', [req.params.id]);
    res.json({ ok: true, message: 'Gasto fijo eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error eliminando gasto fijo' });
  }
});

// BOTÓN DE 1 CLIC: Genera un gasto real a partir de este gasto fijo
router.post('/:id/ejecutar', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const fijo = await query('SELECT * FROM gastos_fijos WHERE id = $1', [id]);

    if (fijo.rowCount === 0) {
      res.status(404).json({ error: 'Gasto fijo no encontrado' });
      return;
    }

    const item = fijo.rows[0];
    const nuevaTx = await query(
      `INSERT INTO transacciones (tipo, monto, categoria, descripcion, fecha, gasto_fijo_id)
       VALUES ('gasto', $1, $2, $3, CURRENT_DATE, $4)
       RETURNING *`,
      [item.monto, item.categoria || 'Gasto Fijo', `Pago fijo (${item.frecuencia}): ${item.nombre}`, item.id]
    );

    res.status(201).json({ ok: true, data: nuevaTx.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error al generar el gasto desde el gasto fijo' });
  }
});

export default router;