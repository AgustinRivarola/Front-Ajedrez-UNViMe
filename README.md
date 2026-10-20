# Ajedrez UNViMe — Frontend

Interfaz del sistema de ajedrez local (Modelos y Simulación, UNViMe). React 19 + Vite, organizado con Atomic Design.
La estructura y el inventario de componentes están en [`src/README.md`](src/README.md).

## Requisitos

- Node 24 LTS (ver Gestión de la Configuración) y npm.
- El backend de 08 · Desarrollo Backend corriendo en `http://127.0.0.1:3001` (Express, sin prefijo `/api`).

## Puesta en marcha

```bash
npm ci
cp .env.example .env      # ajustar VITE_API_URL si el backend no está en 3001
npm run dev               # http://localhost:5173 (el backend ya habilita CORS para este puerto)
```

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compila a `dist/` |
| `npm run preview` | Sirve lo compilado |
| `npm run lint` | ESLint |
| `npm test` | Pruebas unitarias (`node:test`) |

## Qué está conectado al backend

| Pantalla / acción | Endpoint |
| --- | --- |
| Niveles de dificultad | `GET /difficulty-profiles` |
| Comenzar partida | `POST /games` `{ mode, alias, difficulty, playerColor }` |
| Elegir pieza (destinos legales) | `GET /games/:id/legal-moves?square=e2` |
| Mover | `POST /games/:id/moves` `{ from, to, promotion? }` |
| Turno de Stockfish / IA | `POST /games/:id/engine-move` |
| Rendirse | `POST /games/:id/resign` `{ color }` y luego `GET /games/:id` |
| Guardar y salir | `POST /games/:id/pause` |

Capa HTTP: `src/services/`. Si el backend cambia un nombre de campo, se ajusta únicamente en `src/services/normalizar.js`
y en `src/utils/traductores.js` (valores `LOCAL | STOCKFISH | AI` y `WHITE | BLACK`).

## Pendiente

- Historial de partidas, visor PGN y reanudar (`GET /games`, `/games/:id/pgn`, `/resume`): falta el diseño de UX.
- Reloj: la interfaz muestra el tiempo elegido pero no hay cuenta regresiva; ningún requisito lo pide (decisión abierta).
- Partidas contra otro jugador: la API recibe un único `alias`; el nombre del segundo jugador solo se ve en pantalla.
- Pruebas de componentes (Vitest + Testing Library): decisión abierta del equipo.
