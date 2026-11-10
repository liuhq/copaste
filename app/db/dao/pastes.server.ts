import { and, eq, gt, isNull, lte, or } from "drizzle-orm"
import { nanoid } from "nanoid"

import { isPositiveInteger } from "~/lib/predicate"

import { db } from "../client.server"
import { pastesTable } from "../schema.server"

type Paste = typeof pastesTable.$inferSelect
type PasteMut = typeof pastesTable.$inferInsert

export async function createPaste(
  input: Omit<PasteMut, "ID" | "slug" | "createdAt" | "updatedAt">,
) {
  const maxAttempts = 5
  let attempts = 0

  while (attempts++ < maxAttempts) {
    // oxlint-disable-next-line no-await-in-loop
    const [paste] = await db
      .insert(pastesTable)
      .values({
        ...input,
        slug: nanoid(10),
      })
      .onConflictDoNothing({ target: pastesTable.slug })
      .returning()

    if (paste) {
      return paste
    }
  }

  throw new Error(`Failed to create paste after ${maxAttempts} slug generation attempts`)
}

export async function findActivePasteBySlug(slug: Paste["slug"]) {
  const paste = await db.query.pastes.findFirst({
    where: {
      slug,
      OR: [{ expiresAt: { isNull: true } }, { expiresAt: { gt: new Date() } }],
    },
  })

  return paste ?? null
}

export function listActivePastesByOwner({
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

export async function updatePasteBySlugOwner(
  slug: Paste["slug"],
  ownerID: Paste["ownerID"],
  patch: Partial<Pick<PasteMut, "title" | "language" | "content" | "expiresAt">>,
) {
  const [paste] = await db
    .update(pastesTable)
    .set(patch)
    .where(
      and(
        eq(pastesTable.slug, slug),
        eq(pastesTable.ownerID, ownerID),
        or(isNull(pastesTable.expiresAt), gt(pastesTable.expiresAt, new Date())),
      ),
    )
    .returning()

  return paste ?? null
}

export async function deletePasteByOwner(slug: Paste["slug"], ownerID: Paste["ownerID"]) {
  return await db
    .delete(pastesTable)
    .where(and(eq(pastesTable.slug, slug), eq(pastesTable.ownerID, ownerID)))
    .returning({ slug: pastesTable.slug })
}

export async function deleteExpiredPastes(before: Date, limit?: number) {
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
