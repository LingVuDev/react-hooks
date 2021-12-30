// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import React, { useMemo } from 'react'
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

const initialIndex = 1;

function Game() {
  const [history, setHistory] = useLocalStorageState('history', [{ stepIndex: initialIndex, squares: Array(9).fill(null)}]);
  const [currentStep, setCurrentStep] = useLocalStorageState('currentStep', history[0]);

  const winner = useMemo(() => calculateWinner(currentStep.squares), [currentStep.squares]);
  const nextValue = useMemo(() => calculateNextValue(currentStep.squares), [currentStep.squares]);
  const status = useMemo(() => calculateStatus(winner, currentStep.squares, nextValue), [currentStep.squares, winner, nextValue]);

  function selectSquare(squareIndex) {
    if (winner || currentStep.squares[squareIndex]) {
      return;
    }
    const nextSquares = [...currentStep.squares];
    nextSquares[squareIndex] = nextValue;
    
    const nextStep = { stepIndex: currentStep.stepIndex + 1, squares: nextSquares };
    setHistory([...history.filter(step => step.stepIndex < nextStep.stepIndex), nextStep]);
    setCurrentStep(nextStep);
  }

  function setStep(step) {
    setCurrentStep(step);
  }

  function restart() {
    const initialStep = { stepIndex: initialIndex, squares: Array(9).fill(null) };
    setCurrentStep(initialStep);
    setHistory([initialStep]);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={currentStep.squares} hasWinner={winner} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{
          history.map((step) => {
            const isCurrent = step.stepIndex === currentStep.stepIndex;
            return (
              <li key={step.stepIndex}>
                <button onClick={() => setStep(step)} disabled={isCurrent}>Go to step #{step.stepIndex} {isCurrent && '(current)'}</button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  )
}

function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

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
