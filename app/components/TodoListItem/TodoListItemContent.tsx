import type { FC, ReactNode } from "react"

type TodoListItemContentProps = {
  children: ReactNode
}

const TodoListItemContent: FC<TodoListItemContentProps> = ({ children }) => {
  return <span className="flex-auto">{children}</span>
}

export default TodoListItemContent
