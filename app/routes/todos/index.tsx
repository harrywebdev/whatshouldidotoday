import { useLoaderData } from "@remix-run/react"
import type { LoaderFunction } from "@remix-run/node"
import type { Todo } from "@prisma/client"
import { db } from "~/utils/db.server"
import { json } from "@remix-run/node"
import ScreenHeader from "~/components/ScreenHeader"
import LargeTitle from "~/components/LargeTitle"
import ScreenHeaderNavLink from "~/components/ScreenHeaderNavLink"
import TodoItem from "~/components/TodoItem"
import SecondaryTitle from "~/components/SecondaryTitle"

type LoaderData = { todos: Todo[] }

export const loader: LoaderFunction = async () => {
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

  // group by repeat
  const todos = [
    { label: "Every Day", items: [], repeat: "fr,mo,sa,su,th,tu,we" },
    { label: "Monday", items: [], repeat: "mo" },
    { label: "Tuesday", items: [], repeat: "tu" },
    { label: "Wednesday", items: [], repeat: "we" },
    { label: "Thursday", items: [], repeat: "th" },
    { label: "Friday", items: [], repeat: "fr" },
    { label: "Saturday", items: [], repeat: "sa" },
    { label: "Sunday", items: [], repeat: "su" },
  ].map((group) => {
    return {
      ...group,
      items: data.todos.filter((todo) => {
        // either it's every day
        if (group.repeat.length === 20) {
          return todo.repeat.length === group.repeat.length
        }

        return todo.repeat.split(",").includes(group.repeat)
      }),
    }
  })

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
        {todos.map((group) => (
          <>
            <SecondaryTitle className="px-4">{group.label}</SecondaryTitle>
            <ul key={group.repeat}>
              {group.items.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </ul>
          </>
        ))}
      </section>
    </>
  )
}
