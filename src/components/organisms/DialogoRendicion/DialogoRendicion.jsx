import Boton from '../../atoms/Boton/index.js';
import Dialogo from '../Dialogo/index.js';

const DialogoRendicion = ({ jugador, onConfirmar, onVolver }) => (
  <Dialogo
    onCerrar={onVolver}
    titulo={`¿Seguro que quieres rendirte, ${jugador}?`}
    variante="rendicion"
  >
    <div className="dialogo-acciones">
      <Boton className="dialogo-boton" onClick={onConfirmar}>
        Sí, me rindo.
      </Boton>
      <Boton className="dialogo-boton" onClick={onVolver}>
        Volver a la partida
      </Boton>
    </div>
  </Dialogo>
);

export default DialogoRendicion;
