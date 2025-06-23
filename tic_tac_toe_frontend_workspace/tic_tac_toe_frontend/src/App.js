import React, { useState } from 'react';
import './App.css';

/**
 * Returns the winner ('X' or 'O') or "draw" or null if the game is ongoing.
 * @param {Array} board 1D array of length 9 containing 'X', 'O', or null
 */
function calculateWinner(board) {
  // Lines: indices of the winning combinations.
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // cols
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      board[a] &&
      board[a] === board[b] &&
      board[b] === board[c]
    ) {
      return board[a];
    }
  }
  if (board.every((cell) => cell !== null)) return 'draw';
  return null;
}

// PUBLIC_INTERFACE
function App() {
  // Board is a flat array of 9 elements (null | 'X' | 'O')
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [score, setScore] = useState({ X: 0, O: 0 });
  const [history, setHistory] = useState([]); // For future undo/redo if desired.

  // Handle a user click on a cell
  const handleCellClick = (idx) => {
    if (board[idx] || winner) return;
    const nextBoard = board.slice();
    nextBoard[idx] = xIsNext ? 'X' : 'O';
    setHistory([...history, board]);
    setBoard(nextBoard);

    const result = calculateWinner(nextBoard);
    if (result === 'X' || result === 'O') {
      setWinner(result);
      setScore({
        ...score,
        [result]: score[result] + 1,
      });
    } else if (result === 'draw') {
      setWinner('draw');
    } else {
      setXIsNext(!xIsNext);
    }
  };

  // Resets the board, preserves the score.
  const handleRestart = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
    setHistory([]);
  };

  // Resets the board AND the score.
  const handleResetAll = () => {
    setScore({ X: 0, O: 0 });
    handleRestart();
  };

  // UI styling constants matching requirements.
  const COLORS = {
    accent: '#FFD600', // yellow
    primary: '#1976D2', // blue
    secondary: '#424242',
    background: '#f4f6f8',
  };

  // Centralized game board, scores above, controls and status below.
  return (
    <div className="app tic-tac-toe-app" style={{ background: COLORS.background, color: COLORS.secondary, minHeight: '100vh' }}>
      <nav className="navbar" style={{ background: COLORS.primary }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo" style={{ color: COLORS.accent }}>
              <span className="logo-symbol" style={{color: COLORS.accent}}>◯</span> Tic Tac Toe
            </div>
          </div>
        </div>
      </nav>
      <main>
        <div className="container tic-tac-toe-main">
          <section className="centered-board">
            {/* Scoreboard */}
            <div className="scoreboard" style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 24,
              marginBottom: 18,
              marginTop: 56,
            }}>
              <ScoreDisplay player="X" score={score.X} accent={COLORS.accent} primary={COLORS.primary}/>
              <span style={{ fontWeight: 600, color: COLORS.secondary, opacity: 0.5, fontSize: '1.25rem' }}>|</span>
              <ScoreDisplay player="O" score={score.O} accent={COLORS.accent} primary={COLORS.primary}/>
            </div>
            {/* Board */}
            <Board 
              board={board}
              onCellClick={handleCellClick}
              winner={winner}
              accent={COLORS.accent}
              primary={COLORS.primary}
              secondary={COLORS.secondary}
            />
            {/* Game status & controls */}
            <div className="controls-and-status" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 18,
              marginTop: 28,
            }}>
              <GameStatus winner={winner} xIsNext={xIsNext} />
              <div className="tic-tac-toe-actions" style={{
                display: 'flex',
                gap: 12,
                justifyContent: 'center',
              }}>
                <button
                  className="btn btn-large"
                  style={{
                    background: COLORS.primary,
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    minWidth: 110,
                  }}
                  onClick={handleRestart}
                  title="New Game"
                >
                  Restart Game
                </button>
                <button
                  className="btn btn-large"
                  style={{
                    background: COLORS.accent,
                    color: COLORS.secondary,
                    fontWeight: 600,
                    border: 'none',
                    borderRadius: 6,
                    minWidth: 110,
                  }}
                  onClick={handleResetAll}
                  title="Reset everything"
                >
                  Reset All
                </button>
              </div>
            </div>
            {/* Credits */}
            <div style={{
              marginTop: 36,
              textAlign: 'center',
              color: COLORS.secondary,
              fontSize: '0.96rem',
              opacity: 0.6,
            }}>
              &copy; {new Date().getFullYear()} Tic Tac Toe. KAVIA minimal React demo.
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/**
 * Score display component
 */
