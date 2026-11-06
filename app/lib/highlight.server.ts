import { bundledLanguages, bundledLanguagesInfo, codeToHtml, type BundledLanguage } from "shiki"

export function isSupportedLanguage(value: unknown): value is BundledLanguage {
  return typeof value === "string" && Object.hasOwn(bundledLanguages, value)
}

export function highlightContent(content: string, lang: string | null) {
  return codeToHtml(content, {
    lang: isSupportedLanguage(lang) ? lang : "text",
    theme: "github-light",
  })
}

export const supportedLanguages = bundledLanguagesInfo.map((l) => ({ id: l.id, name: l.name }))
