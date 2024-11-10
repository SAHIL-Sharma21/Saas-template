//drizzle schema for our app.

import { boolean, date, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable("users", {
    id: text("id").primaryKey().unique().notNull(),
    email: text("email").unique().notNull(),
    isSubscribed: boolean("isSubscribed").notNull().default(false),
    subscriptionEnds: date("subscriptionEnds"),
    createdAt: timestamp("createdAt").notNull().default(new Date()),
    updatedAt: timestamp("updatedAt").notNull().$onUpdate(() => new Date()),    
});

export const todos = pgTable("todos", {
    id: text("id").primaryKey().unique().notNull(),
    title: text("title").notNull(),
    completed: boolean("completed").notNull().default(false),
    userId: text("userId").notNull().references(() => users.id, {onDelete: "cascade"}),
    createdAt: timestamp("createdAt").notNull().default(new Date()),
    updatedAt: timestamp("updatedAt").notNull().$onUpdate(() => new Date()),
});