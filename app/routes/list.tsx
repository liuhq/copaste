import {
  RiCheckboxCircleLine,
  RiClipboardLine,
  RiCloseLine,
  RiDeleteBinLine,
  RiEditLine,
  RiEyeLine,
  RiMore2Fill,
  RiTimeLine,
} from "@remixicon/react"
import { useEffect, useRef, useState } from "react"
import { redirect, useFetcher } from "react-router"

import { Button, ButtonLink } from "~/components/button"
import Dialog from "~/components/dialog"
import { deletePasteByOwner, listActivePastesByOwner } from "~/db/dao/pastes.server"
import { flashSessionStorage, getSessionUserID } from "~/lib/auth/session.server"
import { isString } from "~/lib/predicate"
import tw from "~/lib/tw"
import { getPreviewURL } from "~/lib/url-builder"

import type { Route } from "./+types/list"

const defaultLimit = 100
const defaultOffset = 0

export async function loader({ request, url }: Route.LoaderArgs) {
  const userID = await getSessionUserID(request)

  if (userID === null) {
    const flashSession = await flashSessionStorage.getSession(request.headers.get("Cookie"))
    flashSession.flash("unauthenticated", true)
    throw redirect("/", {
      headers: {
        "Set-Cookie": await flashSessionStorage.commitSession(flashSession),
      },
    })
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
  onDelete: (slug: string) => void
}

const Entry = ({ slug, pasteTitle, expiresAt, onDelete, ...props }: EntryProps) => {
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

  return (
    <li className="flex h-8 justify-between gap-4" {...props}>
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          className="group flex shrink-0 items-center gap-1 rounded pr-2 pl-2 font-mono text-xl hover:bg-primary hover:text-pure-white"
          onClick={handleCopyClick}
          aria-label="Copy paste id"
          title="Copy paste id"
        >
          {copied ? (
            <RiCheckboxCircleLine size={18} className="text-primary group-hover:text-pure-white" />
          ) : (
            <RiClipboardLine size={18} className="text-primary group-hover:text-pure-white" />
          )}
          {slug}
        </button>
        <div className="hidden truncate text-sm text-mid-black md:block">
          {pasteTitle ?? "(no title)"}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <div className="shrink-0 text-mid-black">
          {expiresAt && (
            <div className="flex items-center gap-1" aria-label="Expiration" title="Expiration">
              <RiTimeLine aria-hidden="true" size={18} />
              {`${expiresAt?.toLocaleString(undefined, { hour12: false })}`}
            </div>
          )}
        </div>
        <div ref={operatorRef} className="relative flex shrink-0 self-stretch">
          <button
            type="button"
            className="rounded pr-1.5 pl-1.5 active:bg-white sm:hidden"
            onClick={() => setOpen((prev) => !prev)}
          >
            <RiMore2Fill size={20} />
          </button>
          <div className={operatorPanelStyle}>
            <ButtonLink
              variant="secondary"
              to={`/p/${slug}`}
              className="self-stretch [&_span]:block [&_span]:sm:hidden"
              icon={<RiEyeLine aria-hidden="true" size={18} />}
              aria-label="View paste"
              title="View paste"
            >
              View
            </ButtonLink>
            <ButtonLink
              variant="primary"
              to={`/w/${slug}`}
              className="self-stretch [&_span]:block [&_span]:sm:hidden"
              icon={<RiEditLine aria-hidden="true" size={18} />}
              aria-label="Edit paste"
              title="Edit paste"
            >
              Edit
            </ButtonLink>
            <Button
              variant="dangerous"
              className="self-stretch [&_span]:block [&_span]:sm:hidden"
              onClick={() => onDelete(slug)}
              icon={<RiDeleteBinLine aria-hidden="true" size={18} />}
              aria-label="Delete paste"
              title="Delete paste"
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
  const [selected, setSelected] = useState<string | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const fetcher = useFetcher()

  const handleDeleteClick = (slug: string) => {
    setSelected(slug)
    dialogRef.current?.showModal()
  }

  return (
    <div>
      <ul className="flex flex-col gap-2">
        {loaderData.pastes.map((p) => (
          <Entry
            key={p.slug}
            slug={p.slug}
            pasteTitle={p.title}
            expiresAt={p.expiresAt}
            onDelete={handleDeleteClick}
          />
        ))}
      </ul>

      <Dialog
        ref={dialogRef}
        onClose={() => setSelected(null)}
        dialogTitle="Delete paste?"
        description={selected ?? ""}
        buttons={[
          <Button
            key="close"
            type="button"
            variant="secondary"
            icon={<RiCloseLine aria-hidden="true" size={18} />}
            onClick={() => dialogRef.current?.close()}
          >
            Close
          </Button>,
          <Button
            key="delete"
            type="button"
            variant="dangerous"
            icon={<RiDeleteBinLine aria-hidden="true" size={18} />}
            disabled={!selected || fetcher.state !== "idle"}
            onClick={async () => {
              await fetcher.submit({ slug: selected }, { method: "post" })
              dialogRef.current?.close()
            }}
          >
            Confirm
          </Button>,
        ]}
      />
    </div>
  )
}