// PUBLIC_INTERFACE
function ScoreDisplay({ player, score, accent, primary }) {
  return (
    <div style={{
      minWidth: 70,
      background: player === 'X' ? accent : primary,
      color: player === 'X' ? '#333' : '#fff',
      borderRadius: 8,
      padding: '10px 18px',
      fontWeight: 700,
      fontSize: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: '0 1px 3px rgba(20,20,20,0.07)',
    }}>
      <div style={{
        fontSize: '1rem',
        letterSpacing: '1.5px',
        marginBottom: 2,
        fontWeight: 400,
        opacity: 0.8
      }}>Player {player}</div>
      <div style={{ fontSize: '2.2rem', fontFamily: 'Inter,Roboto,sans-serif' }}>{score}</div>
    </div>
  );
}

/**
 * Game status display
 */
// PUBLIC_INTERFACE
function GameStatus({ winner, xIsNext }) {
  let msg;
  if (winner === 'X' || winner === 'O') {
    msg = <span>Winner:&nbsp;<strong style={{ color: winner === 'X' ? '#1976D2' : '#FFD600' }}>{winner}</strong></span>;
  } else if (winner === 'draw') {
    msg = <span><strong>It&apos;s a Draw!</strong></span>;
  } else {
    msg = <span>Next turn: <strong style={{ color: xIsNext ? '#1976D2' : '#FFD600' }}>{xIsNext ? 'X' : 'O'}</strong></span>;
  }
  return (
    <div
      style={{
        fontSize: '1.25rem',
        minHeight: '1.5em',
        fontWeight: 500,
        letterSpacing: '0.5px',
        padding: '2px 0',
        color: '#424242',
      }}
      aria-live="polite"
      role="status"
    >{msg}</div>
  );
}

/**
 * Game board component
 */
// PUBLIC_INTERFACE
function Board({ board, onCellClick, winner, accent, primary, secondary }) {
  // Responsive square grid.
  return (
    <div
      className="tic-tac-toe-board"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(64px, 1fr))',
        gridTemplateRows: 'repeat(3, minmax(64px, 1fr))',
        gap: 7,
        width: 'min(90vw, 370px)',
        margin: '0 auto',
        background: '#fff',
        borderRadius: 18,
        boxShadow: '0 2px 16px 2px rgba(26, 48, 87, 0.04)',
        padding: 18,
        userSelect: 'none',
      }}
    >
      {board.map((cell, idx) => (
        <Cell
          key={idx}
          value={cell}
          onClick={() => onCellClick(idx)}
          disabled={!!winner || !!cell}
          highlight={winner === cell && cell !== null}
          accent={accent}
          primary={primary}
          secondary={secondary}
        />
      ))}
    </div>
  );
}

/**
 * Board Cell component
 */
// PUBLIC_INTERFACE
function Cell({ value, onClick, disabled, highlight, accent, primary, secondary }) {
  return (
    <button
      className="tic-tac-toe-cell"
      aria-label={value ? `Cell ${value}` : 'Empty cell'}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        background: highlight
          ? (value === 'X' ? primary : accent)
          : '#f4f6f8',
        color: highlight
          ? (value === 'X' ? '#fff' : '#333')
          : (value === 'X' ? primary : value === 'O' ? accent : secondary),
        fontWeight: highlight ? 900 : 700,
        fontSize: '2.5rem',
        border: `2px solid ${disabled ? '#ddd' : 'rgba(25, 118, 210, 0.23)'}`,
        borderRadius: 12,
        transition: 'background 0.15s, color 0.18s',
        cursor: disabled ? 'default' : 'pointer',
        aspectRatio: '1/1',
        minWidth: 0,
        outline: 'none',
        boxShadow: highlight ? '0 2px 10px #FFD60044' : undefined,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
      }}
    >
      {value}
    </button>
  );
}

export default App;