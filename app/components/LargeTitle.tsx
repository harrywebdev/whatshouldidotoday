import type { FC, ReactNode } from "react"

type LargeTitleProps = {
  children: ReactNode
}

const LargeTitle: FC<LargeTitleProps> = ({ children }) => {
  return <h2 className="text-lg font-semibold leading-relaxed whitespace-nowrap">{children}</h2>
}

export default LargeTitle
