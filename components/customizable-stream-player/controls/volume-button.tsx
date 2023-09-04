import { Popover } from '@headlessui/react'
import {
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from '@heroicons/react/24/outline'
import { ChangeEventHandler, MouseEventHandler } from 'react'

import IconButton from 'components/core/icon-button'
import Tooltip from 'components/core/tooltip'
import VolumeControl from 'components/customization-options/controls/volume-control'
import useCustomizablePlayerContext from 'hooks/useCustomizablePlayerContext'

export default function VolumeButton() {
  const {
    masterVolume,
    setMasterVolume,
    isMasterVolumeMuted,
    setIsMasterVolumeMuted,
    streamConfig,
    areCustomizationOptionsEnabled,
  } = useCustomizablePlayerContext()

  if (streamConfig == null) return null
  if (masterVolume == null) return null
  if (setMasterVolume == null) return null
  if (isMasterVolumeMuted == null) return null
  if (setIsMasterVolumeMuted == null) return null
  if (areCustomizationOptionsEnabled == null) return null

  // Only display elements that include an audio source inside the audio mixer.
  const elementsWithAudioSource = streamConfig.elements.filter(
    (element) =>
      element.attributes.find(
        (attribute) => attribute.identifier === 'audio_source',
      ) != null,
  )

  const handleMasterVolumeChange: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    setMasterVolume(Number(event.target.value) * 0.01)
  }

  const handleVolumeButtonClick: MouseEventHandler<HTMLButtonElement> = () => {
    setIsMasterVolumeMuted((previousValue) => !previousValue)
  }

  const isCustomizationOptionChangeVolumeEnabledByPlatformVendor =
    process.env.NEXT_PUBLIC_CUSTOMIZATION_OPTION_CHANGE_VOLUME_ENABLED ===
    'true'

  return (
    <div className="flex flex-row">
      <div className="flex flex-row items-center justify-start gap-2">
        <IconButton
          icon={
            isMasterVolumeMuted ? <SpeakerXMarkIcon /> : <SpeakerWaveIcon />
          }
          tooltip={isMasterVolumeMuted ? 'Unmute' : 'Mute'}
          onClick={handleVolumeButtonClick}
        />
        {!isMasterVolumeMuted && (
          <Tooltip
            content={`Volume: ${Math.round(masterVolume * 100)}%`}
            hideOnClick={false}
          >
            <input
              type="range"
              className="accent-white hover:cursor-grab active:cursor-grabbing"
              min={0}
              max={100}
              value={masterVolume * 100}
              onChange={handleMasterVolumeChange}
            />
          </Tooltip>
        )}
      </div>
      {areCustomizationOptionsEnabled &&
        isCustomizationOptionChangeVolumeEnabledByPlatformVendor && (
          <Popover className="relative">
            {({ open }) => (
              <>
                <Tooltip content={open ? undefined : 'Audio Mixer'}>
                  <Popover.Button className="p-2 transition-colors duration-200 ease-in-out rounded-full hover:bg-white/10 focus:outline-none active:bg-white/20">
                    {open ? (
                      <ChevronDownIcon className="w-5 h-5" />
                    ) : (
                      <AdjustmentsHorizontalIcon className="w-5 h-5" />
                    )}
                  </Popover.Button>
                </Tooltip>

                <Popover.Panel className="bottom-[calc(100%+1rem)] flex flex-col items-center gap-1 absolute p-4 mt-2 text-white origin-bottom-right rounded-md shadow-lg  bg-black/90">
                  <h4>Audio Mixer</h4>
                  <div>
                    {elementsWithAudioSource.map(({ instanceId }) => (
                      <VolumeControl
                        elementInstanceId={instanceId}
                        key={instanceId}
                        withNameOfElement
                      />
                    ))}
                  </div>
                </Popover.Panel>
              </>
            )}
          </Popover>
        )}
    </div>
  )
}
