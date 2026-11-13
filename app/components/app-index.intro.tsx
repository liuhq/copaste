import tw from "~/lib/tw"

const Span = ({ className, ...props }: React.ComponentPropsWithoutRef<"span">) => (
  <span {...props} className={tw("hover:bg-white", className)} />
)

export default function Intro() {
  return (
    <section className="m-auto flex w-full max-w-3xl flex-col gap-6 leading-relaxed select-none">
      <div className="flex flex-col gap-4">
        <h2 className="text-center text-2xl">
          <span
            className={tw(
              "rounded bg-primary px-1 font-bold text-pure-white italic",
              "peer hover:bg-pure-white hover:text-primary",
            )}
          >
            Copaste
          </span>
          <span className="ml-2 px-2 text-mid-black peer-hover:bg-white">Text clipboard</span>
        </h2>
        <p>
          <Span>Save and share</Span> <Span>text or code snippets.</Span> <Span>Open a paste</Span>{" "}
          <Span>with its ID</Span> <Span>or</Span> <Span>share its page link.</Span>
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-center text-lg font-semibold">Features</h3>
        <ul className="list-disc space-y-1 pl-6 marker:text-primary">
          <li>
            <Span>Save</Span> <Span>plain text</Span> <Span>or</Span> <Span>choose a language</Span>{" "}
            <Span>for code syntax highlighting.</Span>
          </li>
          <li>
            <Span>Add</Span> <Span>an optional title</Span> <Span>to make</Span>{" "}
            <Span>your pastes</Span> <Span>easier to find.</Span>
          </li>
          <li>
            <Span>Choose</Span> <Span>an expiration time</Span> <Span>or</Span>{" "}
            <Span>keep a paste</Span> <Span>without an expiration date.</Span>
          </li>
          <li>
            <Span>View,</Span> <Span>edit,</Span> <Span>and delete</Span>{" "}
            <Span>your own pastes</Span> <Span>in</Span> <Span>My pastes.</Span>
          </li>
        </ul>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-center text-lg font-semibold">How to use</h3>
        <ol className="list-decimal space-y-2 pl-6 marker:text-primary">
          <li>
            <strong>
              <Span>Open</Span> <Span>a paste.</Span>
            </strong>{" "}
            <Span>Enter</Span> <Span>its ID</Span> <Span>above</Span> <Span>and</Span>{" "}
            <Span>click the arrow,</Span> <Span>or</Span> <Span>open a shared link</Span>{" "}
            <Span>directly.</Span> <Span>No login</Span> <Span>is needed</Span>{" "}
            <Span>to view a paste.</Span>
          </li>
          <li>
            <strong>
              <Span>Create</Span> <Span>a paste.</Span>
            </strong>{" "}
            <Span>Click</Span> <Span>Log in,</Span> <Span>then</Span>{" "}
            <Span>use the plus button</Span> <Span>on the home page.</Span> <Span>Enter</Span>{" "}
            <Span>your content,</Span> <Span>optionally</Span> <Span>add a title,</Span>{" "}
            <Span>choose</Span> <Span>a language and expiration time,</Span> <Span>and</Span>{" "}
            <Span>click Create.</Span>
          </li>
          <li>
            <strong>
              <Span>Share</Span> <Span>and manage.</Span>
            </strong>{" "}
            <Span>Copy</Span> <Span>the preview page address</Span> <Span>to share</Span>{" "}
            <Span>your paste.</Span> <Span>Open</Span> <Span>My pastes</Span> <Span>to edit</Span>{" "}
            <Span>or delete</Span> <Span>your own pastes.</Span>
          </li>
        </ol>
      </div>
    </section>
  )
}
