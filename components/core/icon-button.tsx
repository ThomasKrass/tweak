import { cloneElement } from 'react'

import Tooltip from 'components/core/tooltip'

export interface IconButtonProps {
  icon: JSX.Element
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  tooltip?: string
}

export default function IconButton({
  icon,
  onClick,
  tooltip,
}: IconButtonProps) {
  return (
    <Tooltip content={tooltip}>
      <button
        onClick={onClick}
        className="p-2 transition-colors duration-200 ease-in-out rounded-full hover:bg-white/10 focus:outline-none active:bg-white/20"
      >
        {cloneElement(icon, { className: 'w-5 h-5' })}
      </button>
    </Tooltip>
  )
}
