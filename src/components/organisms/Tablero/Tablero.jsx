import { useEffect, useState } from 'react';
import { Chessboard } from 'react-chessboard';

const calcularAncho = () => Math.max(
  200,
  Math.min(
    540,
    window.innerWidth * 0.88,
    window.innerHeight * (window.innerWidth <= 900 ? 0.55 : 0.72),
  ),
);

const Tablero = ({
  posicion = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
  color = 'w',
  clase = '',
}) => {
  const [ancho, setAncho] = useState(540);

  useEffect(() => {
    const actualizarAncho = () => setAncho(calcularAncho());
    actualizarAncho();
    window.addEventListener('resize', actualizarAncho);
    return () => window.removeEventListener('resize', actualizarAncho);
  }, []);

  return (
    <div
      className={`tablero${color === 'b' ? ' tablero--girado' : ''} ${clase}`.trim()}
      role="img"
      aria-label="Tablero de ajedrez"
    >
      <Chessboard
        options={{
          allowDragging: false,
          boardOrientation: 'white',
          boardStyle: { width: ancho, height: ancho },
          darkSquareStyle: { backgroundColor: 'var(--color-casilla-oscura)' },
          lightSquareStyle: { backgroundColor: 'var(--color-casilla-clara)' },
          position: posicion,
        }}
      />
    </div>
  );
};

export default Tablero;
