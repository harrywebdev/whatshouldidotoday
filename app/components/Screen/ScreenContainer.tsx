import type { FC, ReactNode } from "react"

type ScreenContainerProps = {
  children: ReactNode
}
const ScreenContainer: FC<ScreenContainerProps> = ({ children }) => {
  return (
    <div className="max-w-full w-96 mx-auto pt-12 antialiased">{children}</div>
  )
}
export default ScreenContainer
