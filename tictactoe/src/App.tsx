import { useState } from 'react'
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
      {value === null ? "_" : value}
    </div>
  )
}

function App() {
  const [displayGameId, setDisplayGameId] = useState<string | null>(null)
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
      <div className=' flex justify-center min-h-screen'>
        {displayGameId && <Game displayGameId={displayGameId} onReturnToLobby={() => setDisplayGameId(null)} />}
        {!displayGameId &&
          <div className='flex flex-col justify-center'>
            <div className='flex w-full flex-col'>
              <div className='flex justify-center text-5xl'>Game List</div>
              <div className='flex border-2 flex-col justify-center text-5xl'>
                {gameListData().map((id) =>
                  <button className='text-2xl'
                    key={id} onClick={() => handleGameSwitch(id)}> {id}
                  </button>)}
              </div>
            </div>
            <button className='flex justify-center text-2xl' onClick={handleCreate}>
              New Game
            </button>
          </div>}

      </div>
    </>
  )
}

export default App
