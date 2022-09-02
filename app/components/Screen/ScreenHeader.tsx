import type { FC, ReactNode } from "react"
import ScreenTitle from "~/components/Screen/ScreenTitle"

type ScreenHeaderProps = {
  leftAction?: ReactNode
  title?: string
  rightAction?: ReactNode
}

const ScreenHeader: FC<ScreenHeaderProps> = ({
  leftAction,
  rightAction,
  title,
}) => {
  const className = `
    max-w-full w-96 mx-auto
    flex items-center justify-between
    px-4 py-2 bg-neutral-100 border-b border-gray-400 shadow-sm
  `
  return (
    <header className="fixed top-0 left-0 w-full">
      <div className={className}>
        <div className="flex-none w-20">{leftAction}</div>
        <ScreenTitle className="flex-auto">{title}</ScreenTitle>
        <div className="flex-none w-20 flex justify-end">{rightAction}</div>
      </div>
    </header>
  )
}

export default ScreenHeader
