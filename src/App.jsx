import React, { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import './App.css';

// Componente de Partículas Flotantes en Movimiento
const BackgroundParticles = () => {
  const particles = Array.from({ length: 25 });

  return (
    <div className="bg-particles">
      {particles.map((_, i) => {
        const size = Math.random() * 6 + 3;
        const left = Math.random() * 100;
        const duration = Math.random() * 7 + 5;
        const delay = Math.random() * 5;

        return (
          <span
            key={i}
            className="particle"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`
            }}
          />
        );
      })}
    </div>
  );
};

// 1. Botón con estilo Glassmorphism
const GlassButton = ({ children, onClick, className = '', style = {} }) => {
  return (
    <button
      onClick={onClick}
      className={`glass-button ${className}`}
      style={style}
    >
      {children}
    </button>
  );
};

// 2. Ticker / Cinta desplazable inferior
const NewsTicker = ({ participants = [] }) => {
  const textString = participants.length > 0 
    ? participants.join("   •   ") 
    : "Rol, nombre, nombre, nombre   •   Rol, nombre, nombre, nombre   •   Ajedrez UNViMe";

  return (
    <div className="news-ticker-container">
      <div className="animate-ticker font-jersey-15 news-ticker-text">
        <span>{textString}</span>
      </div>
    </div>
  );
};

// Componente decorativo: Tablero con react-chessboard sin jugabilidad
const ChessBoardDecoration = () => {
  return (
    <div className="chess-board-wrapper">
      <Chessboard 
        position="start" 
        arePiecesDraggable={false}
        boardWidth={440}
        customDarkSquareStyle={{ backgroundColor: '#b88b4a' }}
        customLightSquareStyle={{ backgroundColor: '#e3c193' }}
      />
    </div>
  );
};

// Componente Estandarizado de Cabecera con posiciones verticales fijas y animación de transición
const BoardOverlayHeader = ({ subtitle, children }) => {
  return (
    <div className="board-overlay-container">
      <ChessBoardDecoration />

      <div className="board-overlay-content">
        <div key={`sub-${subtitle}`} className="fade-transition subtitle-container">
          <h2 className="font-jersey-15 subtitle-text">
            {subtitle}
          </h2>
        </div>

        <h1 className="font-jersey-20 main-title-text">
          Ajedrez UNViMe
        </h1>

        <div key={`opts-${subtitle}`} className="fade-transition options-container">
          {children}
        </div>
      </div>
    </div>
  );
};

// 3. Pantalla de Bienvenida
const WelcomeScreen = ({ onStartClick, participants }) => {
  return (
    <div className="screen-container">
      <BoardOverlayHeader subtitle="¡Bienvenido!">
        <GlassButton onClick={onStartClick}>
          Nueva Partida
        </GlassButton>
      </BoardOverlayHeader>

      <NewsTicker participants={participants} />
    </div>
  );
};

// 4. Pantalla de Selección de Modo
const GameModeScreen = ({ onSelectMode, onBack }) => {
  return (
    <div className="screen-container">
      <BoardOverlayHeader subtitle="NUEVA PARTIDA">
        <div className="game-mode-options">
          <GlassButton onClick={() => onSelectMode('stockfish')} className="mode-btn">
            vs. Stockfish
          </GlassButton>

          <GlassButton onClick={() => onSelectMode('ai')} className="mode-btn">
            vs. IA UNViMe
          </GlassButton>

          <GlassButton onClick={() => onSelectMode('pvp')} className="mode-btn">
            vs jugador
          </GlassButton>
        </div>
      </BoardOverlayHeader>

      <div className="back-button-absolute">
        <button 
          onClick={onBack}
          className="glass-button font-jersey-15 back-btn-custom"
        >
          VOLVER
        </button>
      </div>
    </div>
  );
};

// 5. Pantalla de Selección de Dificultad
const DifficultyScreen = ({ modeTitle, onSelectDifficulty, onBack }) => {
  return (
    <div className="screen-container">
      <BoardOverlayHeader subtitle={modeTitle}>
        <div className="difficulty-options">
          <GlassButton 
            onClick={() => onSelectDifficulty('easy')} 
            className="diff-btn-easy"
          >
            <span>FACIL</span>
            <span className="elo-subtext">800-1200 ELO</span>
          </GlassButton>

          <GlassButton 
            onClick={() => onSelectDifficulty('medium')} 
            className="diff-btn-medium"
          >
            <span>MEDIO</span>
            <span className="elo-subtext">800-1700 ELO</span>
          </GlassButton>

          <GlassButton 
            onClick={() => onSelectDifficulty('hard')} 
            className="diff-btn-hard"
          >
            <span>DIFICIL</span>
            <span className="elo-subtext">1800+ ELO</span>
          </GlassButton>
        </div>
      </BoardOverlayHeader>

      <div className="back-button-absolute">
        <button 
          onClick={onBack}
          className="glass-button font-jersey-15 back-btn-custom"
        >
          VOLVER
        </button>
      </div>
    </div>
  );
};

// 6. Pantalla de Selección de Color de Piezas
const ColorSelectionScreen = ({ modeTitle, onSelectColor, onBack }) => {
  return (
    <div className="screen-container">
      <BoardOverlayHeader subtitle={modeTitle}>
        <div className="color-selection-options">
          <GlassButton 
            onClick={() => onSelectColor('blancas')} 
            className="color-btn-white"
          >
            BLANCAS
          </GlassButton>

          <GlassButton 
            onClick={() => onSelectColor('negras')} 
            className="color-btn-black"
          >
            NEGRAS
          </GlassButton>
        </div>
      </BoardOverlayHeader>

      <div className="back-button-absolute">
        <button 
          onClick={onBack}
          className="glass-button font-jersey-15 back-btn-custom"
        >
          VOLVER
        </button>
      </div>
    </div>
  );
};

// 7. Pantalla Pre-Partida
const PreGameScreen = ({ modeTitle, difficultyLabel, onStartGame, onBack }) => {
  return (
    <div className="screen-container fade-transition pre-game-screen-container">
      
      <div className="pre-game-sidebar">
        <div className="sidebar-title-container">
          <h1 className="font-jersey-20 sidebar-title">
            Ajedrez<br/>UNViMe
          </h1>
        </div>

        <div className="sidebar-info-container">
          <p className="font-jersey-15 sidebar-mode-title">
            {modeTitle}
          </p>
          {difficultyLabel && (
            <>
              <p className="font-jersey-15 sidebar-diff-name">
                {difficultyLabel.name}
              </p>
              <span className="sidebar-elo-text">
                ({difficultyLabel.elo})
              </span>
            </>
          )}
        </div>

        <div>
          <GlassButton onClick={onStartGame} style={{ width: '100%', padding: '12px 0', fontSize: '1.5rem' }}>
            COMENZAR PARTIDA
          </GlassButton>
        </div>
      </div>

      <div className="pre-game-back-container">
        <button 
          onClick={onBack}
          className="glass-button font-jersey-15 back-btn-custom"
        >
          VOLVER
        </button>
      </div>

      <div className="pre-game-board-container">
        <div className="clock-row">
          <span className="font-jersey-15 clock-text">
            {modeTitle.includes('Stockfish') ? 'Stockfish' : modeTitle.includes('IA') ? 'IA UNViMe' : 'Jugador 2'}
          </span>
          <span className="font-jersey-15 clock-text">15:00</span>
        </div>

        <div className="chess-board-wrapper pre-game-board-wrapper">
          <Chessboard 
            position="start" 
            arePiecesDraggable={false}
            boardWidth={460}
            customDarkSquareStyle={{ backgroundColor: '#b88b4a' }}
            customLightSquareStyle={{ backgroundColor: '#e3c193' }}
          />
        </div>

        <div className="clock-row">
          <span className="font-jersey-15 clock-text">Jugador</span>
          <span className="font-jersey-15 clock-text">15:00</span>
        </div>
      </div>
    </div>
  );
};

// Componente Principal App
export default function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [selectedGameMode, setSelectedGameMode] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  const projectParticipants = [
    "Rol, nombre, nombre, nombre",
    "Universidad Nacional de Villa Mercedes (UNViMe)"
  ];

  const handleSelectMode = (mode) => {
    setSelectedGameMode(mode);
    if (mode === 'pvp') {
      setCurrentScreen('colorSelection');
    } else {
      setCurrentScreen('difficulty');
    }
  };

  const handleSelectDifficulty = (level) => {
    setSelectedDifficulty(level);
    setCurrentScreen('colorSelection');
  };

  const handleSelectColor = (color) => {
    setSelectedColor(color);
    setCurrentScreen('preGame');
  };

  const getModeTitle = () => {
    if (selectedGameMode === 'stockfish') return 'Partida vs Stockfish';
    if (selectedGameMode === 'ai') return 'Partida vs IA UNViMe';
    return 'Partida vs Jugador';
  };

  const getDifficultyDetails = () => {
    if (selectedDifficulty === 'easy') return { name: 'FACIL', elo: '800-1200 ELO' };
    if (selectedDifficulty === 'medium') return { name: 'MEDIO', elo: '1200-1700 ELO' };
    if (selectedDifficulty === 'hard') return { name: 'DIFICIL', elo: '1800+ ELO' };
    return null;
  };

  return (
    <main className="app-main">
      <BackgroundParticles />

      {currentScreen === 'welcome' && (
        <WelcomeScreen 
          onStartClick={() => setCurrentScreen('modes')} 
          participants={projectParticipants}
        />
      )}

      {currentScreen === 'modes' && (
        <GameModeScreen 
          onSelectMode={handleSelectMode}
          onBack={() => setCurrentScreen('welcome')}
        />
      )}

      {currentScreen === 'difficulty' && (
        <DifficultyScreen 
          modeTitle={getModeTitle()}
          onSelectDifficulty={handleSelectDifficulty}
          onBack={() => setCurrentScreen('modes')}
        />
      )}

      {currentScreen === 'colorSelection' && (
        <ColorSelectionScreen 
          modeTitle={getModeTitle()}
          onSelectColor={handleSelectColor}
          onBack={() => {
            if (selectedGameMode === 'pvp') {
              setCurrentScreen('modes');
            } else {
              setCurrentScreen('difficulty');
            }
          }}
        />
      )}

      {currentScreen === 'preGame' && (
        <PreGameScreen 
          modeTitle={getModeTitle()}
          difficultyLabel={getDifficultyDetails()}
          onStartGame={() => console.log('¡Partida iniciada!')}
          onBack={() => setCurrentScreen('colorSelection')}
        />
      )}
    </main>
  );
}