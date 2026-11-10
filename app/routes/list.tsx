import { RiClipboardFill, RiMore2Fill } from "@remixicon/react"
import { useEffect, useRef, useState } from "react"
import { redirect, useFetcher } from "react-router"

import { Button, ButtonLink } from "~/components/button"
import { deletePasteByOwner, listActivePastesByOwner } from "~/db/dao/pastes.server"
import { getSessionUserID } from "~/lib/auth/session.server"
import { isString } from "~/lib/predicate"
import tw from "~/lib/tw"
import { getPreviewURL } from "~/lib/url-builder"

import type { Route } from "./+types/list"

const defaultLimit = 100
const defaultOffset = 0

export async function loader({ request, url }: Route.LoaderArgs) {
  const userID = await getSessionUserID(request)

  if (userID === null) {
    throw redirect("/")
  }

  const limit = url.searchParams.get("limit")
  const offset = url.searchParams.get("offset")

  const pastes = (
    await listActivePastesByOwner({
      ownerID: userID,
      limit: limit ? parseInt(limit) : defaultLimit,
      offset: offset ? parseInt(offset) : defaultOffset,
    })
  ).map(({ slug, title, expiresAt, language }) => ({
    slug,
    title,
    expiresAt,
    language,
  }))

  return { pastes }
}

export async function action({
  request,
}: Route.ActionArgs): Promise<{ type: "auth" | "delete"; message: string } | { slug: string }[]> {
  const userID = await getSessionUserID(request)

  if (userID === null) {
    // TODO: use flash session to warn the auth is outdated
    return { type: "auth", message: "Unauthorized" }
  }

  const formData = await request.formData()
  const slug = formData.get("slug")?.toString()

  if (!isString(slug)) {
    return { type: "delete", message: "Invalid slug" }
  }

  return await deletePasteByOwner(slug, userID)
}

interface EntryProps extends React.ComponentPropsWithoutRef<"li"> {
  slug: string
  pasteTitle: string | null
  expiresAt: Date | null
}

const Entry = ({ slug, pasteTitle, expiresAt, ...props }: EntryProps) => {
  const fetcher = useFetcher()
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)
  const operatorRef = useRef<HTMLDivElement>(null)

  const operatorPanelStyle = tw(
    "absolute top-full right-0 z-10 mt-2 w-max flex-col gap-2 bg-pure-white p-2 shadow-md",
    "sm:static sm:mt-0 sm:flex sm:flex-row sm:items-center sm:bg-transparent sm:p-0 sm:shadow-none",
    open ? "flex" : "hidden",
  )

  useEffect(() => {
    if (!open) {
      return
    }

    const onPointerDown = (evt: PointerEvent) => {
      if (!operatorRef.current?.contains(evt.target as Node)) {
        setOpen(false)
      }
    }
    const onKeyDown = (evt: KeyboardEvent) => {
      if (evt.code === "Escape") {
        setOpen(false)
      }
    }

    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)

    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  const handleCopyClick = async () => {
    if (copied) {
      return
    }

    await navigator.clipboard.writeText(getPreviewURL(slug).href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDeleteClick = async () => {
    await fetcher.submit({ slug }, { method: "post" })
  }

  return (
    <li className="flex h-8 justify-between gap-4" {...props}>
      <div className="relative flex min-w-0 items-center gap-2">
        <button
          type="button"
          className="flex shrink-0 items-center gap-1 rounded pr-2 pl-2 font-mono text-xl text-primary hover:bg-primary hover:text-pure-white"
          onClick={handleCopyClick}
        >
          <RiClipboardFill size={18} />
          {slug}
        </button>
        {copied && (
          <div className="absolute top-0 right-0 z-10 h-8 rounded bg-pure-white px-2 shadow-md">
            Copied!
          </div>
        )}
        <div className="hidden truncate text-sm text-mid-black md:block">
          {pasteTitle ?? "(no title)"}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <div className="shrink-0 text-mid-black">
          {expiresAt === null
            ? "Never expire"
            : `Expires At: ${expiresAt?.toLocaleString(undefined, { hour12: false })}`}
        </div>
        <div ref={operatorRef} className="relative flex shrink-0">
          <button
            type="button"
            className="rounded pr-1.5 pl-1.5 active:bg-white sm:hidden"
            onClick={() => setOpen((prev) => !prev)}
          >
            <RiMore2Fill size={20} />
          </button>
          <div className={operatorPanelStyle}>
            <ButtonLink variant="secondary" to={`/p/${slug}`} className="justify-center">
              View
            </ButtonLink>
            <ButtonLink variant="primary" to={`/w/${slug}`} className="justify-center">
              Edit
            </ButtonLink>
            <Button
              variant="dangerous"
              className="justify-center"
              onClick={handleDeleteClick}
              disabled={fetcher.state !== "idle"}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </li>
  )
}

export default function PastesList({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <ul className="flex flex-col gap-2">
        {loaderData.pastes.map((p) => (
          <Entry key={p.slug} slug={p.slug} pasteTitle={p.title} expiresAt={p.expiresAt} />
        ))}
      </ul>
    </div>
  )
}
