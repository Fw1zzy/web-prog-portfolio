// src/components/TicTacToe.jsx
import { useState, useEffect, useCallback } from 'react'

const WINS = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6],
]

function checkWinState(board) {
  for (const [a, b, c] of WINS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return { winner: board[a], combo: [a,b,c] }
  }
  return null
}

function minimax(board, isMaximising) {
  const result = checkWinState(board)
  if (result?.winner === 'O') return { score: 10 }
  if (result?.winner === 'X') return { score: -10 }
  if (board.every(Boolean)) return { score: 0 }

  let bestMove = { score: isMaximising ? -Infinity : Infinity, index: -1 }

  board.forEach((cell, i) => {
    if (cell !== null) return
    board[i] = isMaximising ? 'O' : 'X'
    const move = minimax(board, !isMaximising)
    move.index = i
    board[i] = null
    if (isMaximising ? move.score > bestMove.score : move.score < bestMove.score) {
      bestMove = move
    }
  })
  return bestMove
}

function TicTacToe() {
  const [state, setState] = useState(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState('X')
  const [gameOver, setGameOver] = useState(false)
  const [status, setStatus] = useState("X's turn")
  const [statusClass, setStatusClass] = useState('ttt-status')
  const [winCombo, setWinCombo] = useState([])
  const [aiMode, setAiMode] = useState(false)
  const [aiThinking, setAiThinking] = useState(false)

  const reset = useCallback(() => {
    setState(Array(9).fill(null))
    setCurrentPlayer('X')
    setGameOver(false)
    setStatus("X's turn")
    setStatusClass('ttt-status')
    setWinCombo([])
    setAiThinking(false)
  }, [])

  const endGame = useCallback((board, result) => {
    setGameOver(true)
    if (result) {
      setWinCombo(result.combo)
      setStatus(`${result.winner} wins!`)
      setStatusClass('ttt-status win')
    } else {
      setStatus("It's a draw!")
      setStatusClass('ttt-status draw')
    }
  }, [])

  const applyMove = useCallback((boardSnapshot, index, player) => {
    const next = [...boardSnapshot]
    next[index] = player
    setState(next)
    const result = checkWinState(next)
    if (result || next.every(Boolean)) {
      endGame(next, result)
      return { next, done: true }
    }
    return { next, done: false }
  }, [endGame])

  const makeMove = useCallback((index) => {
    if (gameOver || state[index] || aiThinking) return
    const { next, done } = applyMove(state, index, currentPlayer)
    if (!done) {
      const nextPlayer = currentPlayer === 'X' ? 'O' : 'X'
      setCurrentPlayer(nextPlayer)
      setStatus(`${nextPlayer}'s turn`)
      if (aiMode && nextPlayer === 'O') {
        setAiThinking(true)
        setTimeout(() => {
          const best = minimax([...next], true)
          const { done: aiDone } = applyMove(next, best.index, 'O')
          if (!aiDone) {
            setCurrentPlayer('X')
            setStatus("X's turn")
          }
          setAiThinking(false)
        }, 340)
      }
    }
  }, [gameOver, state, aiThinking, currentPlayer, aiMode, applyMove])

  const toggleAI = () => {
    setAiMode(prev => !prev)
    reset()
  }

  return (
    <section className="fun-section">
      <h3 className="h3 section-title">Take a Break!</h3>
      <div className="game-card">
        <ion-icon name="game-controller-outline" className="game-icon"></ion-icon>
        <h4 className="h4">Tic Tac Toe</h4>
        <p className={statusClass}>{status}</p>

        <div className="ttt-board">
          {state.map((cell, i) => (
            <button
              key={i}
              className={[
                'ttt-cell',
                cell ? cell.toLowerCase() : '',
                winCombo.includes(i) ? 'winner' : '',
              ].join(' ').trim()}
              onClick={() => makeMove(i)}
              disabled={gameOver || !!cell || aiThinking}
              aria-label={`Row ${Math.floor(i/3)+1} Column ${(i%3)+1}`}
            >
              {cell || ''}
            </button>
          ))}
        </div>

        <div className="ttt-controls">
          <button className="ttt-btn" onClick={reset}>
            <ion-icon name="refresh-outline"></ion-icon>
            Restart
          </button>
          <button
            className={`ttt-btn ttt-btn--vs${aiMode ? ' active' : ''}`}
            onClick={toggleAI}
          >
            {aiMode ? 'vs AI  ✓' : 'vs AI'}
          </button>
        </div>
      </div>
    </section>
  )
}

export default TicTacToe
