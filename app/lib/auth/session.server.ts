import { createCookieSessionStorage } from "react-router"

import { readEnv } from "../env.server"

const OIDC_SESSION_MAXAGE = 60 * 10
const AUTH_SESSION_MAXAGE = 60 * 60 * 24 * 7

const secret = readEnv("SESSION_SECRET")

type OIDCSessionData = {
  state: string
  codeVerifier: string
}

type AuthSessionData = {
  userID: number
}

export const oidcSessionStorage = createCookieSessionStorage<OIDCSessionData>({
  cookie: {
    name: "__copaste_oidc",
    httpOnly: true,
    maxAge: OIDC_SESSION_MAXAGE,
    path: "/auth",
    sameSite: "lax",
    secrets: [secret],
    secure: true,
  },
})

export const authSessionStorage = createCookieSessionStorage<AuthSessionData>({
  cookie: {
    name: "__copaste_auth",
    httpOnly: true,
    maxAge: AUTH_SESSION_MAXAGE,
    path: "/",
    sameSite: "lax",
    secrets: [secret],
    secure: true,
  },
})
