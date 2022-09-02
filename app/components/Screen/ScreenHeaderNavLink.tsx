import type { FC, JSXElementConstructor, ReactElement, ReactNode } from "react"
import { Link } from "@remix-run/react"
import { cloneElement } from "react"

type ScreenHeaderNavLinkProps = {
  to: string
  label?: string
  icon?: ReactElement
}

const ScreenHeaderNavLink: FC<ScreenHeaderNavLinkProps> = ({
  to,
  label,
  icon,
}) => {
  let Icon
  if (typeof icon !== "undefined") {
    Icon = cloneElement(icon, { className: "-ml-1 h-5 w-5" })
  }

  return (
    <nav>
      <Link
        to={to}
        title={label}
        aria-label={label}
        className="inline-flex items-center justify-between rounded-md border px-3 py-1 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-primary-500 peer"
      >
        {Icon}
        {Icon && label ? (
          <span className="ml-2">{label}</span>
        ) : label ? (
          label
        ) : (
          ""
        )}
      </Link>
    </nav>
  )
}

export default ScreenHeaderNavLink
