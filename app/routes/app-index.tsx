import { RiAddLine, RiArrowRightLine } from "@remixicon/react"
import { useEffect, useRef } from "react"
import { data, Form, redirect } from "react-router"

import Intro from "~/components/app-index.intro"
import { Button, ButtonLink } from "~/components/button"
import ErrorTip from "~/components/error-tip"
import Toast from "~/components/toast"
import { findActivePasteBySlug } from "~/db/dao/pastes.server"
import { flashSessionStorage, getSessionUserID } from "~/lib/auth/session.server"
import { isNonEmptyString } from "~/lib/predicate"

import type { Route } from "./+types/app-index"

export async function loader({ request }: Route.LoaderArgs) {
  const flashSession = await flashSessionStorage.getSession(request.headers.get("Cookie"))
  const unauthenticated = flashSession.get("unauthenticated") ?? false
  const notFoundPaste = flashSession.get("notFoundPaste") ?? false

  const userID = await getSessionUserID(request)

  return data(
    {
      authentication: userID !== null,
      flash: { unauthenticated, notFoundPaste },
    },
    {
      headers: {
        "Set-Cookie": await flashSessionStorage.commitSession(flashSession),
      },
    },
  )
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  const slug = formData.get("slug")

  if (slug === null || !isNonEmptyString(slug)) {
    return { error: "Invalid paste id" }
  }

  const paste = await findActivePasteBySlug(slug.trim())

  if (!paste) {
    return { error: "Can't find the paste" }
  }

  return redirect(`/p/${encodeURIComponent(paste.slug)}`)
}

export default function AppIndex({ loaderData, actionData }: Route.ComponentProps) {
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (actionData?.error) {
      formRef.current?.reset()
    }
  }, [actionData])

  return (
    <>
      {loaderData.flash.unauthenticated && (
        <Toast
          key="unauthenticated"
          message="Authentication required. Please log in to continue."
        />
      )}
      {loaderData.flash.notFoundPaste && (
        <Toast key="notFoundPaste" message="The paste isn't exist." />
      )}
      <div className="flex flex-col gap-16">
        <Form method="post" ref={formRef} className="flex w-full flex-col gap-1 self-center">
          <div className="flex gap-2">
            <input
              className="h-12 min-w-0 shrink grow rounded bg-white px-4 text-3xl"
              name="slug"
              id="input-paste_id"
              placeholder="Enter the paste id..."
            />
            <Button
              variant="primary"
              type="submit"
              icon={<RiArrowRightLine aria-hidden="true" className="w-8" />}
              aria-label="View paste"
              title="View paste"
            />

            {loaderData.authentication && (
              <ButtonLink
                variant="outline"
                to="/w"
                icon={<RiAddLine aria-hidden="true" className="w-8" />}
                aria-label="Create paste"
                title="Create paste"
              />
            )}
          </div>
          <ErrorTip text={actionData?.error ? actionData.error : ""} />
        </Form>
        <Intro />
      </div>
    </>
  )
}
