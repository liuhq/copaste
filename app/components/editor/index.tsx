import { useMemo, useState } from "react"

const countLines = (t: string) => t.split("\n").length

interface GutterProps extends React.ComponentPropsWithRef<"div"> {
  lineCount: number
}

const Gutter = ({ lineCount }: GutterProps) => {
  return (
    <div
      aria-hidden="true"
      className="sticky left-0 h-max min-w-[calc(2ch+0.5rem+2px)] shrink-0 border-r-2 border-r-white bg-pure-white pr-2 text-end select-none"
    >
      {Array.from({ length: lineCount }, (_, i) => (
        <div key={i}>{i + 1}</div>
      ))}
    </div>
  )
}

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
      className="flex min-h-0 min-w-0 flex-1 overflow-auto font-mono text-base/8"
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
          required
        />
      </div>
    </div>
  )
}
