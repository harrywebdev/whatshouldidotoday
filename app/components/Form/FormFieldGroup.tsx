import type { FC, ReactNode } from "react"

type FormFieldGroupProps = {
  children: ReactNode
}

const FormFieldGroup: FC<FormFieldGroupProps> = ({ children }) => {
  return <div className="mt-3">{children}</div>
}

export default FormFieldGroup
