import { type RouteConfig, index, route, prefix } from "@react-router/dev/routes"

export default [
  index("routes/home.tsx"),

  ...prefix("auth", [
    route("login", "./routes/auth.login.ts"),
    route("logout", "./routes/auth.logout.ts"),
    route("callback", "./routes/auth.callback.ts"),
  ]),
] satisfies RouteConfig
