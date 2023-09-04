import { RectangleGroupIcon } from '@heroicons/react/24/outline'

import IconToggleButton from 'components/core/icon-toggle-button'
import useCustomizablePlayerContext from 'hooks/useCustomizablePlayerContext'

export default function ToggleEnableCustomizationOptions() {
  const { areCustomizationOptionsEnabled, setAreCustomizationOptionsEnabled } =
    useCustomizablePlayerContext()

  if (areCustomizationOptionsEnabled == null) return null
  if (setAreCustomizationOptionsEnabled == null) return null

  return (
    <IconToggleButton
      icon={<RectangleGroupIcon />}
      value={areCustomizationOptionsEnabled}
      setValue={setAreCustomizationOptionsEnabled}
      tooltip={
        areCustomizationOptionsEnabled
          ? 'Hide Customization Options'
          : 'Show Customization Options'
      }
    />
  )
}
