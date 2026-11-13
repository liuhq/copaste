import { useMemo, useState } from "react"

import Gutter from "./gutter"

export const countLines = (t: string) => t.split("\n").length

interface EditorProps {
  name: string
  defaultValue?: string
}

export default function Editor({ name, defaultValue = "" }: EditorProps) {
  const [lineCount, setLineCount] = useState(countLines(defaultValue))

  /* NOTE: Prevent the caret from being obscured by the sticky gutter during
   *       horizontal scrolling.
   */
  const lnDigit = String(lineCount).length
  const paddingScroll = useMemo(
    () => ({
      scrollPaddingLeft: `calc(${1 + Math.max(2, lnDigit)}ch + 0.5rem + 2px)`,
    }),
    [lnDigit],
  )

  const handleInput: React.InputEventHandler<HTMLTextAreaElement> = (evt) => {
    setLineCount(countLines(evt.currentTarget.value))
  }

  return (
    <div
      className="flex min-h-0 min-w-0 flex-1 gap-1 overflow-auto font-mono text-base/8"
      style={paddingScroll}
    >
      <Gutter lineCount={lineCount} />
      <div className="min-w-0 flex-1">
        <textarea
          name={name}
          defaultValue={defaultValue}
          className="block field-sizing-content min-h-full min-w-full resize-none overflow-hidden p-0 focus:outline-0"
          onInput={handleInput}
          spellCheck="false"
          wrap="off"
        />
      </div>
    </div>
  )
}
