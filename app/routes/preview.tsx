import type { Route } from "./+types/preview"

export default function Preview({ params }: Route.ComponentProps) {
  return <div>Preview {params.publicID}</div>
}
