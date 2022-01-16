// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import React, {useMemo} from 'react'
import {useLocalStorageState} from '../utils'

function Board({squares, status, hasWinner, onClick}) {
  function renderSquare(i) {
    return (
      <button
        className="square"
        onClick={() => onClick(i)}
        disabled={hasWinner}
      >
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

const initialIndex = 1

const useHistoryState = initialValue => {
  const [history, setHistory] = useLocalStorageState('history', [
    {index: initialIndex, value: initialValue},
  ])
  const [currentStep, setCurrentStep] = useLocalStorageState(
    'currentStep',
    history[0],
  )

  function setNextValue(value) {
    const nextStep = {
      index: currentStep.index + 1,
      value,
    }

    setHistory([
      ...history.filter(step => step.index < nextStep.index),
      nextStep,
    ])
    setCurrentStep(nextStep)
  }

  function goToPrevious(
    stepIndex = history[
      history.findIndex(entry => entry.index === currentStep.index) - 1
    ].index,
  ) {
    const nextStep = history.find(step => step.index === stepIndex)
    setCurrentStep(nextStep)
  }

  function goToNext(stepIndex) {
    const historyIndex = history.findIndex(entry => entry.index === stepIndex)

    const currentHistoryIndex =
      historyIndex === -1
        ? history.findIndex(entry => entry.index === currentStep.index) + 1
        : historyIndex

    if (currentHistoryIndex - 1 < history.length) {
      goToPrevious(stepIndex)
    }
  }

  function resetHistory() {
    const initialStep = {index: initialIndex, value: initialValue}

    setCurrentStep(initialStep)
    setHistory([initialStep])
  }

  return [
    currentStep.value,
    setNextValue,
    {
      currentIndex: currentStep.index,
      history,
      goToPrevious,
      goToNext,
      resetHistory,
    },
  ]
}

function Game() {
  const [
    currentSquares,
    setSquares,
    {currentIndex, history, goToPrevious, goToNext, resetHistory},
  ] = useHistoryState(Array(9).fill(null))

  const winner = useMemo(
    () => calculateWinner(currentSquares),
    [currentSquares],
  )
  const nextValue = useMemo(
    () => calculateNextValue(currentSquares),
    [currentSquares],
  )
  const status = useMemo(
    () => calculateStatus(winner, currentSquares, nextValue),
    [currentSquares, winner, nextValue],
  )

  function selectSquare(squareIndex) {
    if (winner || currentSquares[squareIndex]) {
      return
    }
    const nextSquares = [...currentSquares]
    nextSquares[squareIndex] = nextValue

    setSquares(nextSquares)
  }

  function restart() {
    resetHistory()
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          onClick={selectSquare}
          squares={currentSquares}
          hasWinner={winner}
        />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>
          {history.map(entry => {
            const isCurrent = entry.index === currentIndex
            return (
              <li key={entry.index}>
                <button
                  onClick={() => goToPrevious(entry.index)}
                  disabled={isCurrent}
                >
                  Go to step #{entry.index} {isCurrent && '(current)'}
                </button>
              </li>
            )
          })}
        </ol>
        <button onClick={() => goToPrevious()} disabled={history.length <= 1}>
          ⏪ Undo
        </button>
        <button onClick={() => goToNext()} disabled={history.length <= 1}>
          ⏩ Redo
        </button>
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
