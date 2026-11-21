import { Request, Response, NextFunction } from 'express';
import { jwtVerify, SignJWT } from 'jose';
import crypto from 'crypto';

const getSecretKey = () => {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('AUTH_SECRET debe tener al menos 32 caracteres en backend/.env');
  }
  return new TextEncoder().encode(secret);
};

// Compara textos sin revelar pistas por tiempo de respuesta (Anti-Timing Attack)
export const safeCompare = (input: string, allowed: string): boolean => {
  const bufInput = Buffer.from(input);
  const bufAllowed = Buffer.from(allowed);
  if (bufInput.length !== bufAllowed.length) {
    return false;
  }
  return crypto.timingSafeEqual(bufInput, bufAllowed);
};

// Crea el token encriptado por 7 días
export const createSessionToken = async (username: string): Promise<string> => {
  return await new SignJWT({ user: username, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecretKey());
};

// Middleware que protege todas las rutas de tu dinero
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.finanzas_session;

    if (!token) {
      res.status(401).json({ error: 'No autorizado. Inicia sesión primero.' });
      return;
    }

    const { payload } = await jwtVerify(token, getSecretKey());
    (req as any).user = payload.user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Sesión inválida o expirada.' });
  }
};