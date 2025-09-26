import { integer, pgTable, varchar, jsonb } from "drizzle-orm/pg-core";

export type DbGameState = {
    id: string;
    board: (('X' | 'O' | null)[])[];
    player: 'X' | 'O';
    winner: 'X' | 'O' | 'Tie' | null;
}

export const gamesTable = pgTable("games", {
    id: varchar('id'),
    state: jsonb('state').$type<DbGameState>(),
    version: integer('version').default(0)
})