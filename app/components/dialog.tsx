import tw from "~/lib/tw"

interface DialogProps extends React.ComponentPropsWithRef<"dialog"> {
  dialogTitle?: string
  description: string
  buttons: React.ReactElement[]
}

export default function Dialog({
  dialogTitle,
  description,
  buttons,
  className,
  ...props
}: DialogProps) {
  return (
    <dialog className={tw("fixed inset-0 m-auto w-75 rounded p-2 shadow-lg", className)} {...props}>
      {dialogTitle && (
        <h2 className="mb-2 border-b border-white pb-2 text-sm font-bold">{dialogTitle}</h2>
      )}
      <p className="mb-2 pb-2">{description}</p>
      <div className="flex justify-end gap-2">{buttons}</div>
    </dialog>
  )
}
