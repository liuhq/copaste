import { db } from "../client.server"
import { usersTable } from "../schema.server"

type User = typeof usersTable.$inferSelect
type UserMut = typeof usersTable.$inferInsert

export function findByID(ID: User["ID"]) {
  return db.query.users.findFirst({
    where: {
      ID,
    },
  })
}

export function findByOIDCIdentity(
  oidcIssuer: User["oidcIssuer"],
  oidcSubject: User["oidcSubject"],
) {
  return db.query.users.findFirst({
    where: {
      oidcIssuer,
      oidcSubject,
    },
  })
}

export async function upsertByOIDCIdentity({
  oidcIssuer,
  oidcSubject,
  displayName,
}: Pick<UserMut, "oidcIssuer" | "oidcSubject" | "displayName">) {
  const [user] = await db
    .insert(usersTable)
    .values({ oidcIssuer, oidcSubject, displayName })
    .onConflictDoUpdate({
      target: [usersTable.oidcIssuer, usersTable.oidcSubject],
      set: { displayName },
    })
    .returning()

  if (!user) {
    throw new Error("Upserting user returned no row")
  }

  return user
}
