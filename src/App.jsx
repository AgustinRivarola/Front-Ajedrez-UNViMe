import React, { useState } from 'react';

// 1. Botón con estilo Glassmorphism y CSS Puro
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
    <div style={{
      width: '100%',
      backgroundColor: 'rgba(12, 15, 30, 0.9)',
      borderTop: '1px solid #312525',
      padding: '8px 0',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      position: 'fixed',
      bottom: 0,
      left: 0,
      zIndex: 30
    }}>
      <div className="animate-ticker font-jersey-15" style={{ fontSize: '1.1rem', color: 'rgba(244, 194, 251, 0.8)', letterSpacing: '2px' }}>
        <span>{textString}</span>
      </div>
    </div>
  );
};

// Componente decorativo: Tablero de Ajedrez ilustrado de fondo
const ChessBoardDecoration = () => {
  const boardLayout = [
    ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
    ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
    ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
  ];

  return (
    <div className="chess-grid">
      {boardLayout.map((row, rIdx) =>
        row.map((cell, cIdx) => {
          const isDark = (rIdx + cIdx) % 2 === 1;
          return (
            <div
              key={`${rIdx}-${cIdx}`}
              className={isDark ? 'chess-cell-dark' : 'chess-cell-light'}
            >
              {cell}
            </div>
          );
        })
      )}
    </div>
  );
};

// Componente Estandarizado de Cabecera con posiciones verticales fijas
const BoardOverlayHeader = ({ subtitle, children }) => {
  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <ChessBoardDecoration />

      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        zIndex: 10,
        padding: '10px'
      }}>
        <div style={{ height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h2 className="font-jersey-15" style={{ fontSize: '1.8rem', color: 'white', textShadow: '0 4px 4px rgba(0,0,0,0.9)', margin: 0 }}>
            {subtitle}
          </h2>
        </div>

        <h1 className="font-jersey-20" style={{ fontSize: '3.6rem', color: 'white', textShadow: '0 6px 6px rgba(0,0,0,1)', margin: '4px 0 12px 0', lineHeight: 1 }}>
          Ajedrez UNViMe
        </h1>

        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', minHeight: '60px', alignItems: 'center' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

// 3. Pantalla de Bienvenida (Incluye el NewsTicker)
const WelcomeScreen = ({ onStartClick, participants }) => {
  return (
    <div className="screen-container" style={{ userSelect: 'none' }}>
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
    <div className="screen-container" style={{ userSelect: 'none' }}>
      <BoardOverlayHeader subtitle="NUEVA PARTIDA">
        <div style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px', 
          width: '100%', 
          maxWidth: '560px' 
        }}>
          <GlassButton onClick={() => onSelectMode('stockfish')} style={{ padding: '6px 10px', fontSize: '1.2rem', flex: 1 }}>
            vs. Stockfish
          </GlassButton>

          <GlassButton onClick={() => onSelectMode('ai')} style={{ padding: '6px 10px', fontSize: '1.2rem', flex: 1 }}>
            vs. IA UNViMe
          </GlassButton>

          <GlassButton onClick={() => onSelectMode('pvp')} style={{ padding: '6px 10px', fontSize: '1.2rem', flex: 1 }}>
            vs jugador
          </GlassButton>
        </div>
      </BoardOverlayHeader>

      <div style={{ position: 'absolute', bottom: '50px', left: '40px', zIndex: 20 }}>
        <button 
          onClick={onBack}
          className="glass-button font-jersey-15"
          style={{ padding: '8px 24px', fontSize: '1.8rem' }}
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
    <div className="screen-container" style={{ userSelect: 'none' }}>
      <BoardOverlayHeader subtitle={modeTitle}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px', 
          width: '100%', 
          maxWidth: '580px' 
        }}>
          <GlassButton 
            onClick={() => onSelectDifficulty('easy')} 
            style={{ padding: '8px 10px', fontSize: '1.3rem', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'rgba(46, 117, 89, 0.4)' }}
          >
            <span>FACIL</span>
            <span style={{ fontSize: '0.85rem', opacity: 0.8}}>100-300 ELO</span>
          </GlassButton>

          <GlassButton 
            onClick={() => onSelectDifficulty('medium')} 
            style={{ padding: '8px 10px', fontSize: '1.3rem', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'rgba(212, 175, 55, 0.4)' }}
          >
            <span>MEDIO</span>
            <span style={{ fontSize: '0.85rem', opacity: 0.8}}>400-800 ELO</span>
          </GlassButton>

          <GlassButton 
            onClick={() => onSelectDifficulty('hard')} 
            style={{ padding: '8px 10px', fontSize: '1.3rem', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'rgba(180, 50, 50, 0.4)' }}
          >
            <span>DIFICIL</span>
            <span style={{ fontSize: '0.85rem', opacity: 0.8}}>900-1500 ELO</span>
          </GlassButton>
        </div>
      </BoardOverlayHeader>

      <div style={{ position: 'absolute', bottom: '50px', left: '40px', zIndex: 20 }}>
        <button 
          onClick={onBack}
          className="glass-button font-jersey-15"
          style={{ padding: '8px 24px', fontSize: '1.8rem' }}
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
    <div className="screen-container" style={{ userSelect: 'none' }}>
      <BoardOverlayHeader subtitle={modeTitle}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px', 
          width: '100%', 
          maxWidth: '520px' 
        }}>
          <GlassButton 
            onClick={() => onSelectColor('blancas')} 
            style={{ 
              padding: '10px 24px', 
              fontSize: '1.6rem', 
              flex: 1, 
              backgroundColor: 'rgba(255, 255, 255, 0.25)', 
              borderColor: 'rgba(255, 255, 255, 0.4)' 
            }}
          >
            BLANCAS
          </GlassButton>

          <GlassButton 
            onClick={() => onSelectColor('negras')} 
            style={{ 
              padding: '10px 24px', 
              fontSize: '1.6rem', 
              flex: 1, 
              backgroundColor: 'rgba(0, 0, 0, 0.45)', 
              borderColor: 'rgba(0, 0, 0, 0.6)' 
            }}
          >
            NEGRAS
          </GlassButton>
        </div>
      </BoardOverlayHeader>

      <div style={{ position: 'absolute', bottom: '50px', left: '40px', zIndex: 20 }}>
        <button 
          onClick={onBack}
          className="glass-button font-jersey-15"
          style={{ padding: '8px 24px', fontSize: '1.8rem' }}
        >
          VOLVER
        </button>
      </div>
    </div>
  );
};

