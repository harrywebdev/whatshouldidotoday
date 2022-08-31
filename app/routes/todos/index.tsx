import { useLoaderData } from "@remix-run/react"
import type { LoaderFunction } from "@remix-run/node"
import type { Todo } from "@prisma/client"
import { db } from "~/utils/db.server"
import { json } from "@remix-run/node"
import ScreenHeader from "~/components/ScreenHeader"
import LargeTitle from "~/components/LargeTitle"
import ScreenHeaderNavLink from "~/components/ScreenHeaderNavLink"
import TodoItem from "~/components/TodoItem"

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
      <ScreenHeader>
        <LargeTitle>Current TODOs</LargeTitle>
        <ScreenHeaderNavLink
          to={"/todos/new"}
          label={"Add New"}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          }
        />
      </ScreenHeader>
      <section>
        <ul>
          {data.todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </ul>
      </section>
    </>
  )
}
