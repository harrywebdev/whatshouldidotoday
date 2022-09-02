import type { FC, ReactNode } from "react"

type ItemGroupProps = {
  children: ReactNode
  className?: string
}

const ItemGroup: FC<ItemGroupProps> = ({ children, className }) => {
  return <div className={`mx-3 bg-white rounded-md ${className}`}>{children}</div>
}

export default ItemGroup
