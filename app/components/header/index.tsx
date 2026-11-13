import { RiLoginBoxLine, RiLogoutBoxRLine } from "@remixicon/react"
import { Link, useFetcher } from "react-router"

import { Button, ButtonLink } from "~/components/button"

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
        <Link to="/" className="hover:text-primary">
          Copaste
        </Link>
      </div>
      <div className="flex items-center justify-between gap-2">
        {authentication ? (
          <>
            <ButtonLink variant="secondary" to="/list" className="hover:text-primary">
              My pastes
            </ButtonLink>
            <span>{name}</span>
            <fetcher.Form method="post" action="/auth/logout">
              <Button
                variant="secondary"
                type="submit"
                icon={<RiLogoutBoxRLine size={20} />}
                className="hover:text-red"
              />
            </fetcher.Form>
          </>
        ) : (
          <>
            <fetcher.Form method="post" action="/auth/login">
              <Button
                variant="secondary"
                type="submit"
                icon={<RiLoginBoxLine size={20} />}
                iconPosition="right"
                className="hover:text-primary"
              >
                Log in
              </Button>
            </fetcher.Form>
          </>
        )}
      </div>
    </header>
  )
}
