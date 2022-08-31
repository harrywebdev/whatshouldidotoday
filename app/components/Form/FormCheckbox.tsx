import type { FC } from "react"

type FormCheckboxProps = {
  id: string
  name: string
  value: string
  defaultChecked?: boolean
  label: string
  description?: string
}

const FormCheckbox: FC<FormCheckboxProps> = ({
  id,
  name,
  value,
  defaultChecked,
  label,
  description,
}) => {
  return (
    <div className="flex items-start">
      <div className="flex h-5 items-center">
        <input
          id={id}
          name={name}
          type="checkbox"
          defaultChecked={defaultChecked}
          value={value}
          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
      </div>
      <div className="ml-3 text-sm">
        <label htmlFor="comments" className="font-medium text-gray-700">
          {label}
        </label>
        {description && <p className="text-gray-500">{description}</p>}
      </div>
    </div>
  )
}

export default FormCheckbox
