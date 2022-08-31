import type { FC, ReactNode } from "react"

type FormFieldDescriptionProps = {
  children: ReactNode
}

const FormFieldDescription: FC<FormFieldDescriptionProps> = ({ children }) => {
  return <p className="mt-2 text-sm text-gray-500">{children}</p>
}

export default FormFieldDescription
