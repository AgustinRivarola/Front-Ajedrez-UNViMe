import { useState } from 'react';
import FondoParticulas from '../../components/atoms/FondoParticulas/index.js';
import BotonRendirse from '../../components/molecules/BotonRendirse/index.js';
import PlacaJugador from '../../components/molecules/PlacaJugador/index.js';
import CintaParticipantes from '../../components/organisms/CintaParticipantes/index.js';
import DialogoRendicion from '../../components/organisms/DialogoRendicion/index.js';
import DialogoVictoria from '../../components/organisms/DialogoVictoria/index.js';
import ListaJugadas from '../../components/organisms/ListaJugadas/index.js';
import MenuPrincipal from '../../components/organisms/MenuPrincipal/index.js';
import PanelConfiguracion from '../../components/organisms/PanelConfiguracion/index.js';
import Tablero from '../../components/organisms/Tablero/index.js';
import PlantillaConfiguracion from '../../components/templates/PlantillaConfiguracion/index.js';
import PlantillaMenu from '../../components/templates/PlantillaMenu/index.js';
import PlantillaPartida from '../../components/templates/PlantillaPartida/index.js';
import { obtenerResultadoAbandono } from '../../utils/obtenerResultadoAbandono.js';
import { obtenerOpcionesFaltantes } from '../../utils/validarConfiguracion.js';

const participantes = [
  'Rol: nombre, nombre, nombre.',
  'Universidad Nacional de Villa Mercedes (UNViMe)',
];

const nombresRival = {
  stockfish: 'Stockfish',
  unvime: 'IA UNViMe',
};

const PaginaAjedrez = () => {
  const [pantalla, setPantalla] = useState('menu');
  const [configuracion, setConfiguracion] = useState({
    modo: '',
    dificultad: '',
    color: '',
    tiempo: '',
  });
  const [nombres, setNombres] = useState({
    jugadorUno: 'Jugador 1',
    jugadorDos: 'Jugador 2',
  });
  const [colorDePartida, setColorDePartida] = useState('w');
  const [jugadorRendido, setJugadorRendido] = useState(null);

  const actualizarConfiguracion = (clave, valor) => {
    setConfiguracion((actual) => ({
      ...actual,
      [clave]: valor,
      ...(clave === 'modo' && valor === 'jugador' ? { dificultad: '' } : {}),
    }));
  };

  const cambiarNombre = (jugador, nombre) => {
    setNombres((actuales) => ({ ...actuales, [jugador]: nombre }));
  };

  const comenzarPartida = () => {
    const colorElegido = configuracion.color === 'r'
      ? (Math.random() < 0.5 ? 'w' : 'b')
      : configuracion.color;

    setColorDePartida(colorElegido);
    setPantalla('partida');
  };

  const rival = configuracion.modo === 'jugador'
    ? nombres.jugadorDos || 'Jugador 2'
    : nombresRival[configuracion.modo] || 'Jugador 2';
  const opcionesFaltantes = obtenerOpcionesFaltantes(configuracion);
  const minutos = Number(configuracion.tiempo) || 0;
  const resultadoAbandono = jugadorRendido?.etapa === 'victoria'
    ? obtenerResultadoAbandono({
      modo: configuracion.modo,
      jugadorRendido,
      nombres,
      rival,
      colorDePartida,
    })
    : null;

  const solicitarRendicion = (clave, nombre) => {
    setJugadorRendido({ clave, nombre, etapa: 'confirmacion' });
  };

  const confirmarRendicion = () => {
    setJugadorRendido((actual) => (
      actual ? { ...actual, etapa: 'victoria' } : actual
    ));
  };

  const volverAlMenu = () => {
    setJugadorRendido(null);
    setPantalla('menu');
  };

  return (
    <main className="aplicacion">
      <FondoParticulas />

      {pantalla === 'menu' && (
        <PlantillaMenu>
          <MenuPrincipal onNuevaPartida={() => setPantalla('configuracion')} />
        </PlantillaMenu>
      )}

      {pantalla === 'configuracion' && (
        <PlantillaConfiguracion>
          <PanelConfiguracion
            configuracion={configuracion}
            elementosFaltantes={opcionesFaltantes}
            onComenzar={comenzarPartida}
            onSeleccionar={actualizarConfiguracion}
            onVolver={() => setPantalla('menu')}
          />
          <div className="zona-tablero">
            <PlacaJugador
              etiqueta="Nombre del segundo jugador"
              editable={configuracion.modo === 'jugador'}
              minutos={minutos}
              nombre={
                configuracion.modo === 'jugador'
                  ? nombres.jugadorDos
                  : nombresRival[configuracion.modo] || 'Jugador 2'
              }
              onCambiarNombre={(nombre) => cambiarNombre('jugadorDos', nombre)}
            />
            <Tablero color={configuracion.color} />
            <PlacaJugador
              etiqueta="Nombre del primer jugador"
              editable={configuracion.modo === 'jugador'}
              minutos={minutos}
              nombre={nombres.jugadorUno}
              onCambiarNombre={(nombre) => cambiarNombre('jugadorUno', nombre)}
            />
          </div>
        </PlantillaConfiguracion>
      )}

      {pantalla === 'partida' && (
        <PlantillaPartida>
          <div className="zona-tablero">
            <div className="fila-jugador">
              <PlacaJugador minutos={minutos} nombre={rival} />
              {configuracion.modo === 'jugador' && (
                <BotonRendirse
                  nombreJugador={rival}
                  onRendirse={() => solicitarRendicion('jugadorDos', rival)}
                />
              )}
            </div>
            <Tablero color={colorDePartida} />
            <div className="fila-jugador">
              <PlacaJugador minutos={minutos} nombre={nombres.jugadorUno || 'Jugador 1'} />
              <BotonRendirse
                nombreJugador={nombres.jugadorUno || 'Jugador 1'}
                onRendirse={() => solicitarRendicion(
                  'jugadorUno',
                  nombres.jugadorUno || 'Jugador 1',
                )}
              />
            </div>
          </div>
          <ListaJugadas jugador={nombres.jugadorUno || 'Jugador 1'} rival={rival} />
        </PlantillaPartida>
      )}

      {pantalla === 'partida' && jugadorRendido?.etapa === 'confirmacion' && (
        <DialogoRendicion
          jugador={jugadorRendido.nombre}
          onConfirmar={confirmarRendicion}
          onVolver={() => setJugadorRendido(null)}
        />
      )}

      {pantalla === 'partida' && resultadoAbandono && (
        <DialogoVictoria
          onMenu={volverAlMenu}
          onRevisar={() => setJugadorRendido(null)}
          resultado={resultadoAbandono}
        />
      )}

      <CintaParticipantes participantes={participantes} />
    </main>
  );
};

export default PaginaAjedrez;
