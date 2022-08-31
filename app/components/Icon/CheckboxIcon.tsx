import type { FC } from "react"

type CheckboxIconProps = {
  isChecked: boolean
}

const defaultStyle = "bg-white text-primary-600"
const checkedStyle = "bg-primary-600 text-white"

const CheckboxIcon: FC<CheckboxIconProps> = ({ isChecked }) => {
  return (
    <span
      className={`flex w-7 h-7 rounded-full border-2 items-center justify-center border-primary-600 ${
        isChecked ? checkedStyle : defaultStyle
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`w-4 h-4 ${isChecked ? "visible" : "invisible"}`}
      >
        <path
          fillRule="evenodd"
          d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
          clipRule="evenodd"
          stroke="currentColor"
          strokeWidth={2}
        />
      </svg>
    </span>
  )
}

export default CheckboxIcon
