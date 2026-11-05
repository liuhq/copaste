import { redirect } from "react-router"

import { findActivePasteBySlug } from "~/db/dao/pastes.server"

import type { Route } from "./+types/preview"

export async function loader({ params: { publicID } }: Route.LoaderArgs) {
  const paste = await findActivePasteBySlug(publicID)

  if (!paste) {
    throw redirect("/")
  }

  const { content, language, title } = paste
  return { content, language, title }
}

export default function Preview({ loaderData }: Route.ComponentProps) {
  return (
    <section className="flex flex-col gap-2">
      <header className="flex items-center gap-2 border-b border-white pb-2">
        <div className="h-max rounded bg-white pr-2 pl-2">{loaderData.language}</div>
        <h2 className="font-bold wrap-anywhere">{loaderData.title}</h2>
      </header>
      <pre>{loaderData.content}</pre>
    </section>
  )
}
