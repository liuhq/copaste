import { RiInformation2Fill } from "@remixicon/react"
import { useEffect, useState } from "react"

import tw from "~/lib/tw"

interface ToastProps {
  message: string
  /** ms (default 5000ms) */
  duration?: number
}

export default function Toast({ message, duration = 5000 }: ToastProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration)
    return () => clearTimeout(timer)
  }, [duration])

  if (!visible) {
    return null
  }

  return (
    <output
      className={tw(
        "fixed top-4 left-1/2 z-50 -translate-x-1/2",
        "w-max max-w-[calc(100vw-2rem)] rounded px-2 py-1",
        "bg-primary text-pure-white shadow-md",
        "flex items-center gap-2",
      )}
    >
      <RiInformation2Fill size={18} />
      {message}
    </output>
  )
}
