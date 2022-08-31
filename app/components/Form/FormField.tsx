import type { FC, ReactNode } from "react"

type FormFieldProps = {
  children: ReactNode
}

const FormField: FC<FormFieldProps> = ({ children }) => {
  return <div className="mt-1">{children}</div>
}

export default FormField
