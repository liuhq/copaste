import { useEffect, useRef } from "react"
import { Form, redirect } from "react-router"

import { isNonEmptyString } from "~/lib/predicate"

import type { Route } from "./+types/app-index"

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  const slug = formData.get("slug")

  if (slug === null || !isNonEmptyString(slug)) {
    return { error: "Invalid paste id" }
  }

  return redirect(`/p/${encodeURIComponent(slug.trim())}`)
}

export default function AppIndex({ actionData }: Route.ComponentProps) {
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (actionData?.error) {
      formRef.current?.reset()
    }
  }, [actionData])

  return (
    <div>
      <Form method="post" ref={formRef}>
        <label htmlFor="input-paste_id">Paste ID</label>
        <div>
          <input name="slug" id="input-paste_id" />
          <button type="submit">Search</button>
        </div>
        {actionData?.error && <span>{actionData.error}</span>}
      </Form>
    </div>
  )
}
