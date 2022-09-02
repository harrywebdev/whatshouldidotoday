import type { FC, ReactNode } from "react"

type ScreenHeaderProps = {
  children: ReactNode
}

const ScreenHeader: FC<ScreenHeaderProps> = ({ children }) => {
  const className = `
    max-w-full w-96 mx-auto
    flex items-center justify-between
    px-4 py-2 bg-neutral-100 border-b border-gray-400 shadow-sm
  `
  return (
    <header className="fixed top-0 left-0 w-full">
      <div className={className}>{children}</div>
    </header>
  )
}

export default ScreenHeader
