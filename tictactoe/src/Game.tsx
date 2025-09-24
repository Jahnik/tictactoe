import React from 'react'
import './App.css'
import './index.css'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { type Cell } from './tictactoe'
import { fetchGameState, sendMove } from './api'

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

type GameProps = {
    displayGameId: string
    onReturnToLobby: () => void
}

function Game({ displayGameId, onReturnToLobby }: GameProps) {
    const queryClient = useQueryClient()

    const { data: game, isLoading: gameStateLoading, error: gameStateError } = useQuery({
        queryKey: ['game', displayGameId],
        queryFn: () => fetchGameState(displayGameId),
    })

    const gameStateMutation = useMutation({
        mutationFn: sendMove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['game'] })
        }
    })

    function handleMove(id: string, row: number, col: number) {
        //game.winner === undefined ? setGame(makeMove(game, row, col, game.player)) : setGame(game)
        if (!game) return
        if (game.board[row][col]) return

        gameStateMutation.mutate({ id, row, col })
    }

    if (gameStateLoading) return <p> Loading...</p>
    if (gameStateError || !game) {
        return <p> Error loading game: {JSON.stringify(gameStateError)}</p>
    }

    return (
        <div>
            <h1 className="text-3xl">
                This is my Tic Tac Toe Board!
            </h1>
            <Row>
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
            <button onClick={onReturnToLobby}>Return to Lobby</button>
        </div>
    )
}

export default Game
