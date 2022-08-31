import type { FC } from "react"
import { Link } from "@remix-run/react"
import type { Todo } from "@prisma/client"
import TodoListItem from "~/components/TodoListItem/TodoListItem"
import TodoListItemTitle from "~/components/TodoListItem/TodoListItemTitle"
import TodoListItemDescription from "~/components/TodoListItem/TodoListItemDescription"
import type { SerializeFrom } from "@remix-run/node"
import TodoListItemLeftSide from "~/components/TodoListItem/TodoListItemLeftSide"
import TodoListItemContent from "~/components/TodoListItem/TodoListItemContent"
import TodoListItemRightSide from "~/components/TodoListItem/TodoListItemRightSide"

type TodoItemProps = {
  todo: SerializeFrom<Todo>
}

const TodoItem: FC<TodoItemProps> = ({ todo }) => {
  const repeat = todo.repeat.split(",").sort().join(",")

  // some logic here
  // 1. single day or a few -> show them individually
  // 2. range show "mo - fr"
  let repeatForHumans = repeat.split(",")
  switch (repeat) {
    // full week
    case "fr,mo,sa,su,th,tu,we":
      repeatForHumans = ["every day"]
      break

    case "fr,mo,th,tu,we":
      repeatForHumans = ["mo-fr"]
      break

    case "sa,su":
      repeatForHumans = ["weekend"]
      break
  }

  return (
    <TodoListItem>
      <TodoListItemLeftSide>
        <span className="flex flex-wrap w-14">
          {repeatForHumans.map((day) => (
            <span
              key={day}
              className="inline-block text-center rounded border border-gray-500 text-gray-900 text-xs font-semibold px-1 py-0.5 m-0.5"
            >
              {day}
            </span>
          ))}
        </span>
      </TodoListItemLeftSide>
      <TodoListItemContent>
        <TodoListItemTitle>{todo.title}</TodoListItemTitle>

        {todo.description && (
          <TodoListItemDescription>{todo.description}</TodoListItemDescription>
        )}
      </TodoListItemContent>

      <TodoListItemRightSide>
        <Link
          to={`/todos/${todo.id}`}
          title="Edit"
          aria-label="Edit"
          className="text-primary-600 underline inline-block px-2 py-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </TodoListItemRightSide>
    </TodoListItem>
  )
}

export default TodoItem
