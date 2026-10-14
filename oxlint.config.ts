import { defineConfig } from "oxlint"

export default defineConfig({
  ignorePatterns: ["build/**", ".react-router/**", "node_modules/**"],
  plugins: ["eslint", "typescript", "unicorn", "react", "react-perf", "oxc", "import", "jsx-a11y"],
  categories: {
    correctness: "error",
    suspicious: "warn",
    perf: "warn",
  },
  rules: {
    "import/no-cycle": ["error", { maxDepth: 3 }],
    "react/react-in-jsx-scope": "off",
    "import/no-unassigned-import": ["warn", { allow: ["**/*.css"] }],
  },
  env: {
    builtin: true,
    browser: true,
    node: true,
  },
})
