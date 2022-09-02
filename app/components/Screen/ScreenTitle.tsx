import type { FC, ReactNode } from "react"

type ScreenTitleProps = {
  children: ReactNode
}

const ScreenTitle: FC<ScreenTitleProps> = ({ children }) => {
  return (
    <h1 className="text-md font-semibold leading-relaxed whitespace-nowrap">
      {children}
    </h1>
  )
}

export default ScreenTitle
