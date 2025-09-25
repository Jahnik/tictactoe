import express from "express";
import ViteExpress from "vite-express";
import { initialGameState, makeNewGame, type Cell, type GameState } from './src/tictactoe'
import { makeMove } from './src/tictactoe'

const app = express();
app.use(express.json())


var serverGameState = structuredClone(initialGameState)
const serverGames = new Map<string, GameState>()
//serverGames.set("fancyUUID", serverGameState)

app.get("/message", (_, res) => res.send("Hello from express!"));

app.get("/game/:id", (req, res) => {
    const { id } = req.params
    res.json((serverGames.get(id)))
});

app.get("/games", (_, res) => {
    const gameList = [...serverGames.keys()]
    res.json(gameList)
});

app.post("/move", (req, res) => {
    const { id, row, col } = req.body;
    //serverGameState = makeMove(serverGameState, row, col, serverGameState.player)
    const selectedGame = serverGames.get(id)
    if (!selectedGame) return res.status(404).json({ message: 'Game not found' })

    serverGames.set(selectedGame.id, makeMove(selectedGame, row, col, selectedGame.player))
    res.json((serverGameState)) //this doesn't actually do anything??
})

app.post("/create", (req, res) => {
    const newServerGame = makeNewGame()
    serverGames.set(newServerGame.id, newServerGame)
    res.json((serverGameState)) //this doesn't actually do anything??
})

ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));