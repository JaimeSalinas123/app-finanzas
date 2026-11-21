import { Router, Request, Response } from 'express';
import { query } from '../config/db';
import { requireAuth } from '../middlewares/auth';

const router = Router();
router.use(requireAuth);

router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM metas ORDER BY created_at DESC');
    res.json({ ok: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo metas' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { nombre, monto_objetivo, monto_actual } = req.body;
    const inicial = Number(monto_actual || 0);
    const objetivo = Number(monto_objetivo);

    const result = await query(
      `INSERT INTO metas (nombre, monto_objetivo, monto_actual, completada)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [nombre.trim(), objetivo, inicial, inicial >= objetivo]
    );
    res.status(201).json({ ok: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error creando meta' });
  }
});

// Agregar o quitar dinero de una meta (+30 para abonar, -10 para retirar de vuelta al banco)
router.patch('/:id/abonar', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { cantidad } = req.body; // Puede ser positivo (agregar) o negativo (quitar)

    const metaActual = await query('SELECT * FROM metas WHERE id = $1', [id]);
    if (metaActual.rowCount === 0) {
      res.status(404).json({ error: 'Meta no encontrada' });
      return;
    }

    const nuevoMonto = Math.max(0, Number(metaActual.rows[0].monto_actual) + Number(cantidad));
    const objetivo = Number(metaActual.rows[0].monto_objetivo);

    const result = await query(
      `UPDATE metas
       SET monto_actual = $1, completada = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [nuevoMonto, nuevoMonto >= objetivo, id]
    );

    res.json({ ok: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error actualizando el saldo de la meta' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre, monto_objetivo, monto_actual } = req.body;
    const result = await query(
      `UPDATE metas
       SET nombre = $1, monto_objetivo = $2, monto_actual = $3, completada = ($3 >= $2), updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [nombre.trim(), Number(monto_objetivo), Number(monto_actual), id]
    );
    res.json({ ok: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error editando meta' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await query('DELETE FROM metas WHERE id = $1', [req.params.id]);
    res.json({ ok: true, message: 'Meta eliminada y fondos liberados al disponible' });
  } catch (error) {
    res.status(500).json({ error: 'Error eliminando meta' });
  }
});

export default router;