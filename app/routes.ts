import { type RouteConfig, index, route, prefix, layout } from "@react-router/dev/routes"

export default [
  layout("./routes/app-layout.tsx", [
    index("routes/app-index.tsx"),

    ...prefix("auth", [
      route("login", "./routes/auth.login.ts"),
      route("logout", "./routes/auth.logout.ts"),
      route("callback", "./routes/auth.callback.ts"),
    ]),

    route("p/:publicID", "./routes/preview.tsx"),
    route("w/:publicID?", "./routes/edit.tsx"),
  ]),
] satisfies RouteConfig
