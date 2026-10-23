import { Outlet } from "react-router"

import Footer from "~/components/footer"
import Header from "~/components/header"
import { findByID } from "~/db/dao/users.server"
import { authSessionStorage } from "~/lib/auth/session.server"

import type { Route } from "./+types/app-layout"

export async function loader({
  request,
}: Route.LoaderArgs): Promise<
  { authentication: true; displayName: string | null } | { authentication: false }
> {
  const authSession = await authSessionStorage.getSession(request.headers.get("Cookie"))

  if (!authSession.has("userID")) {
    return { authentication: false }
  }

  const userID = authSession.get("userID")

  if (userID === undefined) {
    return { authentication: false }
  }

  const user = await findByID(userID)

  if (!user) {
    return { authentication: false }
  }

  return {
    authentication: true,
    displayName: user.displayName,
  }
}

export default function AppLayout({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <Header {...loaderData} />
      <main className="w-full p-4">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
