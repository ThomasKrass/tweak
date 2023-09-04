import { ChangeEventHandler } from 'react'

import Listbox from 'components/core/listbox'
import Tooltip from 'components/core/tooltip'
import useCustomizablePlayerContext from 'hooks/useCustomizablePlayerContext'
import useManifestationValuesMappingFor from 'hooks/useManifestationValuesMappingFor'
import { StreamElement, StreamElementManifestation } from 'types/element'
import absoluteTimeToPercentageBasedOnRange from 'utils/absoluteTimeToPercentageBasedOnRange'
import getAbsoluteTimeBasedOnRange from 'utils/getAbsoluteTimeBasedOnRange'
import getStreamElementManifestations from 'utils/getStreamElementManifestations'

export interface OpacityControlProps {
  elementInstanceId: StreamElement['instanceId']
}

/**
 * A control for customizing when and for how long the given element should be present
 *  inside the stream.
 *
 * @param elementInstanceId the instanceId of the element to customize
 */
export default function ManifestationControl({
  elementInstanceId,
}: OpacityControlProps) {
  const { streamConfig, customize, getElementData } =
    useCustomizablePlayerContext()

  const valuesMapping = useManifestationValuesMappingFor(elementInstanceId)

  if (streamConfig == null) return null
  if (customize == null) return null
  if (getElementData == null) return null
  if (valuesMapping == null) return null

  const elementData = getElementData(elementInstanceId)

  if (elementData == null) return null

  const manifestations = getStreamElementManifestations(elementData)
  if (manifestations == null) return null

  const selectedManifestation = elementData.config.manifestation

  const onEvent = manifestations.onEvent
  if (onEvent == null) return null

  const onInterval = manifestations.onInterval
  if (onInterval == null) return null

  const intervalRange = onInterval.intervalRange
  const durationRange =
    selectedManifestation === 'onEvent'
      ? onEvent.durationRange
      : onInterval.durationRange

  const interval = getAbsoluteTimeBasedOnRange(
    intervalRange,
    elementData.config.interval,
  )
  const duration = getAbsoluteTimeBasedOnRange(
    durationRange,
    elementData.config.duration,
  )

  const handleIntervalChange: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    const newInterval = absoluteTimeToPercentageBasedOnRange(
      intervalRange,
      Number(event.target.value),
    )

    customize(elementInstanceId, 'interval', newInterval)
  }

  const handleDurationChange: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    const newDuration = absoluteTimeToPercentageBasedOnRange(
      durationRange,
      Number(event.target.value),
    )

    customize(elementInstanceId, 'duration', newDuration)
  }

  const valueToString = (value: StreamElementManifestation) => {
    return valuesMapping[value]
  }

  const setSelectedManifestation = (newValue: StreamElementManifestation) => {
    customize(elementInstanceId, 'manifestation', newValue)
  }

  return (
    <div className="flex flex-col gap-2">
      <Listbox<StreamElementManifestation>
        values={Object.keys(valuesMapping) as StreamElementManifestation[]}
        selectedValue={selectedManifestation}
        setSelectedValue={setSelectedManifestation}
        valueToString={valueToString}
      />
      {selectedManifestation === 'onInterval' && (
        <Tooltip
          content={`Interval: ${Math.round(interval)}s`}
          hideOnClick={false}
        >
          <input
            type="range"
            className="accent-editing hover:cursor-grab active:cursor-grabbing"
            min={intervalRange.from}
            max={intervalRange.to}
            value={interval}
            onChange={handleIntervalChange}
          />
        </Tooltip>
      )}
      {selectedManifestation !== 'continuous' && (
        <Tooltip
          content={`Duration: ${Math.round(duration)}s`}
          hideOnClick={false}
        >
          <input
            type="range"
            className="accent-editing hover:cursor-grab active:cursor-grabbing"
            min={durationRange.from}
            max={durationRange.to}
            value={duration}
            onChange={handleDurationChange}
          />
        </Tooltip>
      )}
    </div>
  )
}
