import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD) {
  throw new Error('❌ Faltan variables de base de datos (DB_HOST, DB_USER o DB_PASSWORD) en backend/.env');
}

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'postgres',
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10,
  idleTimeoutMillis: 30000,
});

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

export const initDB = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS gastos_fijos (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(150) NOT NULL,
      categoria VARCHAR(100) DEFAULT 'Gasto Fijo',
      monto NUMERIC(12, 2) NOT NULL,
      frecuencia VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS transacciones (
      id SERIAL PRIMARY KEY,
      tipo VARCHAR(20) NOT NULL,
      monto NUMERIC(12, 2) NOT NULL,
      categoria VARCHAR(100) NOT NULL,
      descripcion TEXT,
      fecha DATE NOT NULL DEFAULT CURRENT_DATE,
      gasto_fijo_id INTEGER REFERENCES gastos_fijos(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS metas (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(150) NOT NULL,
      monto_objetivo NUMERIC(12, 2) NOT NULL,
      monto_actual NUMERIC(12, 2) NOT NULL DEFAULT 0,
      completada BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS ahorros (
      id SERIAL PRIMARY KEY,
      categoria VARCHAR(100) NOT NULL,
      descripcion TEXT,
      monto NUMERIC(12, 2) NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS jornada_laboral (
      id SERIAL PRIMARY KEY,
      fecha DATE NOT NULL DEFAULT CURRENT_DATE,
      hora_entrada TIME NOT NULL DEFAULT '07:30:00',
      hora_salida_simbolica TIME NOT NULL DEFAULT '15:30:00',
      hora_inicio_extra TIME NOT NULL DEFAULT '16:00:00',
      hora_salida_real TIME NOT NULL,
      horas_extra NUMERIC(5, 2) NOT NULL DEFAULT 0,
      notas TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('✅ Tablas verificadas/creadas en TiDB Cloud');
};