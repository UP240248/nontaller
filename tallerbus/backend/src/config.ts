export interface Settings {
  port: number; origin: string; secure: boolean; sessionHours: number;
  loginLimit: number; loginWindowMs: number;
}
function integer(value: string | undefined, fallback: number, max: number): number {
  const n = value === undefined ? fallback : Number(value);
  if (!Number.isInteger(n) || n < 1 || n > max) throw new Error('Configuración numérica inválida');
  return n;
}
export function settings(): Settings {
  if (!process.env.DATABASE_URL) throw new Error('Falta DATABASE_URL');
  const origin = process.env.FRONTEND_ORIGIN ?? 'http://localhost:4200';
  const url = new URL(origin);
  if (url.origin !== origin || !['http:', 'https:'].includes(url.protocol)) throw new Error('FRONTEND_ORIGIN inválido');
  if (process.env.COOKIE_SECURE !== undefined && !['true', 'false'].includes(process.env.COOKIE_SECURE)) throw new Error('COOKIE_SECURE inválido');
  const secure = process.env.COOKIE_SECURE === 'true';
  if (process.env.NODE_ENV === 'production' && (!secure || url.protocol !== 'https:')) throw new Error('Producción requiere HTTPS y cookie segura');
  return { port: integer(process.env.PORT, 3000, 65535), origin, secure,
    sessionHours: integer(process.env.SESSION_HOURS, 8, 168),
    loginLimit: integer(process.env.LOGIN_LIMIT, 10, 100),
    loginWindowMs: integer(process.env.LOGIN_WINDOW_SECONDS, 60, 3600) * 1000 };
}
