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
    <div className="flex min-h-svh flex-col">
      <Header {...loaderData} />
      <main className="flex min-h-0 flex-1 flex-col rounded bg-pure-white px-2 py-2 shadow">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
