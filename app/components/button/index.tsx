import { Link } from "react-router"

import tw from "~/lib/tw"

type Variant = "primary" | "secondary" | "dangerous" | "outline"

const getBaseStyle = (variant: Variant) =>
  tw(
    "flex items-center gap-2 rounded",
    variant !== "outline" && "px-2 py-1",
    variant === "primary" && "bg-primary text-pure-white",
    variant === "secondary" && "bg-transparent hover:bg-white",
    variant === "dangerous" && "bg-red text-pure-white",
    variant === "outline" &&
      "border-2 border-primary bg-transparent px-1.5 py-0.5 text-primary hover:bg-white",
  )

interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  variant: Variant
  icon?: React.ReactElement
  iconPosition?: "left" | "right"
}

export function Button({
  variant,
  icon,
  iconPosition = "left",
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button className={tw(getBaseStyle(variant), className)} {...props}>
      {iconPosition === "left" && icon}
      {children && <span>{children}</span>}
      {iconPosition === "right" && icon}
    </button>
  )
}

interface ButtonLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  variant: Variant
  icon?: React.ReactElement
  iconPosition?: "left" | "right"
}

export function ButtonLink({
  variant,
  icon,
  iconPosition = "left",
  children,
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={tw(getBaseStyle(variant), className)} {...props}>
      {iconPosition === "left" && icon}
      {children && <span>{children}</span>}
      {iconPosition === "right" && icon}
    </Link>
  )
}
