import {
  authorizationCodeGrant,
  buildAuthorizationUrl,
  calculatePKCECodeChallenge,
  discovery,
  fetchUserInfo,
  randomPKCECodeVerifier,
  randomState,
} from "openid-client"

import { readEnv } from "../env.server"

const issuer = new URL(readEnv("OIDC_ISSUER"))
const clientID = readEnv("OIDC_CLIENT_ID")
const clientSecret = readEnv("OIDC_CLIENT_SECRET")

const appOrigin = readEnv("APP_ORIGIN")
const authCallbackPath = "/auth/callback"
const redirectURI = new URL(authCallbackPath, appOrigin).href
const scope = "openid profile email"

export type OIDCAuthorization = {
  url: URL
  state: string
  codeVerifier: string
}

export type OIDCIdentity = {
  issuer: string
  subject: string
  displayName?: string
}

const configPromise = discovery(issuer, clientID, clientSecret)
const getConfig = () => configPromise

export async function createAuthorization(): Promise<OIDCAuthorization> {
  const config = await getConfig()
  const state = randomState()
  const codeVerifier = randomPKCECodeVerifier()

  const url = buildAuthorizationUrl(config, {
    redirect_uri: redirectURI,
    scope,
    code_challenge: await calculatePKCECodeChallenge(codeVerifier),
    code_challenge_method: "S256",
    state,
  })

  return {
    url,
    state,
    codeVerifier,
  }
}

export async function verifyAuthorization(
  request: Request,
  check: {
    codeVerifier: string
    state: string
  },
): Promise<OIDCIdentity> {
  const config = await getConfig()
  const tokens = await authorizationCodeGrant(config, request, {
    pkceCodeVerifier: check.codeVerifier,
    expectedState: check.state,
    idTokenExpected: true,
  })

  const claims = tokens.claims()

  if (!claims) {
    throw new Error("Missing ID token")
  }

  const { name: displayName } = await fetchUserInfo(config, tokens.access_token, claims.sub)

  return {
    issuer: claims.iss,
    subject: claims.sub,
    displayName,
  }
}
