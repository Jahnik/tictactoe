import { faker } from "@faker-js/faker"

export type Player = "X" | "O"
export type Cell = Player | null
export type Winner = Player | "Tie" | null

export type GameState = {
    id: string
    name: string
    board: Cell[][],
    player: Player,
    winner: Winner,
}

export const initialGameState: GameState = {
    id: "fancyUUID",
    name: "faker-name-1",
    board:
        [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ],
    player: "X",
    winner: null
}

export function makeNewGame(): GameState {
    const newGame = structuredClone(initialGameState)
    newGame.id = crypto.randomUUID()
    newGame.name = faker.helpers.slugify(
        `${faker.word.adjective()}-${faker.word.noun()}-${faker.number.int({ min: 0, max: 999 })}`
    ).toLowerCase()

    return newGame
}

function checkTie(gameState: GameState): boolean {
    return gameState.board.flat().every(cell => cell !== null)
}

function checkRowWin(gameState: GameState, player: Player): boolean {
    for (let i = 0; i <= 2; i++) {
        if (gameState.board[i].map(val => val === player).reduce((acc, curr) => { return acc && curr }, true)) {
            return true
        }
    }
    return false
}

function checkColWin(gameState: GameState, player: Player): boolean {
    for (let i = 0; i <= 2; i++) {
        if ((gameState.board[0][i] === player) && (gameState.board[1][i] === player) && (gameState.board[2][i] === player)) {
            return true
        }
    }
    return false
}

function checkDiagWin(gameState: GameState, player: Player): boolean {
    for (let i = 0; i <= 2; i++) {
        if ((gameState.board[0][0] === player) && (gameState.board[1][1] === player) && (gameState.board[2][2] === player)) {
            return true
        } else if ((gameState.board[0][2] === player) && (gameState.board[1][1] === player) && (gameState.board[2][0] === player)) {
            return true
        }
    }
    return false
}


export function makeMove(gameState: GameState, row: number, col: number, player: Player): GameState {
    const newState = structuredClone(gameState)

    if (newState.winner) {
        return newState
    }

    if (newState.board[row][col] !== null) {
        return newState
    }
    newState.board[row][col] = player

    if (checkRowWin(newState, newState.player)) {
        newState.winner = player
    } else if (checkColWin(newState, newState.player)) {
        newState.winner = player
    } else if (checkDiagWin(newState, newState.player)) {
        newState.winner = player
    } else if (checkTie(newState)) {
        newState.winner = "Tie"
    }

    newState.player === "X" ? newState.player = "O" : newState.player = "X"
    return newState
}