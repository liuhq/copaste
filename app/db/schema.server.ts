import { sql, isNotNull } from "drizzle-orm"
import { sqliteTable, text, integer, index, uniqueIndex, check } from "drizzle-orm/sqlite-core"

const baseColumns = (autoIncrement = false) => ({
  ID: integer("id").primaryKey({ autoIncrement }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`),
})

export const usersTable = sqliteTable(
  "users",
  {
    ...baseColumns(true),

    oidcIssuer: text("oidc_issuer").notNull(),
    oidcSubject: text("oidc_subject").notNull(),
    displayName: text("display_name"),
  },
  (t) => [uniqueIndex("users_oidc_identity_idx").on(t.oidcIssuer, t.oidcSubject)],
)

export const pastesTable = sqliteTable(
  "pastes",
  {
    ...baseColumns(),

    slug: text().notNull().unique(),
    ownerID: integer("owner_id")
      .notNull()
      .references(() => usersTable.ID, { onDelete: "cascade" }),
    title: text(),
    language: text(),
    content: text().notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp" }),
  },
  (t) => [
    index("pastes_owner_created_idx").on(t.ownerID, t.createdAt, t.ID),
    index("pastes_expires_at_idx").on(t.expiresAt).where(isNotNull(t.expiresAt)),
    check(
      `pastes_expires_at_check`,
      sql`${t.expiresAt} IS NULL OR ${t.expiresAt} > ${t.createdAt}`,
    ),
  ],
)
