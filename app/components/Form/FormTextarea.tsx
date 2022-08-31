import type { FC } from "react"

type FormTextareaProps = {
  id: string
  name: string
  defaultValue?: string
  placeholder?: string
}

const FormTextarea: FC<FormTextareaProps> = ({
  id,
  name,
  defaultValue,
  placeholder,
}) => {
  return (
    <textarea
      id={id}
      name={name}
      rows={3}
      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2"
      placeholder={placeholder}
      defaultValue={defaultValue}
    />
  )
}

export default FormTextarea
