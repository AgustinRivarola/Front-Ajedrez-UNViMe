import { useState } from 'react';
import { colorOpuesto, esCoronacion, piezaEnCasilla, turnoDesdeFen } from '../utils/traductores.js';

const POSICION_INICIAL = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

const estadoInicial = {
  id: null,
  modo: 'jugador',
  colorHumano: 'w',
  fen: POSICION_INICIAL,
  estado: null,
  jugadas: [],
  cierre: null,
};

const colorDePieza = (pieza) => (pieza === pieza.toUpperCase() ? 'w' : 'b');

/**
 * Maneja una partida contra el backend. Recibe `api` (ver services/partidasApi.js)
 * para poder probarlo con un falso.
 *
 * error.tipo: 'motor' (falló el turno de la máquina → reintentar o pausar) | 'general'
 */
export const usePartida = (api) => {
  const [partida, setPartida] = useState(estadoInicial);
  const [seleccionada, setSeleccionada] = useState(null);
  const [destinos, setDestinos] = useState([]);
  const [coronacion, setCoronacion] = useState(null);
  const [pensando, setPensando] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const finalizada = partida.estado === 'FINALIZADA';
  const pausada = partida.estado === 'PENDIENTE';
  const turno = turnoDesdeFen(partida.fen);
  const esTurnoHumano = partida.modo === 'jugador' || turno === partida.colorHumano;
  const puedeJugar = Boolean(partida.id) && !finalizada && !pausada
    && !pensando && !cargando && !coronacion && esTurnoHumano;

  const limpiarSeleccion = () => {
    setSeleccionada(null);
    setDestinos([]);
  };

  const mostrarError = (fallo, tipo = 'general') => {
    setError({ tipo, mensaje: fallo?.message ?? 'Ocurrió un error inesperado.' });
  };

  const aplicarJugada = (resultado) => {
    setPartida((actual) => ({
      ...actual,
      fen: resultado.fen ?? actual.fen,
      estado: resultado.estado ?? actual.estado,
      jugadas: resultado.san ? [...actual.jugadas, { san: resultado.san }] : actual.jugadas,
      cierre: resultado.estado === 'FINALIZADA'
        ? { resultado: resultado.resultado, motivo: resultado.motivo }
        : actual.cierre,
    }));
    return resultado.estado === 'FINALIZADA';
  };

  const pedirJugadaMaquina = async (id) => {
    setPensando(true);
    setError(null);
    try {
      aplicarJugada(await api.jugarMaquina(id));
    } catch (fallo) {
      mostrarError(fallo, 'motor');
    } finally {
      setPensando(false);
    }
  };

  const iniciar = async ({ modo, alias, dificultad, color }) => {
    setCargando(true);
    setError(null);
    limpiarSeleccion();
    try {
      const creada = await api.crearPartida({ modo, alias, dificultad, color });
      setPartida({
        id: creada.id,
        modo,
        colorHumano: color,
        fen: creada.fen ?? POSICION_INICIAL,
        estado: creada.estado ?? 'EN_PROGRESO',
        jugadas: creada.jugadas ?? [],
        cierre: null,
      });
      setCargando(false);
      if (modo !== 'jugador' && turnoDesdeFen(creada.fen ?? POSICION_INICIAL) !== color) {
        await pedirJugadaMaquina(creada.id);
      }
      return true;
    } catch (fallo) {
      mostrarError(fallo);
      setCargando(false);
      return false;
    }
  };

  const enviarJugada = async (desde, hasta, promocion) => {
    setCargando(true);
    setError(null);
    limpiarSeleccion();
    setCoronacion(null);
    let terminada;
    try {
      const resultado = await api.enviarJugada(partida.id, { desde, hasta, coronacion: promocion });
      if (!resultado.valida) {
        mostrarError(new Error('Esa jugada no es válida.'));
        return;
      }
      terminada = aplicarJugada(resultado);
    } catch (fallo) {
      mostrarError(fallo);
      return;
    } finally {
      setCargando(false);
    }
    if (!terminada && partida.modo !== 'jugador') await pedirJugadaMaquina(partida.id);
  };

  const alTocarCasilla = async (casilla) => {
    if (!puedeJugar) return;

    if (seleccionada && destinos.includes(casilla)) {
      if (esCoronacion(partida.fen, seleccionada, casilla)) {
        setCoronacion({ desde: seleccionada, hasta: casilla });
        return;
      }
      await enviarJugada(seleccionada, casilla);
      return;
    }

    const pieza = piezaEnCasilla(partida.fen, casilla);
    if (!pieza || colorDePieza(pieza) !== turno || casilla === seleccionada) {
      limpiarSeleccion();
      return;
    }

    setSeleccionada(casilla);
    setDestinos([]);
    try {
      setDestinos(await api.obtenerDestinos(partida.id, casilla));
    } catch (fallo) {
      limpiarSeleccion();
      mostrarError(fallo);
    }
  };

  const elegirCoronacion = (pieza) => {
    if (coronacion) enviarJugada(coronacion.desde, coronacion.hasta, pieza);
  };

  const cancelarCoronacion = () => {
    setCoronacion(null);
    limpiarSeleccion();
  };

  const reintentarMaquina = () => pedirJugadaMaquina(partida.id);

  // `color` = color del jugador que se rinde.
  const rendirse = async (color) => {
    setCargando(true);
    setError(null);
    limpiarSeleccion();
    try {
      await api.rendirse(partida.id, color);
      const final = await api.obtenerPartida(partida.id);
      setPartida((actual) => ({
        ...actual,
        estado: final.estado ?? 'FINALIZADA',
        cierre: {
          resultado: final.resultado ?? (color === 'w' ? '0-1' : '1-0'),
          motivo: final.motivo ?? 'RESIGNATION',
        },
      }));
      return true;
    } catch (fallo) {
      mostrarError(fallo);
      return false;
    } finally {
      setCargando(false);
    }
  };

  // "Guardar y salir": la partida queda PENDIENTE y se puede reanudar por su ID.
  const guardarYSalir = async () => {
    setCargando(true);
    setError(null);
    try {
      await api.pausar(partida.id);
      return partida.id;
    } catch (fallo) {
      mostrarError(fallo);
      return null;
    } finally {
      setCargando(false);
    }
  };

  const descartar = () => {
    setPartida(estadoInicial);
    limpiarSeleccion();
    setCoronacion(null);
    setError(null);
  };

  return {
    partida,
    seleccionada,
    destinos,
    coronacion,
    pensando,
    cargando,
    error,
    puedeJugar,
    finalizada,
    colorRival: colorOpuesto(partida.colorHumano),
    iniciar,
    alTocarCasilla,
    elegirCoronacion,
    cancelarCoronacion,
    reintentarMaquina,
    rendirse,
    guardarYSalir,
    descartar,
    limpiarError: () => setError(null),
  };
};
