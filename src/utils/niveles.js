import { modoAApi } from './traductores.js';

const sinTildes = (texto) => texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const CLASES = { facil: 'opcion--facil', medio: 'opcion--medio', dificil: 'opcion--dificil' };

// Convierte los perfiles de GET /difficulty-profiles en opciones del selector de
// dificultad. Si los perfiles indican a qué motor pertenecen, se filtran por modo.
export const nivelesParaModo = (perfiles, modo) => {
  const modoApi = modoAApi(modo);
  const delModo = perfiles.filter((perfil) => !perfil.modo || String(perfil.modo).toUpperCase() === modoApi);
  const elegidos = delModo.length > 0 ? delModo : perfiles;

  const vistos = new Set();
  return elegidos
    .filter((perfil) => {
      if (vistos.has(perfil.nombre)) return false;
      vistos.add(perfil.nombre);
      return true;
    })
    .map((perfil) => ({
      valor: perfil.valor,
      etiqueta: perfil.nombre,
      clase: CLASES[sinTildes(perfil.nombre)] ?? '',
    }));
};
