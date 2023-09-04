import { StreamConfig } from 'types/element'
import areObjectsEqual from 'utils/areObjectsEqual'

export default function hasElementBeenCustomizedInSpecifiedConfig(
  streamConfig: StreamConfig | null,
  streamConfigFromStreamer: StreamConfig | null,
  elementInstanceId: string,
): boolean | null {
  if (streamConfig == null) return null
  if (streamConfig.elements == null) return null
  if (streamConfigFromStreamer == null) return null

  const updatedConfig = structuredClone(streamConfig)

  // Find the element's instance to customize
  const element = updatedConfig.elements.find(
    (e) => e.instanceId === elementInstanceId,
  )

  if (element == null) return null
  if (element.config == null) return null

  const elementInStreamerConfigFromStreamer =
    streamConfigFromStreamer.elements.find(
      (e) => e.instanceId === elementInstanceId,
    )

  if (elementInStreamerConfigFromStreamer == null) return null
  if (elementInStreamerConfigFromStreamer.config == null) return null

  return !areObjectsEqual(
    element.config,
    elementInStreamerConfigFromStreamer.config,
  )
}
