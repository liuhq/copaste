interface ErrorTip {
  text: string
}

export default function ErrorTip({ text }: ErrorTip) {
  return <div className="min-h-lh text-sm text-red">{text} </div>
}
