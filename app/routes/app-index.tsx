import { useEffect, useRef } from "react"
import { Form, redirect } from "react-router"

import Intro from "~/components/app-index.intro"
import { Button, ButtonLink } from "~/components/button"
import ErrorTip from "~/components/error-tip"
import { getSessionUserID } from "~/lib/auth/session.server"
import { isNonEmptyString } from "~/lib/predicate"

import type { Route } from "./+types/app-index"

export async function loader({ request }: Route.LoaderArgs) {
  const userID = await getSessionUserID(request)

  if (userID === null) {
    return { authentication: false }
  }

  return { authentication: true }
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  const slug = formData.get("slug")

  if (slug === null || !isNonEmptyString(slug)) {
    return { error: "Invalid paste id" }
  }

  return redirect(`/p/${encodeURIComponent(slug.trim())}`)
}

export default function AppIndex({ loaderData, actionData }: Route.ComponentProps) {
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (actionData?.error) {
      formRef.current?.reset()
    }
  }, [actionData])

  return (
    <div className="flex flex-col gap-16">
      <Form method="post" ref={formRef} className="flex w-full flex-col gap-1 self-center">
        <div className="flex gap-2">
          <input
            className="h-12 min-w-0 shrink grow rounded bg-white px-4 text-3xl"
            name="slug"
            id="input-paste_id"
            placeholder="Enter the paste id..."
          />
          <Button variant="primary" type="submit">
            View
          </Button>
          {loaderData.authentication && (
            <ButtonLink
              variant="secondary"
              to="/w"
              className="border-2 border-primary font-bold text-primary hover:bg-primary"
            >
              Create
            </ButtonLink>
          )}
        </div>
        <ErrorTip text={actionData?.error ? actionData.error : ""} />
      </Form>
      <Intro />
    </div>
  )
}
