import Boton from '../../atoms/Boton/index.js';
import Dialogo from '../Dialogo/index.js';

const colores = {
  w: 'Blancas',
  b: 'Negras',
};

const DialogoVictoria = ({ resultado, onRevisar, onMenu }) => (
  <Dialogo
    onCerrar={onRevisar}
    titulo={`¡${resultado.ganador} (${colores[resultado.colorGanador]}) gana!`}
    variante="victoria"
  >
    <p className="dialogo-mensaje">
      por abandono de {resultado.abandonante}
    </p>
    <div className="dialogo-acciones">
      <Boton className="dialogo-boton" onClick={onRevisar}>
        Revisar partida
      </Boton>
      <Boton className="dialogo-boton" onClick={onMenu}>
        Menú principal
      </Boton>
    </div>
    <p className="dialogo-id">ID de partida: No disponible</p>
  </Dialogo>
);

export default DialogoVictoria;
