import { findUserSummaryByID } from "~/db/dao/users.server"

import { getSessionUserID } from "./session.server"

export async function getCurrentUser(request: Request) {
  const userID = await getSessionUserID(request)

  if (userID === null) {
    return null
  }

  return (await findUserSummaryByID(userID)) ?? null
}
