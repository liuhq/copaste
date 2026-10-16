export type Predicate<T> = (value: unknown) => value is T

const optional =
  <T>(predicate: Predicate<T>): Predicate<T | undefined> =>
  (value): value is T | undefined =>
    value === undefined || predicate(value)

const isStringFields = (p: object): p is Record<string, unknown> => Object.keys(p).every(isString)

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && isStringFields(value)
}

export function isRecordWithValue<Value>(
  value: unknown,
  predicate: (v: Record<string, unknown>) => v is Record<string, Value>,
): value is Record<string, Value> {
  return isRecord(value) && predicate(value)
}

export function isString(value: unknown): value is string {
  return typeof value === "string"
}

export function isOptionalString(value: unknown) {
  return optional(isString)(value)
}

export function isNonEmptyString(value: unknown): value is string {
  return isString(value) && value.trim() !== ""
}

export function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0
}
