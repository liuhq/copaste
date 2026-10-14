import { defineConfig } from "oxfmt"

export default defineConfig({
  ignorePatterns: ["build/**", ".react-router/**", "node_modules/**"],
  semi: false,
  sortImports: true,
  sortTailwindcss: {
    stylesheet: "./app/app.css",
  },
  overrides: [
    {
      files: ["**/*.json"],
      options: {
        printWidth: 80,
      },
    },
  ],
})
