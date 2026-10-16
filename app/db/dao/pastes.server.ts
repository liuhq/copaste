import { and, eq, gt, isNull, lte, or } from "drizzle-orm"

import { isPositiveInteger } from "~/lib/predicate"

import { db } from "../client.server"
import { pastesTable } from "../schema.server"

type Paste = typeof pastesTable.$inferSelect
type PasteMut = typeof pastesTable.$inferInsert

export async function create(input: Omit<PasteMut, "ID" | "createdAt" | "updatedAt">) {
  const [paste] = await db.insert(pastesTable).values(input).returning()

  if (!paste) {
    throw new Error("Inserting paste returned no row")
  }

  return paste
}

export async function findActiveBySlug(slug: Paste["slug"]) {
  const paste = await db.query.pastes.findFirst({
    where: {
      slug,
      OR: [{ expiresAt: { isNull: true } }, { expiresAt: { gt: new Date() } }],
    },
  })

  return paste ?? null
}

export function listActiveByOwner({
  ownerID,
  limit,
  offset,
}: {
  ownerID: Paste["ownerID"]
  limit: number
  offset: number
}) {
  if (!isPositiveInteger(limit)) {
    throw RangeError("Invalid limit", { cause: limit })
  }

  if (!Number.isSafeInteger(offset) || offset < 0) {
    throw RangeError("Invalid offset", { cause: offset })
  }

  return db.query.pastes.findMany({
    where: {
      ownerID,
      OR: [{ expiresAt: { isNull: true } }, { expiresAt: { gt: new Date() } }],
    },
    orderBy: {
      createdAt: "desc",
      ID: "desc",
    },
    limit,
    offset,
  })
}

export async function updateByOwner(
  ID: Paste["ID"],
  ownerID: Paste["ownerID"],
  patch: Partial<Pick<PasteMut, "title" | "language" | "content" | "expiresAt">>,
) {
  const [paste] = await db
    .update(pastesTable)
    .set(patch)
    .where(
      and(
        eq(pastesTable.ID, ID),
        eq(pastesTable.ownerID, ownerID),
        or(isNull(pastesTable.expiresAt), gt(pastesTable.expiresAt, new Date())),
      ),
    )
    .returning()

  return paste ?? null
}

export async function deleteByOwner(ID: Paste["ID"], ownerID: Paste["ownerID"]) {
  return await db
    .delete(pastesTable)
    .where(and(eq(pastesTable.ID, ID), eq(pastesTable.ownerID, ownerID)))
    .returning({ ID: pastesTable.ID })
}

export async function deleteExpired(before: Date, limit?: number) {
  if (limit !== undefined && (!Number.isSafeInteger(limit) || limit < 0)) {
    throw new RangeError("Invalid limit", { cause: limit })
  }

  const expired = lte(pastesTable.expiresAt, before)

  if (limit === undefined) {
    return await db.delete(pastesTable).where(expired).returning({ ID: pastesTable.ID })
  }

  if (limit === 0) {
    return []
  }

  return await db.delete(pastesTable).where(expired).limit(limit).returning({ ID: pastesTable.ID })
}
