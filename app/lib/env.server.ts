import { isNonEmptyString } from "./predicate"

export function readEnv(key: string, callback?: string): string {
  const raw = process.env[key]

  if (raw === undefined) {
    if (callback === undefined) {
      throw new Error(`Environment ${key} is required`)
    } else {
      return callback
    }
  }

  if (!isNonEmptyString(raw)) {
    throw new Error(`Invalid raw environment ${key}`)
  }

  return raw
}
