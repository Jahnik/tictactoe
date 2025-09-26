export type Player = "X" | "O"
export type Cell = Player | undefined
export type Winner = Player | "Tie" | undefined

export type GameState = {
    id: string
    board: Cell[][],
    player: Player,
    winner: Winner,
}

export const initialGameState: GameState = {
    id: "fancyUUID",
    board:
        [
            [undefined, undefined, undefined],
            [undefined, undefined, undefined],
            [undefined, undefined, undefined]
        ],
    player: "X",
    winner: undefined
}

export function makeNewGame(): GameState {
    const newGame = structuredClone(initialGameState)
    newGame.id = crypto.randomUUID()
    return newGame
}

function checkTie(gameState: GameState): boolean {
    //CONVERTED UNDEFINED TO NULL HERE
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
    console.log('in makeMove function, gameState:', gameState)

    const newState = structuredClone(gameState)
    console.log('in makeMove function, newState', newState)

    if (newState.winner) {
        return newState
    }

    //CONVERTED UNDEFINED TO NULL HERE
    if (newState.board[row][col] !== null) {
        return newState
    }
    newState.board[row][col] = player

    if (checkTie(newState)) {
        newState.winner = "Tie"
    } else if (checkRowWin(newState, newState.player)) {
        newState.winner = player
    } else if (checkColWin(newState, newState.player)) {
        newState.winner = player
    } else if (checkDiagWin(newState, newState.player)) {
        newState.winner = player
    }

    newState.player === "X" ? newState.player = "O" : newState.player = "X"
    return newState
}
