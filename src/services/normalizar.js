// Convierte las respuestas de la API al formato interno del front.
// Es el ÚNICO lugar que conoce los nombres de campo del backend: si la guía de
// conexión Front-Back cambia un nombre, se ajusta acá y nada más.

const lista = (datos, ...claves) => {
  if (Array.isArray(datos)) return datos;
  for (const clave of claves) {
    if (Array.isArray(datos?.[clave])) return datos[clave];
  }
  return [];
};

const normalizarJugadaDeLista = (jugada) => (
  typeof jugada === 'string'
    ? { san: jugada }
    : { san: jugada.san, desde: jugada.from, hasta: jugada.to, fen: jugada.fen_after ?? jugada.fen }
);

// GET /games/:id, POST /games
export const normalizarPartida = (datos) => {
  const partida = datos?.game ?? datos ?? {};
  return {
    id: partida.id ?? partida.gameId,
    fen: partida.fen ?? partida.currentFen ?? partida.current_fen,
    estado: partida.status,
    resultado: partida.result ?? null,
    motivo: partida.endReason ?? partida.end_reason ?? null,
    modo: partida.mode,
    jugadas: lista(partida.moves).map(normalizarJugadaDeLista),
  };
};

// POST /games/:id/moves y /engine-move → ResultadoJugada { valid, san, fen, status, result?, endReason? }
export const normalizarResultadoJugada = (datos) => {
  const jugada = datos?.move ?? datos ?? {};
  return {
    valida: jugada.valid !== false,
    san: jugada.san,
    fen: jugada.fen,
    estado: jugada.status,
    resultado: jugada.result ?? null,
    motivo: jugada.endReason ?? null,
  };
};

// GET /games/:id/legal-moves?square=e2 → lista de casillas destino
export const normalizarDestinos = (datos) => (
  lista(datos, 'moves', 'squares', 'destinations', 'legalMoves')
    .map((destino) => (typeof destino === 'string' ? destino : destino.to ?? destino.square))
    .filter(Boolean)
);

// GET /difficulty-profiles
export const normalizarPerfiles = (datos) => (
  lista(datos, 'profiles', 'items', 'data').map((perfil) => ({
    valor: String(perfil.id ?? perfil.name),
    nombre: perfil.name,
    modo: perfil.mode ?? perfil.engine ?? null,
  }))
);
