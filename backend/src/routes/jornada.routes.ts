import { Router, Request, Response } from 'express';
import { query } from '../config/db';
import { requireAuth } from '../middlewares/auth';

const router = Router();
router.use(requireAuth);

// Convierte "HH:MM" o "HH:MM:SS" a horas decimales (ej: "19:30" -> 19.5)
const timeToDecimal = (timeStr: string): number => {
  const parts = timeStr.split(':').map(Number);
  return parts[0] + (parts[1] || 0) / 60;
};

// Calcula horas extra contando únicamente después de la hora_inicio_extra (por defecto 16:00)
const calcularHorasExtra = (horaSalidaReal: string, horaInicioExtra = '16:00:00'): number => {
  const salidaDec = timeToDecimal(horaSalidaReal);
  const inicioExtraDec = timeToDecimal(horaInicioExtra);
  if (salidaDec <= inicioExtraDec) return 0;
  return Number((salidaDec - inicioExtraDec).toFixed(2));
};

router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM jornada_laboral ORDER BY fecha DESC');
    const totalExtra = result.rows.reduce((acc, row) => acc + Number(row.horas_extra), 0);
    res.json({
      ok: true,
      totalHorasExtra: Number(totalExtra.toFixed(2)),
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo registros de jornada' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      fecha,
      hora_entrada = '07:30:00',
      hora_salida_simbolica = '15:30:00',
      hora_inicio_extra = '16:00:00',
      hora_salida_real,
      notas,
    } = req.body;

    if (!hora_salida_real) {
      res.status(400).json({ error: 'Debes indicar la hora de salida real' });
      return;
    }

    const horasExtra = calcularHorasExtra(hora_salida_real, hora_inicio_extra);

    const result = await query(
      `INSERT INTO jornada_laboral 
        (fecha, hora_entrada, hora_salida_simbolica, hora_inicio_extra, hora_salida_real, horas_extra, notas)
       VALUES (COALESCE($1, CURRENT_DATE), $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        fecha || null,
        hora_entrada,
        hora_salida_simbolica,
        hora_inicio_extra,
        hora_salida_real,
        horasExtra,
        notas || null,
      ]
    );

    res.status(201).json({ ok: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error registrando jornada laboral' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      fecha,
      hora_entrada = '07:30:00',
      hora_salida_simbolica = '15:30:00',
      hora_inicio_extra = '16:00:00',
      hora_salida_real,
      notas,
    } = req.body;

    const horasExtra = calcularHorasExtra(hora_salida_real, hora_inicio_extra);

    const result = await query(
      `UPDATE jornada_laboral
       SET fecha = COALESCE($1, fecha),
           hora_entrada = $2,
           hora_salida_simbolica = $3,
           hora_inicio_extra = $4,
           hora_salida_real = $5,
           horas_extra = $6,
           notas = $7
       WHERE id = $8
       RETURNING *`,
      [
        fecha || null,
        hora_entrada,
        hora_salida_simbolica,
        hora_inicio_extra,
        hora_salida_real,
        horasExtra,
        notas || null,
        id,
      ]
    );

    res.json({ ok: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error actualizando jornada laboral' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await query('DELETE FROM jornada_laboral WHERE id = $1', [req.params.id]);
    res.json({ ok: true, message: 'Registro de jornada eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error eliminando jornada' });
  }
});

export default router;