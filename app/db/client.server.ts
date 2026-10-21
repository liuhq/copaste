import { mkdirSync } from "node:fs"
import { dirname, resolve } from "node:path"

import { drizzle } from "drizzle-orm/better-sqlite3"

import { readEnv } from "~/lib/env.server"

import { relations } from "./relations.server"

export const DEFAULT_DB_FILE_NAME = "copaste.db"

const dbFileName = resolve(readEnv("DB_FILE_NAME", DEFAULT_DB_FILE_NAME))

const createDatabase = () => {
  mkdirSync(dirname(dbFileName), { recursive: true })

  const db = drizzle({
    connection: {
      source: dbFileName,
      timeout: 5000,
    },
    relations,
  })

  try {
    db.$client.pragma("journal_mode = WAL")
    db.$client.pragma("foreign_keys = ON")
    db.$client.pragma("synchronous = FULL")

    return db
  } catch (err) {
    db.$client.close()
    throw err
  }
}

declare global {
  var copasteDB: ReturnType<typeof createDatabase> | undefined
}

// Reuse the database connection across development HMR
export const db = globalThis.copasteDB ?? createDatabase()

if (process.env.NODE_ENV !== "production") {
  globalThis.copasteDB = db
}
