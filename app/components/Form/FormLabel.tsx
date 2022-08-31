import type { FC, ReactNode } from "react"

type FormLabelProps = {
  children: ReactNode
  htmlFor: string
}

const FormLabel: FC<FormLabelProps> = ({ children, htmlFor }) => {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-gray-700"
    >
      {children}
    </label>
  )
}

export default FormLabel
