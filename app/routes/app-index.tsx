import { useEffect, useRef } from "react"
import { Form, redirect } from "react-router"

import Intro from "~/components/app-index.intro"
import Button from "~/components/button"
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
    <div className="flex flex-col gap-16">
      <Form method="post" ref={formRef} className="flex w-full flex-col gap-1 self-center">
        <div className="flex gap-2">
          <input
            className="h-12 grow rounded bg-white px-4 text-3xl"
            name="slug"
            id="input-paste_id"
            placeholder="Enter the paste id..."
          />
          <Button variant="primary" type="submit">
            Search
          </Button>
        </div>
        <span className="min-h-lh text-red">{actionData?.error ? actionData.error : ""}</span>
      </Form>
      <Intro />
    </div>
  )
}
