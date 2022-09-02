import type { FC } from "react"

type ButtonProps = {
  type: "submit" | "button" | "reset"
  label: string
  name?: string
  value?: string
  className?: string
  primary?: boolean
}

const defaultStyles =
  "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-primary-500 font-medium"
const primaryStyles =
  "border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white focus:ring-primary-500 font-semibold"

const Button: FC<ButtonProps> = (props) => {
  const { type, label, primary, className, ...attrs } = props

  const styles = typeof primary !== "undefined" ? primaryStyles : defaultStyles

  return (
    <button
      type={type}
      className={`inline-flex items-center rounded-md border px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles} ${className}`}
      {...attrs}
    >
      {/*Heroicon name: */}
      {/* svg `className="-ml-1 mr-2 h-5 w-5"` */}
      {label}
    </button>
  )
}

export default Button
