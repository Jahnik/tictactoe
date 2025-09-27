import { integer, pgTable, jsonb, uuid, timestamp, varchar } from "drizzle-orm/pg-core";

export type DbGameState = {
    id: string;
    name: string;
    board: (('X' | 'O' | null)[])[];
    player: 'X' | 'O';
    winner: 'X' | 'O' | 'Tie' | null;
}

export const gamesTable = pgTable("games", {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull().unique(),
    state: jsonb('state').notNull().$type<DbGameState>(),
    version: integer('version').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
})