import { db } from "~/db/client.server"

import type { Route } from "./+types/home"

export function loader() {
  console.log(db)
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ]
}

export default function Home() {
  return <div>Home</div>
}
