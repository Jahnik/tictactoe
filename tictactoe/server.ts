import express from "express";
import ViteExpress from "vite-express";
import { initialGameState, makeNewGame, type Cell, type GameState } from './src/tictactoe'
import { makeMove } from './src/tictactoe'
import { db } from './src/db/connection.ts'
import { DbGameState, gamesTable } from './src/db/schema.ts'
import { eq } from "drizzle-orm";

const app = express();
app.use(express.json())

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err)
    res.status(500).json({ message: 'Internal Server Error' })
})


function convertToDB(gameState: GameState): DbGameState {
    const dbGameState: DbGameState = {
        id: gameState.id,
        board: gameState.board.map(outer => outer.map(element => element ?? null)),
        player: gameState.player,
        winner: gameState.winner ?? null
    }

    return dbGameState
}

function convertFromDB(dbGameState: DbGameState): GameState {
    const gameState: GameState = {
        id: dbGameState.id,
        board: dbGameState.board.map(outer => outer.map(element => element ?? undefined)),
        player: dbGameState.player,
        winner: dbGameState.winner ?? undefined
    }
    return gameState
}

async function insertGame(gameState: GameState) {
    return db.insert(gamesTable).values({
        id: convertToDB(gameState).id,       // string UUID
        state: convertToDB(gameState),       // gameStateDb object goes into JSONB column
        version: 0,          // start optimistic lock counter
    }).returning()
}

async function updateGame(gameState: GameState, row: number, col: number) {
    const updatedGameState = makeMove(gameState, row, col, gameState.player)

    const updatedDbGameState = convertToDB(updatedGameState)

    return db.update(gamesTable).set(
        { state: updatedDbGameState }
    ).where(eq(gamesTable.id, gameState.id));
}

async function selectGameList() {
    const gameListObject = await db.select({ id: gamesTable.id }).from(gamesTable)
    const gameList = gameListObject.map(r => r.id)
    return gameList
}

async function selectGame(id: string) {
    const [dbGame] = await db.select().from(gamesTable).where(eq(gamesTable.id, id));
    if (dbGame.state) {
        return convertFromDB(dbGame.state)
    }
}



app.get("/game/:id", async (req, res, next) => {
    const { id } = req.params
    try {
        const game = await selectGame(id);
        return res.json(game)
    } catch (err) {
        next(err)
    }

});

app.get("/games", async (_, res, next) => {
    try {
        const gameList = await selectGameList();
        return res.json(gameList)
    } catch (err) {
        next(err)
    }


});

app.post("/move", async (req, res, next) => {
    const { gameState, row, col } = req.body;

    try {
        const updateFinished = await updateGame(gameState, row, col);
        return res.json(updateFinished)
    } catch (err) {
        next(err)
    }
})

app.post("/create", async (req, res, next) => {
    const newServerGame = makeNewGame()

    try {
        const insertionFinished = await insertGame(newServerGame);
        return res.json(insertionFinished)
    } catch (err) {
        next(err)
    }

})


ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));