// TODO: read from environment variable
const getOrigin = () => "http://localhost:5173"

export function getPreviewPath(slug: string) {
  return `/p/${slug}`
}

export function getPreviewURL(slug: string) {
  return new URL(getPreviewPath(slug), getOrigin())
}

export function getWritePath(slug: string) {
  return `/w/${slug}`
}

export function newWritePath() {
  return "/w"
}
