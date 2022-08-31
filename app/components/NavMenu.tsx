import type { FC, ReactNode } from "react"
import { NavLink } from "@remix-run/react"

type NavMenuItemProps = {
  to: string
  label: string
}

const NavMenuItemStyle = "block font-medium rounded-md py-1"
const NavMenuItemActiveStyle =
  NavMenuItemStyle + " font-bold shadow-sm bg-white"

const NavMenuItem: FC<NavMenuItemProps> = ({ to, label }) => {
  return (
    <li className="flex-1 text-center text-xs">
      <NavLink
        to={to}
        title={label}
        aria-label={label}
        className={({ isActive }) =>
          isActive ? NavMenuItemActiveStyle : NavMenuItemStyle
        }
      >
        {label}
      </NavLink>
    </li>
  )
}

type NavMenuPropsChildren = {
  NavMenuItem: FC<NavMenuItemProps>
}

type NavMenuProps = {
  children: (args: NavMenuPropsChildren) => ReactNode
}

const NavMenu: FC<NavMenuProps> = ({ children }) => {
  return (
    <menu className="flex justify-between mb-2 w-72 max-w-full mx-auto bg-neutral-100 px-1 py-1 rounded-md">
      {children({ NavMenuItem })}
    </menu>
  )
}

export default NavMenu
