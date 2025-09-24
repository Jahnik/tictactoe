import React, { useState, type FC } from 'react'
import './App.css'
import './index.css'
import { useQuery, useMutation, QueryClient, useQueryClient } from '@tanstack/react-query'
import { initialGameState, type Cell } from './tictactoe'
import { makeMove } from './tictactoe'
import { fetchGame, sendMove } from './api'

type CellProps = {
  value: Cell
  onClick: () => void
}

const Cell = ({ value, onClick }: CellProps) => {
  return (
    <div className="flex-1 aspect-square border flex items-center justify-center text-8xl rounded-2xl" onClick={onClick}>
      {value === undefined ? "_" : value}
    </div>
  )
}

const Row = (props: React.PropsWithChildren) => {
  return (
    <div className='flex'>
      {props.children}
    </div>
  )
}



function App() {
  const queryClient = useQueryClient()

  const { data: fetchedGameState, isLoading, error } = useQuery({
    queryKey: ['game'],
    queryFn: fetchGame
  })
  //const [game, setGame] = useState(initialGameState)

  const gameMutation = useMutation({
    mutationFn: sendMove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game'] })
    }
  })

  function handleMove(row: number, col: number) {
    //game.winner === undefined ? setGame(makeMove(game, row, col, game.player)) : setGame(game)
    if (!fetchedGameState) return
    if (fetchedGameState.board[row][col]) return

    gameMutation.mutate({ row, col })
  }

  if (isLoading) return <p> Loading...</p>
  if (error) return <p> Error loading game</p>
  if (fetchedGameState) {
    const game = fetchedGameState
    return (
      <>
        <h1 className="text-3xl">
          This is my Tic Tac Toe Board!
        </h1>
        <Row>
          {/* {game.board[0].map((cell, index) => {
            return <Cell value={cell} onClick={() => {
              const row = 0
              const col = index
            }}/>
          })} */}
          <Cell value={game.board[0][0]} onClick={() => { handleMove(0, 0) }}></Cell>
          <Cell value={game.board[0][1]} onClick={() => { handleMove(0, 1) }}></Cell>
          <Cell value={game.board[0][2]} onClick={() => { handleMove(0, 2) }}></Cell>
        </Row>
        <Row>
          <Cell value={game.board[1][0]} onClick={() => { handleMove(1, 0) }}></Cell>
          <Cell value={game.board[1][1]} onClick={() => { handleMove(1, 1) }}></Cell>
          <Cell value={game.board[1][2]} onClick={() => { handleMove(1, 2) }}></Cell>
        </Row>
        <Row>
          <Cell value={game.board[2][0]} onClick={() => { handleMove(2, 0) }}></Cell>
          <Cell value={game.board[2][1]} onClick={() => { handleMove(2, 1) }}></Cell>
          <Cell value={game.board[2][2]} onClick={() => { handleMove(2, 2) }}></Cell>
        </Row>
        <h1 className="text-3xl">
          The Winner is: {game.winner === undefined ? "TBD!" : game.winner}
        </h1>
      </>
    )
  }
}

export default App
