import type { FC } from "react"

type FormInputProps = {
  id: string
  type: string
  name: string
  defaultValue?: string | number
  placeholder?: string
  autoComplete?: string
  required?: boolean
}

const FormInput: FC<FormInputProps> = (props) => {
  const { id, type, name, defaultValue, placeholder, autoComplete, ...attrs } =
    props
  return (
    <input
      type={type}
      name={name}
      id={id}
      autoComplete={autoComplete}
      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2"
      placeholder={placeholder}
      defaultValue={defaultValue}
      {...attrs}
    />
  )
}

export default FormInput
