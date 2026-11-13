import { Outlet, useLocation } from "react-router"

import Footer from "~/components/footer"
import Header from "~/components/header"
import { getCurrentUser } from "~/lib/auth/user.server"
import tw from "~/lib/tw"

import type { Route } from "./+types/app-layout"

export async function loader({
  request,
}: Route.LoaderArgs): Promise<
  { authentication: true; displayName: string | null } | { authentication: false }
> {
  const user = await getCurrentUser(request)

  if (!user) {
    return { authentication: false }
  }

  return {
    authentication: true,
    displayName: user.displayName,
  }
}

export default function AppLayout({ loaderData }: Route.ComponentProps) {
  const pathname = useLocation().pathname
  const isHome = pathname === "/"
  const isEdit = pathname === "/w" || pathname.startsWith("/w/")
  const wrapperStyle = tw(
    "flex flex-col",
    isHome && "mx-auto w-full max-w-4xl",
    isEdit ? "h-dvh overflow-hidden" : "min-h-svh",
  )

  return (
    <div className={wrapperStyle}>
      <Header {...loaderData} />
      <main className="flex min-h-0 flex-1 flex-col rounded bg-pure-white px-2 py-2 shadow">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