// 7. Pantalla Pre-Partida
const PreGameScreen = ({ modeTitle, difficultyLabel, onStartGame, onBack }) => {
  const boardLayout = [
    ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
    ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
    ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
  ];

  return (
    <div className="screen-container" style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '50px', userSelect: 'none', padding: 0, position: 'relative' }}>
      
      <div style={{
        width: '320px',
        height: '100vh',
        backgroundColor: '#161122',
        borderRight: '2px solid #312525',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '50px 30px 120px 30px',
        boxShadow: '5px 0 25px rgba(0,0,0,0.6)',
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 10
      }}>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <h1 className="font-jersey-20" style={{ fontSize: '4rem', color: 'white', margin: 0, lineHeight: 1, textShadow: '0 4px 4px rgba(0,0,0,0.8)' }}>
            Ajedrez<br/>UNViMe
          </h1>
        </div>

        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p className="font-jersey-15" style={{ fontSize: '1.8rem', color: 'white', margin: 0 }}>
            {modeTitle}
          </p>
          {difficultyLabel && (
            <>
              <p className="font-jersey-15" style={{ fontSize: '2.2rem', color: '#f4c2fb', margin: 0, letterSpacing: '1px' }}>
                {difficultyLabel.name}
              </p>
              <span style={{ fontSize: '1rem', color: '#9ca3af'}}>
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

      <div style={{ position: 'absolute', bottom: '50px', left: '40px', zIndex: 40 }}>
        <button 
          onClick={onBack}
          className="glass-button font-jersey-15"
          style={{ padding: '8px 24px', fontSize: '1.8rem' }}
        >
          VOLVER
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', width: '460px', gap: '8px', marginLeft: '260px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
          <span className="font-jersey-15" style={{ fontSize: '1.6rem', color: 'white' }}>
            {modeTitle.includes('Stockfish') ? 'Stockfish' : modeTitle.includes('IA') ? 'IA UNViMe' : 'Jugador 2'}
          </span>
          <span className="font-jersey-15" style={{ fontSize: '1.6rem', color: 'white' }}>15:00</span>
        </div>

        <div className="chess-grid" style={{ width: '460px', height: '460px', margin: 0 }}>
          {boardLayout.map((row, rIdx) =>
            row.map((cell, cIdx) => {
              const isDark = (rIdx + cIdx) % 2 === 1;
              return (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={isDark ? 'chess-cell-dark' : 'chess-cell-light'}
                >
                  {cell}
                </div>
              );
            })
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
          <span className="font-jersey-15" style={{ fontSize: '1.6rem', color: 'white' }}>Jugador</span>
          <span className="font-jersey-15" style={{ fontSize: '1.6rem', color: 'white' }}>15:00</span>
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
    "Perla Quispe (Encargada UX)",
    "Carlos Santiago Ledesma",
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
    if (selectedDifficulty === 'easy') return { name: 'FACIL', elo: '100-300 ELO' };
    if (selectedDifficulty === 'medium') return { name: 'MEDIO', elo: '400-800 ELO' };
    if (selectedDifficulty === 'hard') return { name: 'DIFICIL', elo: '900-1500 ELO' };
    return null;
  };

  return (
    <main style={{ width: '100%', minHeight: '100vh', backgroundColor: '#0C0F1E' }}>
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