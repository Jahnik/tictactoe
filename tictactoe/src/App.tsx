import React, { useState, type FC } from 'react'
import './App.css'
import './index.css'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { type Cell } from './tictactoe'
import { fetchGameState, sendMove, createGame, fetchGameList } from './api'

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
  const [displayGameId, setDisplayGameId] = useState("fancyUUID")

  function handleGameSwitch(id: string) {
    setDisplayGameId(id)
  }

  const queryClient = useQueryClient()

  const { data: fetchedGameList, isLoading: isGameListLoading, error: gameListError } = useQuery({
    queryKey: ['gameList'],
    queryFn: fetchGameList
  })

  const gameListData = (): string[] => {
    if (isGameListLoading) return ["Game list is Loading"]
    if (gameListError) return ["Game List Error"]
    if (fetchedGameList) return fetchedGameList
    return ["This is also a problem"]
  }


  const createGameMutation = useMutation({
    mutationFn: createGame,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gameList'] })
    }
  })

  function handleCreate() {
    createGameMutation.mutate()
  }

  const { data: fetchedGameState, isLoading: gameStateLoading, error: gameStateError } = useQuery({
    queryKey: ['game', displayGameId],
    queryFn: () => fetchGameState(displayGameId),
  })
  //const [game, setGame] = useState(initialGameState)

  const gameStateMutation = useMutation({
    mutationFn: sendMove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game'] })
    }
  })

  function handleMove(id: string, row: number, col: number) {
    //game.winner === undefined ? setGame(makeMove(game, row, col, game.player)) : setGame(game)
    if (!fetchedGameState) return
    if (fetchedGameState.board[row][col]) return

    gameStateMutation.mutate({ id, row, col })
  }

  if (gameStateLoading) return <p> Loading...</p>
  if (gameStateError) {
    return <p> Error loading game: {JSON.stringify(gameStateError)}</p>
  }
  if (fetchedGameState) {
    const game = fetchedGameState
    console.log(fetchedGameState)
    return (
      <>
        <div className=' flex border w-full justify-evenly basis-1/2'>
          <div>
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
              <Cell value={game.board[0][0]} onClick={() => { handleMove(game.id, 0, 0) }}></Cell>
              <Cell value={game.board[0][1]} onClick={() => { handleMove(game.id, 0, 1) }}></Cell>
              <Cell value={game.board[0][2]} onClick={() => { handleMove(game.id, 0, 2) }}></Cell>
            </Row>
            <Row>
              <Cell value={game.board[1][0]} onClick={() => { handleMove(game.id, 1, 0) }}></Cell>
              <Cell value={game.board[1][1]} onClick={() => { handleMove(game.id, 1, 1) }}></Cell>
              <Cell value={game.board[1][2]} onClick={() => { handleMove(game.id, 1, 2) }}></Cell>
            </Row>
            <Row>
              <Cell value={game.board[2][0]} onClick={() => { handleMove(game.id, 2, 0) }}></Cell>
              <Cell value={game.board[2][1]} onClick={() => { handleMove(game.id, 2, 1) }}></Cell>
              <Cell value={game.board[2][2]} onClick={() => { handleMove(game.id, 2, 2) }}></Cell>
            </Row>
            <h1 className="flex text-3xl justify-center">
              The Winner is: {game.winner === undefined ? "TBD!" : game.winner}
            </h1>
          </div>

          <div className='flex flex-col'>
            Game List
            {gameListData().map((id) => <button key={id} onClick={() => handleGameSwitch(id)}> {id} </button>)}
          </div>
        </div>
        <button onClick={handleCreate}>
          New Game
        </button>
      </>
    )
  }
}

export default App
