// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import React, { useMemo, useState } from 'react'
import { useLocalStorageState } from '../utils';

function Board({ squares, status, hasWinner, onClick }) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)} disabled={hasWinner}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      {/* 🐨 put the status in the div below */}
      <div className="status">{status}</div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
    // 🐨 squares is the state for this component. Add useState for squares
  const [squares, setSquares] = useLocalStorageState('squares', Array(9).fill(null));
  const [history, setHistory] = useState([]);
  const [currentStep, setCurrentStep] = useState({ stepIndex: history.length, squares });

  const winner = useMemo(() => calculateWinner(squares), [squares]);
  const nextValue = useMemo(() => calculateNextValue(squares), [squares]);
  const status = useMemo(() => calculateStatus(winner, squares, nextValue), [squares, winner, nextValue]);

  function selectSquare(squareIndex) {
    if (winner || squares[squareIndex]) {
      return;
    }
    const nextSquares = [...squares];
    nextSquares[squareIndex] = nextValue;
    
    setSquares(nextSquares);
    const nextStep = { stepIndex: currentStep.stepIndex + 1, squares: nextSquares };
    setHistory([...history.filter(step => step.stepIndex < nextStep.stepIndex), nextStep]);
    setCurrentStep(nextStep);
  }

  function setStep(step) {
    setCurrentStep(step);
    setSquares(step.squares);
  }

  function restart() {
    const initialSquares = Array(9).fill(null);
    setSquares(initialSquares);
    setCurrentStep({ stepIndex: 0, squares: initialSquares });
    setHistory([]);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={squares} hasWinner={winner} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{
          history.map((step) => 
            <li key={step.stepIndex}>
              <button onClick={() => setStep(step)}>Go to step {step.stepIndex}</button>
            </li>
          )}
        </ol>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
