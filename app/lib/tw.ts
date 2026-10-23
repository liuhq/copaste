import { isString } from "./predicate"

/**
 * Construct CSS class name, filtering out duplicates.
 * @param cn CSS class name
 */
export default function tw(...cn: unknown[]) {
  return [
    ...new Set(
      cn
        .filter(isString)
        .flatMap((s) => s.split(" "))
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  ].join(" ")
}
