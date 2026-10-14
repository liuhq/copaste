import { defineConfig } from "drizzle-kit"

import { DEFAULT_DB_FILE_NAME } from "~/db/client.server"

export default defineConfig({
  schema: "./app/db/schema.server.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DB_FILE_NAME ?? DEFAULT_DB_FILE_NAME,
  },
})
