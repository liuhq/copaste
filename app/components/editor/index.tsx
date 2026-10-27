import { useRef, useState } from "react"

const countLines = (t: string) => t.split("\n").length

interface GutterProps extends React.ComponentPropsWithRef<"div"> {
  lineCount: number
}

const Gutter = ({ lineCount, ref }: GutterProps) => {
  return (
    <div ref={ref} className="min-w-[calc(2ch+0.5rem)] py-2 pe-2 text-end select-none">
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
  const gutterRef = useRef<HTMLDivElement>(null)
  const [lineCount, setLineCount] = useState(countLines(defaultValue))

  const handleInput: React.InputEventHandler<HTMLTextAreaElement> = (evt) => {
    setLineCount(countLines(evt.currentTarget.value))
  }

  return (
    <div className="flex flex-1 font-mono">
      <Gutter ref={gutterRef} lineCount={lineCount} />
      <textarea
        name={name}
        defaultValue={defaultValue}
        className="flex-1 resize-none self-stretch overflow-hidden px-3 py-3"
        onInput={handleInput}
        spellCheck="false"
        wrap="off"
        required
      />
    </div>
  )
}
