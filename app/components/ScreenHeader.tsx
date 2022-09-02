import type { FC, ReactNode } from "react"

type ScreenHeaderProps = {
  children: ReactNode
}

const ScreenHeader: FC<ScreenHeaderProps> = ({ children }) => {
  return (
    <header className="flex items-center mb-2 justify-between px-4">
      {children}
    </header>
  )
}

export default ScreenHeader
