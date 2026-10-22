import { redirect } from "react-router"

import { createAuthorization } from "~/lib/auth/oidc.server"
import { oidcSessionStorage } from "~/lib/auth/session.server"

export async function action() {
  const authorization = await createAuthorization()

  const oidcSession = await oidcSessionStorage.getSession()
  oidcSession.set("codeVerifier", authorization.codeVerifier)
  oidcSession.set("state", authorization.state)

  return redirect(authorization.url.href, {
    headers: {
      "Set-Cookie": await oidcSessionStorage.commitSession(oidcSession),
    },
  })
}
