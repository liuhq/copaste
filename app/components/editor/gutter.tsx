interface GutterProps extends React.ComponentPropsWithRef<"div"> {
  lineCount: number
}

export default function Gutter({ lineCount }: GutterProps) {
  return (
    <div
      aria-hidden="true"
      className="sticky left-0 min-h-max min-w-[calc(2ch+0.5rem+2px)] shrink-0 border-r-2 border-r-white bg-pure-white pr-2 text-end select-none"
    >
      {Array.from({ length: lineCount }, (_, i) => (
        <div key={i}>{i + 1}</div>
      ))}
    </div>
  )
}
