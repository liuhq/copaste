import { RiAddFill, RiCodeSSlashLine, RiMore2Fill, RiSave3Fill, RiTimeLine } from "@remixicon/react"
import { useEffect, useRef, useState } from "react"
import { Form, redirect } from "react-router"

import { Button } from "~/components/button"
import Editor from "~/components/editor"
import ErrorTip from "~/components/error-tip"
import { createPaste, findActivePasteBySlug, updatePasteBySlugOwner } from "~/db/dao/pastes.server"
import { flashSessionStorage, getSessionUserID } from "~/lib/auth/session.server"
import { isSupportedLanguage, supportedLanguages } from "~/lib/highlight.server"
import tw from "~/lib/tw"

import type { Route } from "./+types/edit"

const newEditName = "copaste_edit_new"
const contentName = "copaste_edit_content"
const languageName = "copaste_edit_language"
const expiresAtName = "copaste_edit_expires_at"
const titleName = "copaste_edit_title"

const durations = {
  "15m": {
    name: "15 minutes",
    value: 1_000 * 60 * 15,
  },
  "1h": {
    name: "1 hour",
    value: 1_000 * 60 * 60,
  },
  "1d": {
    name: "1 day",
    value: 1_000 * 60 * 60 * 24,
  },
  "7d": {
    name: "7 day",
    value: 1_000 * 60 * 60 * 24 * 7,
  },
  "30d": {
    name: "30 day",
    value: 1_000 * 60 * 60 * 24 * 30,
  },
  never: {
    name: "Never",
    value: 0,
  },
  keep: {
    name: "Keep",
    value: 0,
  },
} as const

type Duration = keyof typeof durations

const getExpiresAtDate = (duration: Duration): { expiresAt: Date | null } | {} => {
  if (duration === "keep") {
    return {}
  }

  if (duration === "never") {
    return { expiresAt: null }
  }

  return {
    expiresAt: new Date(Date.now() + durations[duration].value),
  }
}

const isExpiresAtValue = (value: unknown): value is Duration => {
  return typeof value === "string" && Object.hasOwn(durations, value)
}

export async function loader({ request, params }: Route.LoaderArgs) {
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

  if (params.slug) {
    const paste = await findActivePasteBySlug(params.slug)

    if (!paste) {
      throw redirect("/w")
    }

    const { content, expiresAt, language, title, slug } = paste

    return {
      paste: { content, expiresAt, language, title, slug },
      supportedLanguages,
    }
  }

  return {
    paste: null,
    supportedLanguages,
  }
}

export async function action({
  request,
  params,
}: Route.ActionArgs): Promise<{ type: "auth" | "paste"; message: string } | Response> {
  const userID = await getSessionUserID(request)

  if (userID === null) {
    // TODO: use flash session to warn the auth is outdated
    return { type: "auth", message: "Unauthorized" }
  }

  const formData = await request.formData()
  const content = formData.get(contentName)?.toString()
  const language = formData.get(languageName)?.toString()
  const expiresAt = formData.get(expiresAtName)?.toString()
  const title = formData.get(titleName)?.toString()

  if (!content || content.trim() === "") {
    return { type: "paste", message: "Content cannot be empty." }
  }

  if (!isSupportedLanguage(language)) {
    return { type: "paste", message: "Invalid language" }
  }

  if (!isExpiresAtValue(expiresAt)) {
    return { type: "paste", message: "Invalid expires value" }
  }

  let paste = null

  if (params.slug) {
    paste = await updatePasteBySlugOwner(params.slug, userID, {
      content,
      language,
      title,
      ...getExpiresAtDate(expiresAt),
    })
  } else {
    paste = await createPaste({
      ownerID: userID,
      content,
      language,
      title,
      ...getExpiresAtDate(expiresAt),
    })
  }

  return redirect(`/p/${paste.slug}`)
}

