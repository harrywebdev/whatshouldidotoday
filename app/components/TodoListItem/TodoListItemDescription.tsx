import type { FC, ReactNode } from "react"

type TodoListItemDescriptionProps = {
  children: ReactNode
}

const TodoListItemDescription: FC<TodoListItemDescriptionProps> = ({ children }) => {
  return (
    <span className="text-xs text-gray-700 inline-block">
      {children}
    </span>
  )
}

export default TodoListItemDescription
