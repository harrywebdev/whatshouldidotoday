import { Link, useLoaderData } from "@remix-run/react"
import type { LoaderFunction } from "@remix-run/node"
import type { Todo } from "@prisma/client"
import { db } from "~/utils/db.server"
import { json } from "@remix-run/node"

type LoaderData = { todos: Todo[] }

export const loader: LoaderFunction = async () => {
  // TODO: filter by `repeat` according to current day of week

  const data: LoaderData = {
    todos: await db.todo.findMany({
      orderBy: [
        {
          sequence: "asc",
        },
      ],
    }),
  }

  return json(data)
}

export default function TodosIndexRoute() {
  const data = useLoaderData<LoaderData>()

  return (
    <>
      <header>
        <nav>
          <Link to="/todos/new" title="Add New" aria-label="Add New">
            Add New
          </Link>
        </nav>
      </header>
      <section>
        <h2>Current TODOs</h2>
        <ul>
          {data.todos.map((todo) => {
            return (
              <li key={todo.id}>
                <strong>{todo.title}</strong> ({todo.repeat})<br />
                {todo.description}
                <Link to={`/todos/${todo.id}`} title="Edit" aria-label="Edit">
                  [ edit ]
                </Link>
              </li>
            )
          })}
        </ul>
      </section>
    </>
  )
}
