import { redirect } from "react-router"

import { authSessionStorage } from "~/lib/auth/session.server"

import type { Route } from "./+types/auth.logout"

export async function action({ request }: Route.ActionArgs) {
  const authSession = await authSessionStorage.getSession(request.headers.get("Cookie"))

  return redirect("/", {
    headers: {
      "Set-Cookie": await authSessionStorage.destroySession(authSession),
    },
  })
}
