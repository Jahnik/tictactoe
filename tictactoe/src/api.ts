import type { GameState } from "./tictactoe"


export async function fetchGameState(obj: { id: string; name: string; }): Promise<GameState> {
    const res = await fetch(`/game/${encodeURIComponent(obj.name)}`)
    if (!res.ok) throw new Error(`failed to fetch game ${obj.name}`)
    const game = await res.json() as GameState // TODO: validate instead of typecasting
    return game
}

export async function sendMove(move: { gameState: GameState, row: number, col: number }) {
    console.log("sendMove gameState:", move.gameState)
    console.log("JSON gameState:", move.gameState)
    const res = await fetch('/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(move),
    })

    if (!res.ok) {
        throw new Error('Failed to make move')
    }

    return res.json()
}

export async function createGame() {
    const res = await fetch('/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: "",
    })

    if (!res.ok) {
        throw new Error('Failed to create game')
    }

    return res.json()
}

export async function fetchGameList(): Promise<{ id: string, name: string }[]> {
    const res = await fetch('/games')
    if (!res.ok) throw new Error('failed to fetch gameList')
    return res.json()
}