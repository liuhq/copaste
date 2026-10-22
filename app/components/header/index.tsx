import { Link, useFetcher } from "react-router"

const DEFAULT_NAME = "copaste user"

interface HeaderProps {
  authentication: boolean
  displayName?: string | null
}

export default function Header({ authentication, displayName }: HeaderProps) {
  const fetcher = useFetcher()
  const name = displayName ?? DEFAULT_NAME

  return (
    <header className="flex h-12 w-full items-center justify-between px-4">
      <div>
        <Link to="/">Copaste</Link>
      </div>
      <div className="flex justify-between gap-4">
        {authentication ? (
          <>
            <span>{name}</span>
            <fetcher.Form method="post" action="/auth/logout">
              <button type="submit">Logout</button>
            </fetcher.Form>
          </>
        ) : (
          <>
            <fetcher.Form method="post" action="/auth/login">
              <button type="submit">Login</button>
            </fetcher.Form>
          </>
        )}
      </div>
    </header>
  )
}
