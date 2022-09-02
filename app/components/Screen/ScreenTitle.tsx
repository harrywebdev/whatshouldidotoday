import type { FC, ReactNode } from "react"

type ScreenTitleProps = {
  children: ReactNode
  className?: string
}

const ScreenTitle: FC<ScreenTitleProps> = ({ children, className }) => {
  return (
    <h1
      className={`text-md font-semibold leading-relaxed whitespace-nowrap text-center ${className}`}
    >
      {children}
    </h1>
  )
}

export default ScreenTitle
