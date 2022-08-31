import type { FC, ReactNode } from "react"

type FormLegendProps = {
  children: ReactNode
}

const FormLegend: FC<FormLegendProps> = ({ children }) => {
  return (
    <legend className="block text-sm font-medium text-gray-700">
      {children}
    </legend>
  )
}

export default FormLegend
