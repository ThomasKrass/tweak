import VerticalBar from 'components/core/vertical-bar'
import FullscreenButton from 'components/customizable-stream-player/controls/fullscreen-button'
import PlayPauseButton from 'components/customizable-stream-player/controls/play-pause-button'
import ToggleEnableCustomizationOptions from 'components/customizable-stream-player/controls/toggle-enable-customization-options-button'
import ToggleUseCustomizationButton from 'components/customizable-stream-player/controls/toggle-use-customization-button'
import VolumeButton from 'components/customizable-stream-player/controls/volume-button'
import useCustomizablePlayerContext from 'hooks/useCustomizablePlayerContext'

/**
 * Controls for the customizable stream player.
 */
export default function Controls() {
  const { isUsingCustomization, setIsUsingCustomization } =
    useCustomizablePlayerContext()

  if (isUsingCustomization == null) return null
  if (setIsUsingCustomization == null) return null

  return (
    <div className="flex flex-row items-center self-stretch gap-1 p-2 text-white bg-black/90">
      <PlayPauseButton />
      <VolumeButton />
      <div className="flex-1" aria-hidden />
      {isUsingCustomization && <ToggleEnableCustomizationOptions />}
      <ToggleUseCustomizationButton />
      <VerticalBar />
      <FullscreenButton />
    </div>
  )
}
