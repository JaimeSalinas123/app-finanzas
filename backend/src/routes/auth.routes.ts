import { Router, Request, Response } from 'express';
import { safeCompare, createSessionToken, requireAuth } from '../middlewares/auth';

const router = Router();

// Protección contra fuerza bruta (Máximo 5 intentos fallidos cada 15 min por IP)
const loginAttempts = new Map<string, { count: number; lockUntil: number }>();
const MAX_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000; // 15 minutos

router.post('/login', async (req: Request, res: Response) => {
  try {
    const ip = req.ip || 'unknown';
    const now = Date.now();
    const attempt = loginAttempts.get(ip);

    if (attempt && attempt.lockUntil > now) {
      const waitMin = Math.ceil((attempt.lockUntil - now) / 60000);
      res.status(429).json({
        error: `Demasiados intentos fallidos. Intenta de nuevo en ${waitMin} minutos.`,
      });
      return;
    }

    const { username, password } = req.body;
    const envUser = process.env.ADMIN_USER || '';
    const envPass = process.env.ADMIN_PASSWORD || '';

    if (!username || !password) {
      res.status(400).json({ error: 'Debes ingresar usuario y contraseña.' });
      return;
    }

    const isUserValid = safeCompare(String(username), envUser);
    const isPassValid = safeCompare(String(password), envPass);

    if (!isUserValid || !isPassValid) {
      const currentCount = (attempt?.count || 0) + 1;
      loginAttempts.set(ip, {
        count: currentCount,
        lockUntil: currentCount >= MAX_ATTEMPTS ? now + LOCK_TIME_MS : 0,
      });

      res.status(401).json({ error: 'Credenciales incorrectas.' });
      return;
    }

    // Si acertó, limpiamos el historial de fallos y creamos la cookie blindada
    loginAttempts.delete(ip);
    const token = await createSessionToken(envUser);

    res.cookie('finanzas_session', token, {
      httpOnly: true, // Imposible de leer desde JavaScript en el navegador (Anti-XSS)
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
      path: '/',
    });

    res.json({ ok: true, message: 'Bienvenido', user: envUser });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie('finanzas_session', { path: '/' });
  res.json({ ok: true, message: 'Sesión cerrada correctamente.' });
});

router.get('/me', requireAuth, (req: Request, res: Response) => {
  res.json({ ok: true, user: (req as any).user });
});

export default router;