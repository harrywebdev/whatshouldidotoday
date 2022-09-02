import type { FC, ReactNode } from "react"

type SecondaryTitleProps = {
  children: ReactNode
  className?: string
}

const SecondaryTitle: FC<SecondaryTitleProps> = ({ children, className }) => {
  return (
    <h2
      className={`text-md font-semibold leading-relaxed whitespace-nowrap ${className}`}
    >
      {children}
    </h2>
  )
}

export default SecondaryTitle
