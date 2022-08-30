import { Link, LiveReload, Outlet } from "@remix-run/react"
import styles from "./styles/app.css"

export function links() {
  return [{ rel: "stylesheet", href: styles }]
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>What should I do today?</title>
      </head>
      <body>
        <header>
          <h1>What should I do today?</h1>
          <nav>
            <menu>
              <li>
                <Link to="/" title="Today" aria-label="Today">
                  [ Today ]
                </Link>
              </li>
              <li>
                <Link to="/history" title="History" aria-label="History">
                  [ History ]
                </Link>
              </li>
              <li>
                <Link to="/todos" title="TODOs" aria-label="TODOs">
                  [ TODOs ]
                </Link>
              </li>
            </menu>
          </nav>
        </header>
        <main>
          <Outlet />
        </main>
        <footer>
          <p>
            &copy; What should I do today? by{" "}
            <a href="https://github.com/harrywebdev">@harrywebdev</a>
          </p>
        </footer>
        <LiveReload />
      </body>
    </html>
  )
}