interface SelectProps extends React.ComponentPropsWithoutRef<"select"> {
  text: React.ReactElement | string
}

const Select = ({ text, children, id, className, ...props }: SelectProps) => {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor={id}>{text}</label>
      <select id={id} {...props} className={tw("rounded bg-white p-1", className)}>
        {children}
      </select>
    </div>
  )
}

interface BarProps {
  isNew?: boolean
  language?: string | null
  expiresAt?: Date | null
  title?: string | null
  supportedLanguages: Route.ComponentProps["loaderData"]["supportedLanguages"]
}

const Bar = ({ language, expiresAt, title, ...props }: BarProps) => {
  const [open, setOpen] = useState(false)
  const optionsRef = useRef<HTMLDivElement>(null)

  const isNever = expiresAt === null

  const optionsPanelStyle = tw(
    "absolute top-full left-0 z-10 mt-2 w-max flex-col gap-2 bg-pure-white p-2 shadow-md",
    "md:static md:mt-0 md:flex md:flex-row md:items-center md:bg-transparent md:p-0 md:shadow-none",
    open ? "flex" : "hidden",
  )

  useEffect(() => {
    if (!open) {
      return
    }

    const onPointerDown = (evt: PointerEvent) => {
      if (!optionsRef.current?.contains(evt.target as Node)) {
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

  return (
    <div className="flex justify-between gap-2">
      <div ref={optionsRef} className="relative flex shrink-0">
        <button
          type="button"
          className="rounded pr-1.5 pl-1.5 active:bg-white md:hidden"
          onClick={() => setOpen((prev) => !prev)}
        >
          <RiMore2Fill size={20} />
        </button>
        <div className={optionsPanelStyle}>
          <Select
            text={<RiCodeSSlashLine size={18} />}
            id={languageName}
            name={languageName}
            defaultValue={language ?? "plaintext"}
            className="w-40"
          >
            {props.supportedLanguages.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </Select>
          <Select text={<RiTimeLine size={18} />} id={expiresAtName} name={expiresAtName}>
            {!props.isNew && expiresAt !== undefined && (
              <option value="keep">
                {isNever ? "Never" : expiresAt.toLocaleString(undefined, { hour12: false })}
              </option>
            )}
            {Object.keys(durations)
              .filter((k) => k !== "keep")
              .map((k) => (
                <option value={k} key={k} disabled={!props.isNew && k === "never"}>
                  {durations[k as Duration].name}
                </option>
              ))}
          </Select>
        </div>
      </div>
      <div className="flex min-w-0 flex-1 justify-end gap-2 transition-all md:gap-4">
        <input
          type="text"
          name={titleName}
          defaultValue={title ?? ""}
          placeholder="(no title)"
          className="max-w-1/2 min-w-0 flex-1 bg-white px-2 transition-all placeholder:text-primary/75"
          aria-label="Enter paste title"
          title="Enter paste title"
          autoComplete="off"
        />
        <Button
          variant="primary"
          type="submit"
          icon={
            props.isNew ? (
              <RiAddFill aria-hidden="true" size={18} />
            ) : (
              <RiSave3Fill aria-hidden="true" size={18} />
            )
          }
        >
          {props.isNew ? "Create" : "Update"}
        </Button>
      </div>
    </div>
  )
}

export default function Edit({ loaderData, actionData }: Route.ComponentProps) {
  const { paste } = loaderData

  return (
    <Form method="post" className="flex min-h-0 flex-1 flex-col" key={paste?.slug ?? newEditName}>
      <Bar
        language={paste?.language}
        expiresAt={paste?.expiresAt}
        title={paste?.title}
        isNew={!paste}
        supportedLanguages={loaderData.supportedLanguages}
      />
      {actionData?.type && actionData.type === "paste" && <ErrorTip text={actionData.message} />}
      <div className="mt-2 border-b border-white" />
      <Editor name={contentName} defaultValue={paste?.content} />
    </Form>
  )
}
