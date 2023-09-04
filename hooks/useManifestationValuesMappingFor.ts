import useCustomizablePlayerContext from 'hooks/useCustomizablePlayerContext'
import { StreamElement, StreamElementManifestation } from 'types/element'
import getAbsoluteTimeBasedOnRange from 'utils/getAbsoluteTimeBasedOnRange'
import getStreamElementManifestations from 'utils/getStreamElementManifestations'

/**
 * This hook provides the mappings from `StreamElementManifestations` to strings to display
 *  inside the listbox.
 * These values are computed based on the type of element, in order to correctly reflect
 *  the element's behavior.
 *
 * For example, the manifestation `onEvent` inside the element `Currently Playing Music`
 *  reacts to a new song, while `onEvent` in other elements might react to other events
 *  (e.g., a new subscription or a new donation).
 *
 * @param elementInstanceId the element to retrieve the mapping for
 * @returns the descriptions of each manifestation to show in the `ManifestationControl`
 *  listbox of an element
 */
export default function useManifestationValuesMappingFor(
  elementInstanceId: StreamElement['instanceId'],
): Record<StreamElementManifestation, string> | null {
  const { getElementData } = useCustomizablePlayerContext()
  if (getElementData == null) return null

  const elementData = getElementData(elementInstanceId)
  if (elementData == null) return null

  const { identifier } = elementData

  switch (identifier) {
    case 'currently_playing_music': {
      const manifestations = getStreamElementManifestations(elementData)
      if (manifestations == null) return null

      const onEventDurationRange = manifestations.onEvent?.durationRange
      if (onEventDurationRange == null) return null

      const onIntervalDurationRange = manifestations.onInterval?.durationRange
      if (onIntervalDurationRange == null) return null
      const onIntervalIntervalRange = manifestations.onInterval?.intervalRange
      if (onIntervalIntervalRange == null) return null

      const durationInPercent = elementData.config.duration
      const intervalInPercent = elementData.config.interval

      return {
        continuous: 'Always',
        onEvent: `When Song Changes for ${Math.round(
          getAbsoluteTimeBasedOnRange(onEventDurationRange, durationInPercent),
        )} Seconds`,
        onInterval: `Every ${Math.round(
          getAbsoluteTimeBasedOnRange(
            onIntervalIntervalRange,
            intervalInPercent,
          ),
        )} Seconds for ${Math.round(
          getAbsoluteTimeBasedOnRange(
            onIntervalDurationRange,
            durationInPercent,
          ),
        )} Seconds`,
      }
    }
    default:
      return null
  }
}
