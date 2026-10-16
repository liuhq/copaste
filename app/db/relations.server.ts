import { defineRelations } from "drizzle-orm"

import { pastesTable, usersTable } from "./schema.server"

export const relations = defineRelations({ users: usersTable, pastes: pastesTable }, (r) => ({
  users: {
    pastes: r.many.pastes(),
  },
  pastes: {
    owner: r.one.users({
      from: r.pastes.ownerID,
      to: r.users.ID,
      optional: false,
    }),
  },
}))
