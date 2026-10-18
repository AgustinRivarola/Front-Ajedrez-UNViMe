import Boton from '../../atoms/Boton/index.js';
import GrupoOpciones from '../../molecules/GrupoOpciones/index.js';
import Texto from '../../atoms/Texto/index.js';

const opciones = [
  {
    clave: 'modo',
    titulo: 'Modo de partida',
    valores: [
      { valor: 'jugador', etiqueta: 'vs Jugador' },
      { valor: 'stockfish', etiqueta: 'vs Stockfish' },
      { valor: 'unvime', etiqueta: 'vs IA UNViMe' },
    ],
  },
  {
    clave: 'dificultad',
    titulo: 'Nivel de dificultad',
    valores: [
      { valor: 'facil', etiqueta: 'Fácil', clase: 'opcion--facil' },
      { valor: 'medio', etiqueta: 'Medio', clase: 'opcion--medio' },
      { valor: 'dificil', etiqueta: 'Difícil', clase: 'opcion--dificil' },
    ],
  },
  {
    clave: 'color',
    titulo: 'Color de piezas',
    valores: [
      { valor: 'w', etiqueta: 'Blancas', clase: 'opcion--blancas' },
      { valor: 'b', etiqueta: 'Negras', clase: 'opcion--negras' },
      { valor: 'r', etiqueta: 'Aleatorio' },
    ],
  },
  {
    clave: 'tiempo',
    titulo: 'Tiempo de partida',
    valores: [
      { valor: '10', etiqueta: '10 min' },
      { valor: '15', etiqueta: '15 min' },
      { valor: '20', etiqueta: '20 min' },
    ],
  },
];

const PanelConfiguracion = ({
  configuracion,
  elementosFaltantes,
  onSeleccionar,
  onVolver,
  onComenzar,
}) => {
  const esPartidaLocal = configuracion.modo === 'jugador';

  return (
    <div className="panel-configuracion">
      <h1>Ajedrez UNViMe</h1>
      <div className="panel-configuracion__opciones">
        {opciones.map(({ clave, titulo, valores }) => (
          <GrupoOpciones
            deshabilitado={clave === 'dificultad' && esPartidaLocal}
            key={clave}
            onSeleccionar={(valor) => onSeleccionar(clave, valor)}
            opciones={valores}
            titulo={titulo}
            valor={configuracion[clave]}
          />
        ))}
      </div>

      <div className="panel-configuracion__acciones">
        <Boton className="boton-pequeno" onClick={onVolver}>
          ⬅ VOLVER
        </Boton>
        <Boton
          className={`boton-pequeno${elementosFaltantes.length === 0 ? ' is-ready' : ''}`}
          disabled={elementosFaltantes.length > 0}
          onClick={onComenzar}
        >
          COMENZAR ▶
        </Boton>
      </div>

      <Texto aria-live="polite" className="panel-configuracion__aviso" as="p">
        {elementosFaltantes.length > 0
          ? `Falta elegir: ${elementosFaltantes.join(', ')}`
          : ''}
      </Texto>
    </div>
  );
};

export default PanelConfiguracion;
