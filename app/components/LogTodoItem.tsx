import type { FC } from "react"
import { Link } from "@remix-run/react"
import type { LogTodo } from "@prisma/client"
import TodoListItem from "~/components/TodoListItem/TodoListItem"
import TodoListItemTitle from "~/components/TodoListItem/TodoListItemTitle"
import TodoListItemDescription from "~/components/TodoListItem/TodoListItemDescription"
import type { SerializeFrom } from "@remix-run/node"
import TodoListItemLeftSide from "~/components/TodoListItem/TodoListItemLeftSide"
import TodoListItemContent from "~/components/TodoListItem/TodoListItemContent"
import TodoListItemRightSide from "~/components/TodoListItem/TodoListItemRightSide"
import CheckboxIcon from "~/components/Icon/CheckboxIcon"

type LogTodoItemProps = {
  todo: SerializeFrom<LogTodo>
  dailyLogId: string
  formAction: string
}

const LogTodoItem: FC<LogTodoItemProps> = ({
  todo,
  dailyLogId,
  formAction,
}) => {
  return (
    <TodoListItem>
      <TodoListItemLeftSide>
        <form method="post" action={formAction}>
          <input type="hidden" name="id" value={todo.id} />
          <button type="submit">
            <CheckboxIcon isChecked={todo.isDone} />
          </button>
        </form>
      </TodoListItemLeftSide>
      <TodoListItemContent>
        <TodoListItemTitle>{todo.title}</TodoListItemTitle>

        {todo.description && (
          <TodoListItemDescription>{todo.description}</TodoListItemDescription>
        )}
      </TodoListItemContent>

      <TodoListItemRightSide>
        <Link
          to={`/dailylog/${dailyLogId}/${todo.id}`}
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

export default LogTodoItem
