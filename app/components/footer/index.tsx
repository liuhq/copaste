import tw from "~/lib/tw"

export default function Footer() {
  const flexStyle = tw("flex items-center justify-center")

  return (
    <footer
      className={tw(
        flexStyle,
        "w-full flex-wrap gap-x-4 gap-y-1 py-2 text-sm text-mid-black [&_a]:hover:text-primary",
      )}
    >
      <p className={tw(flexStyle, "gap-1")}>
        <span>Copaste</span>
        <span>·</span>
        <span>by</span>
        <a href="https://github.com/liuhq" target="_blank" rel="noopener noreferrer">
          ~horin
        </a>
      </p>
      <p className={tw(flexStyle, "gap-1")}>
        <a href="https://github.com/liuhq/copaste" target="_blank" rel="noopener noreferrer">
          Source
        </a>
        <span>·</span>
        <a
          href="https://github.com/liuhq/copaste/issues/new"
          target="_blank"
          rel="noopener noreferrer"
        >
          Feedback
        </a>
      </p>
    </footer>
  )
}
