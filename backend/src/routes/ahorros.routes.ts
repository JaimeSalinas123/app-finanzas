import { Router, Request, Response } from 'express';
import { query } from '../config/db';
import { requireAuth } from '../middlewares/auth';

const router = Router();
router.use(requireAuth);

router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM ahorros ORDER BY created_at DESC');
    res.json({ ok: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo ahorros' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { categoria, descripcion, monto } = req.body;
    const result = await query(
      `INSERT INTO ahorros (categoria, descripcion, monto)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [categoria.trim(), descripcion || null, Number(monto || 0)]
    );
    res.status(201).json({ ok: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error creando apartado de ahorro' });
  }
});

// Agregar o retirar dinero de un apartado de ahorro
router.patch('/:id/modificar-monto', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { cantidad } = req.body;

    const ahorroActual = await query('SELECT * FROM ahorros WHERE id = $1', [id]);
    if (ahorroActual.rowCount === 0) {
      res.status(404).json({ error: 'Ahorro no encontrado' });
      return;
    }

    const nuevoMonto = Math.max(0, Number(ahorroActual.rows[0].monto) + Number(cantidad));
    const result = await query(
      `UPDATE ahorros SET monto = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [nuevoMonto, id]
    );

    res.json({ ok: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error actualizando el ahorro' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { categoria, descripcion, monto } = req.body;
    const result = await query(
      `UPDATE ahorros
       SET categoria = $1, descripcion = $2, monto = $3, updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [categoria.trim(), descripcion || null, Number(monto), id]
    );
    res.json({ ok: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error editando ahorro' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await query('DELETE FROM ahorros WHERE id = $1', [req.params.id]);
    res.json({ ok: true, message: 'Ahorro eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error eliminando ahorro' });
  }
});

export default router;