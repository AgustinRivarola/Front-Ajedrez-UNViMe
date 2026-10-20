// Dirección del backend. Se configura con VITE_API_URL (ver .env.example).
// `import.meta.env` no existe fuera de Vite (por ejemplo en node:test), por eso el `?.`.
const URL_POR_DEFECTO = 'http://127.0.0.1:3001';

export const API_URL = (import.meta.env?.VITE_API_URL || URL_POR_DEFECTO).replace(/\/+$/, '');
