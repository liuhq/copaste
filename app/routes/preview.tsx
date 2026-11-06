import { RiPencilFill } from "@remixicon/react"
import { redirect } from "react-router"

import { ButtonLink } from "~/components/button"
import { countLines, Gutter } from "~/components/editor"
import { findActivePasteBySlug } from "~/db/dao/pastes.server"
import { highlightContent, supportedLanguages } from "~/lib/highlight.server"

import type { Route } from "./+types/preview"

export async function loader({ params: { publicID } }: Route.LoaderArgs) {
  const paste = await findActivePasteBySlug(publicID)

  if (!paste) {
    throw redirect("/")
  }

  const { content, language, title, slug } = paste
  const endTrimmedContent = content.trimEnd()
  const htmlContent = await highlightContent(endTrimmedContent, language)
  const lineCount = countLines(endTrimmedContent)

  return {
    htmlContent,
    lineCount,
    language: supportedLanguages.find((l) => l.id === language)?.name,
    title,
    slug,
  }
}

export default function Preview({
  loaderData: { htmlContent, lineCount, language, title, slug },
}: Route.ComponentProps) {
  return (
    <section className="flex flex-1 flex-col gap-2">
      <header className="flex items-center justify-between border-b border-white pb-2">
        <div className="flex gap-2">
          {language && <div className="h-max rounded bg-white pr-2 pl-2">{language}</div>}
          <h2 className="font-bold wrap-anywhere">{title}</h2>
        </div>

        <ButtonLink to={`/w/${slug}`} variant="primary" icon={<RiPencilFill size={20} />}>
          Edit
        </ButtonLink>
      </header>
      <div className="flex flex-1 gap-1 overflow-auto font-mono text-base/8">
        <Gutter lineCount={lineCount} />
        <div className="flex-1" dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
    </section>
  )
}
