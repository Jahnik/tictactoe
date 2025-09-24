import express from "express";
import ViteExpress from "vite-express";
import { initialGameState, type Cell } from './src/tictactoe'
import { makeMove } from './src/tictactoe'


const app = express();
app.use(express.json())
var serverGameState = structuredClone(initialGameState)

app.get("/message", (_, res) => res.send("Hello from express!"));

app.get("/game", (_, res) => res.json((serverGameState)));

app.post("/move", (req, res) => {
    const { row, col } = req.body;
    serverGameState = makeMove(serverGameState, row, col, serverGameState.player)
    res.json((serverGameState)) //this doesn't actually do anything??
})

ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));