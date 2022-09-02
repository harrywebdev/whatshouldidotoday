import type { FC, ReactNode } from "react"

type TodoListItemProps = {
  children: ReactNode
}

const TodoListItem: FC<TodoListItemProps> = ({ children }) => {
  return (
    <li className="not-last:border-b border-gray-200 py-2 my-2 ml-4 px-2 flex flex-row items-center">
      {children}
    </li>
  )
}

export default TodoListItem
