import { CustomizeResult } from 'types/customize-result'
import { StreamConfig, StreamElement } from 'types/element'

export default function resetElementCustomizationInSpecifiedConfig(
  streamConfig: StreamConfig | null,
  streamConfigUpdateFn: ((newConfig: StreamConfig | null) => void) | null,
  streamConfigFromStreamer: StreamConfig | null,
  elementInstanceId: string,
): CustomizeResult {
  if (streamConfig == null)
    return { status: 'error', message: 'currentConfig is not defined' }
  if (streamConfig.elements == null)
    return { status: 'error', message: 'currentConfig.elements is not defined' }
  if (streamConfigUpdateFn == null)
    return { status: 'error', message: 'streamConfigUpdateFn is not defined' }
  if (streamConfigFromStreamer == null)
    return {
      status: 'error',
      message: 'streamConfigFromStreamer is not defined',
    }

  const updatedConfig = structuredClone(streamConfig)

  // Find the element's instance to customize
  const element = updatedConfig.elements.find(
    (e) => e.instanceId === elementInstanceId,
  )

  if (element == null)
    return { status: 'error', message: 'element is not defined' }
  if (element.config == null)
    return { status: 'error', message: 'element.config is not defined' }

  const resetElementConfig: StreamElement['config'] | null = (() => {
    const elementInStreamerConfigFromStreamer =
      streamConfigFromStreamer.elements.find(
        (e) => e.instanceId === elementInstanceId,
      )

    if (elementInStreamerConfigFromStreamer == null) return null

    return elementInStreamerConfigFromStreamer.config
  })()

  if (resetElementConfig == null)
    return {
      status: 'error',
      message: "Cannot reset the element to the streamer's config",
    }

  const elementConfigBeforeReset = structuredClone(element.config)

  element.config = resetElementConfig

  // If the layer of the element to reset had been changed, reset the layers of all other elements
  //  as well. This needs to be done since otherwise there could be two or more elements with
  //  the same layer, resulting in rendering issues.
  if (elementConfigBeforeReset.layer !== resetElementConfig.layer) {
    for (const element of updatedConfig.elements) {
      const elementDataFromStreamer = streamConfigFromStreamer.elements.find(
        (e) => e.instanceId === element.instanceId,
      )
      if (elementDataFromStreamer == null) continue

      const initialLayerOfElement = elementDataFromStreamer.config.layer
      element.config.layer = initialLayerOfElement
    }
  }

  streamConfigUpdateFn(updatedConfig)

  return { status: 'success' }
}
