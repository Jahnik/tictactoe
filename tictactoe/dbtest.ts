// import { db } from "./src/db/connection"
// import { DbGameState, gamesTable } from "./src/db/schema"
// import { GameState, Player } from "./src/tictactoe"

// async function insertRandomGame() {

//     function convertToDB(gameState: GameState): DbGameState {

//         const dbGameState: DbGameState = {
//             id: gameState.id,
//             board: gameState.board.map(outer => outer.map(element => element ?? null)),
//             player: gameState.player,
//             winner: gameState.player ?? null
//         }

//         return dbGameState
//     }

//     const dbTest: GameState = {
//         id: "fingersCrossed",
//         board:
//             [
//                 [undefined, undefined, undefined],
//                 [undefined, undefined, undefined],
//                 [undefined, undefined, undefined]
//             ],
//         player: 'X',
//         winner: undefined
//     }

//     const result = await db.insert(gamesTable).values({
//         id: convertToDB(dbTest).id,       // string UUID
//         state: convertToDB(dbTest),       // your GameStateDb object goes into JSONB column
//         version: 0,          // start optimistic lock counter
//     })

//     console.log(result)

// }

// const consoleTest: GameState = {
//     id: "fingersCrossed",
//     board:
//         [
//             [undefined, undefined, undefined],
//             [undefined, undefined, undefined],
//             [undefined, undefined, undefined]
//         ],
//     player: 'X',
//     winner: undefined
// }

// console.log(consoleTest);
//insertRandomGame()