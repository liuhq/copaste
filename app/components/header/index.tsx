import { Link, useFetcher } from "react-router"

import Button from "~/components/button"

const DEFAULT_NAME = "copaste user"

interface HeaderProps {
  authentication: boolean
  displayName?: string | null
}

export default function Header({ authentication, displayName }: HeaderProps) {
  const fetcher = useFetcher()
  const name = displayName ?? DEFAULT_NAME

  return (
    <header className="flex w-full items-center justify-between py-4">
      <div>
        <Link to="/">Copaste</Link>
      </div>
      <div className="flex items-center justify-between gap-4">
        {authentication ? (
          <>
            <span>{name}</span>
            <fetcher.Form method="post" action="/auth/logout">
              <Button variant="secondary" type="submit">
                Logout
              </Button>
            </fetcher.Form>
          </>
        ) : (
          <>
            <fetcher.Form method="post" action="/auth/login">
              <Button variant="secondary" type="submit">
                Login
              </Button>
            </fetcher.Form>
          </>
        )}
      </div>
    </header>
  )
}
