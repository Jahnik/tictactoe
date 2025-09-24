import { useState, type SetStateAction } from 'react'
import './App.css'
import './index.css'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { type Cell } from './tictactoe'
import { createGame, fetchGameList } from './api'
import Game from './Game'

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

function App() {
  const [displayGameId, setDisplayGameId] = useState<string | undefined>(undefined)
  const queryClient = useQueryClient()

  function handleGameSwitch(id: string) {
    setDisplayGameId(id)
  }

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
  return (
    <>
      <div className=' flex border w-full justify-evenly'>
        {displayGameId && <Game displayGameId={displayGameId} onReturnToLobby={() => setDisplayGameId(undefined)} />}
        {!displayGameId &&
          <div>
            <div className='flex flex-col'>
              Game List
              {gameListData().map((id) => <button key={id} onClick={() => handleGameSwitch(id)}> {id} </button>)}
            </div>
            <button onClick={handleCreate}>
              New Game
            </button>
          </div>}

      </div>
    </>
  )
}

export default App
