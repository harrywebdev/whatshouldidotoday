import { Link } from "@remix-run/react"

export default function TodosIndexRoute() {
  return (
    <header>
      <nav>
        <Link to="/todos/new" title="Add New" aria-label="Add New">
          Add New
        </Link>
      </nav>
    </header>
  )
}
