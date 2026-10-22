import { redirect } from "react-router"

import { upsertByOIDCIdentity } from "~/db/dao/users.server"
import { verifyAuthorization } from "~/lib/auth/oidc.server"
import { oidcSessionStorage, authSessionStorage } from "~/lib/auth/session.server"

import type { Route } from "./+types/auth.callback"

export async function loader({ request }: Route.LoaderArgs) {
  const oidcSession = await oidcSessionStorage.getSession(request.headers.get("Cookie"))

  const codeVerifier = oidcSession.get("codeVerifier")
  const state = oidcSession.get("state")

  if (!codeVerifier || !state) {
    throw new Response("Invalid authentication session", { status: 400 })
  }

  const oidcUser = await verifyAuthorization(request, {
    codeVerifier,
    state,
  })

  const authUser = await upsertByOIDCIdentity({
    oidcIssuer: oidcUser.issuer,
    oidcSubject: oidcUser.subject,
    displayName: oidcUser.displayName,
  })

  const authSession = await authSessionStorage.getSession()
  authSession.set("userID", authUser.ID)

  const headers = new Headers()
  headers.append("Set-Cookie", await oidcSessionStorage.destroySession(oidcSession))
  headers.append("Set-Cookie", await authSessionStorage.commitSession(authSession))

  return redirect("/", { headers })
}
