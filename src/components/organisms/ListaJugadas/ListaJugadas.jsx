import Texto from '../../atoms/Texto/index.js';

const ListaJugadas = ({ jugador, rival }) => (
  <aside className="lista-jugadas">
    <Texto as="h2">Partida {jugador} vs. {rival}</Texto>
    <Texto as="h3">Movimientos</Texto>
  </aside>
);

export default ListaJugadas;
