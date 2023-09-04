import { StreamConfig, StreamElement } from 'types/element'

/**
 * Returns a clone of the specified element's data out of the specified stream config.
 * The data is cloned such that it is not mutated by accident, causing unwanted behavior.
 *
 * @param streamConfig the StreamConfig to retrieve the StreamElement data from
 * @param elementInstanceId the element for which the data should be retrieved
 *
 * @returns the StreamElement data of the specified element.
 */
export default function getElementFromSpecifiedStreamConfig(
  streamConfig: StreamConfig | null,
  elementInstanceId: string,
): StreamElement | null {
  if (streamConfig == null) return null
  if (streamConfig.elements == null) return null

  // Find the element's instance to customize
  const element = streamConfig.elements.find(
    (e) => e.instanceId === elementInstanceId,
  )

  if (element == null) return null

  return structuredClone(element)
}
