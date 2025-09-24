import type { GameState } from "./tictactoe"


export async function fetchGameState(id: string): Promise<GameState> {
    //add support for ids to this
    const res = await fetch(`/game/${encodeURIComponent(id)}`)
    if (!res.ok) throw new Error('failed to fetch game')
    const game = await res.json() as GameState // TODO: validate instead of typecasting
    return game
}

export async function sendMove(move: { id: string, row: number, col: number }) {
    //add support for ids to this
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

export async function fetchGameList(): Promise<string[]> {
    const res = await fetch('/games')
    if (!res.ok) throw new Error('failed to fetch gameList')
    return res.json()
}