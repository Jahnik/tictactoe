import { useState, useEffect } from 'react'
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
  const [displayGameId, setDisplayGameId] = useState<{ id: string; name: string; } | null>(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    console.log('checking url')
    if (window.location.href.includes("/showGame/")) {
      const fullUrl = window.location.href
      const sub = "/showGame/"
      const index = fullUrl.indexOf(sub)
      const result = index !== -1 ? fullUrl.slice(index + sub.length) : "";
      console.log(result);
      const callIt = () => setDisplayGameId({ id: '', name: result })
      callIt();
    }
  }, []); // Does not run again (except once in development)

  function handleGameSwitch(obj: { id: string; name: string; }) {
    setDisplayGameId(obj)
  }

  const { data: fetchedGameList, isLoading: isGameListLoading, error: gameListError } = useQuery({
    queryKey: ['gameList'],
    queryFn: fetchGameList
  })

  const gameListData = (): { id: string; name: string; }[] => {
    if (isGameListLoading) return [{ id: "Game list is Loading", name: "Game list is Loading" }]
    if (gameListError) return [{ id: "Game list Error", name: "Game list Error" }]
    if (fetchedGameList) return fetchedGameList
    return [{ id: "This is also a problem", name: "This is also a problem" }]
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
              <div className='flex border-2 p-5 flex-col justify-center text-5xl'>
                {gameListData().map((obj) =>
                  <button className='text-2xl' key={obj.id} onClick={() => handleGameSwitch({ id: obj.id, name: obj.name })}>
                    {obj.name}
                  </button>)}
              </div>
              <div>{/*JSON.stringify(window.location)*/}</div>
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