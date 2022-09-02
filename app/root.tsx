import { Links, LiveReload, Outlet } from "@remix-run/react"
import styles from "./styles/app.css"
import ScreenContainer from "~/components/ScreenContainer"
import NavMenu from "./components/NavMenu"

export function links() {
  return [{ rel: "stylesheet", href: styles }]
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>What should I do today?</title>
        <Links />
      </head>
      <body className="flex bg-neutral-200">
        <ScreenContainer>
          <header className="hidden">
            <h1 className="text-lg font-medium tracking-wide leading-relaxed uppercase font-mono whitespace-nowrap mb-2 text-center">
              What should I do today?
            </h1>
            <nav>
              <NavMenu>
                {({ NavMenuItem }) => (
                  <>
                    <NavMenuItem to={"/"} label={"Today"} />
                    <NavMenuItem to={"/history"} label={"History"} />
                    <NavMenuItem to={"/todos"} label={"TODOs"} />
                  </>
                )}
              </NavMenu>
            </nav>
          </header>
          <main>
            <Outlet />
          </main>
          <footer className="bg-gray-50 p-5 h-24 flex items-center justify-center hidden">
            <p className="text-center text-xs text-gray-800">
              &copy; What should I do today? by{" "}
              <a
                href="https://github.com/harrywebdev"
                className="font-semibold"
              >
                @harrywebdev
              </a>
            </p>
          </footer>
        </ScreenContainer>
        <LiveReload />
      </body>
    </html>
  )
}
