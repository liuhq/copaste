import tw from "~/lib/tw"

interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  variant: "primary" | "secondary"
  icon?: React.ReactElement
}

export default function Button({ variant, icon, children, className, ...props }: ButtonProps) {
  const finalClassName = tw(
    className ?? "flex items-center rounded px-2 py-1",
    variant === "primary" && "bg-primary text-pure-white",
    variant === "secondary" && "bg-transparent",
  )

  return (
    <button className={finalClassName} {...props}>
      {icon}
      <span>{children}</span>
    </button>
  )
}
