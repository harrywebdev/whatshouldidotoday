import type { FC, ReactNode } from "react"

type ScreenContentProps = {
  children: ReactNode
}

const ScreenContent: FC<ScreenContentProps> = ({ children }) => {
  return <section className="py-2">{children}</section>
}

export default ScreenContent
