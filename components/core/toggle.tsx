import { Switch } from '@headlessui/react'
import { useState } from 'react'

export interface ToggleProps {
  onChange: (newValue: boolean) => void
  initialValue?: boolean
}

/**
 * A basic toggle component.
 */
function Toggle({ onChange, initialValue }: ToggleProps) {
  const [enabled, setEnabled] = useState(initialValue ?? false)

  const handleChange = (newValue: boolean) => {
    setEnabled(newValue)
    onChange(newValue)
  }

  return (
    <Switch
      checked={enabled}
      onChange={handleChange}
      className={`${enabled ? 'bg-editing' : 'bg-white/10'}
          relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
    >
      <span
        aria-hidden="true"
        className={`${enabled ? 'translate-x-9' : 'translate-x-0'}
            pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
      />
    </Switch>
  )
}

export default Toggle
