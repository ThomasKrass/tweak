import { Dispatch, SetStateAction, cloneElement } from 'react'

import Tooltip from 'components/core/tooltip'

export interface IconToggleButtonProps {
  icon: JSX.Element
  value: boolean
  setValue: Dispatch<SetStateAction<boolean>>
  tooltip?: string
}

/**
 * A generic icon toggle button for toggling between "on" and "off".
 * If the button is toggled "on", its color changes to the edit mode color.
 */
export default function IconToggleButton({
  icon,
  value,
  setValue,
  tooltip,
}: IconToggleButtonProps) {
  const handleClick = () => {
    setValue((v) => !v)
  }

  return (
    <Tooltip content={tooltip}>
      <button
        onClick={handleClick}
        className={`
        p-2 
        transition-colors 
        duration-200 
        ease-in-out 
        rounded-full 
        hover:bg-white/10 
        focus:outline-none 
        active:bg-white/20 
        ${value ? 'text-editing' : ''}
      `}
      >
        {cloneElement(icon, { className: 'w-5 h-5' })}
      </button>
    </Tooltip>
  )
}
