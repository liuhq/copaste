import { Link } from "react-router"

import tw from "~/lib/tw"

type Variant = "primary" | "secondary" | "dangerous"

const getBaseStyle = (variant: Variant) =>
  tw(
    "flex items-center gap-2 rounded pt-1 pr-2 pb-1 pl-2",
    variant === "primary" && "bg-primary text-pure-white",
    variant === "secondary" && "bg-transparent",
    variant === "dangerous" && "bg-red text-pure-white",
  )

interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  variant: Variant
  icon?: React.ReactElement
}

export function Button({ variant, icon, children, className, ...props }: ButtonProps) {
  return (
    <button className={tw(getBaseStyle(variant), className)} {...props}>
      {icon}
      <span>{children}</span>
    </button>
  )
}

interface ButtonLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  variant: Variant
  icon?: React.ReactElement
}

export function ButtonLink({ variant, icon, children, className, ...props }: ButtonLinkProps) {
  return (
    <Link className={tw(getBaseStyle(variant), className)} {...props}>
      {icon}
      <span>{children}</span>
    </Link>
  )
}
