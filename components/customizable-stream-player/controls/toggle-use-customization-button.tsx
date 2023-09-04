import { FingerPrintIcon } from '@heroicons/react/24/outline'

import IconToggleButton from 'components/core/icon-toggle-button'
import useCustomizablePlayerContext from 'hooks/useCustomizablePlayerContext'

export default function ToggleUseCustomizationButton() {
  const { isUsingCustomization, setIsUsingCustomization } =
    useCustomizablePlayerContext()

  if (isUsingCustomization == null) return null
  if (setIsUsingCustomization == null) return null

  return (
    <IconToggleButton
      icon={<FingerPrintIcon />}
      value={isUsingCustomization}
      setValue={setIsUsingCustomization}
      tooltip={
        isUsingCustomization ? "Don't Use Customization" : 'Use Customization'
      }
    />
  )
}
