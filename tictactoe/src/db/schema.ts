import { integer, pgTable, jsonb, uuid, timestamp } from "drizzle-orm/pg-core";

export type DbGameState = {
    id: string;
    name: string;
    board: (('X' | 'O' | null)[])[];
    player: 'X' | 'O';
    winner: 'X' | 'O' | 'Tie' | null;
}

export const gamesTable = pgTable("games", {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    state: jsonb('state').notNull().$type<DbGameState>(),
    version: integer('version').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
})