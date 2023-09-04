import { CustomizeResult } from 'types/customize-result'
import { StreamConfig, StreamElementConfig, StreamElement } from 'types/element'

/**
 * Update a customizable property inside the given config with the new value
 *  using the given update function.
 *
 * @param streamConfig the config to update
 * @param streamConfigUpdateFn the function for updating the config
 * @param elementInstanceId the element to customize
 * @param propertyName the name of the property to customize
 * @param newValue the new value for the given property
 *
 * @returns status information about the customization
 */
export default function customizeSpecifiedConfigWithUpdateFn(
  streamConfig: StreamConfig | null,
  streamConfigUpdateFn: ((newConfig: StreamConfig | null) => void) | null,
  elementInstanceId: string,
  propertyName: keyof StreamElementConfig,
  newValue: unknown,
): CustomizeResult {
  if (streamConfig == null)
    return { status: 'error', message: 'currentConfig is not defined' }
  if (streamConfig.elements == null)
    return { status: 'error', message: 'currentConfig.elements is not defined' }
  if (streamConfigUpdateFn == null)
    return { status: 'error', message: 'stateUpdateFn is not defined' }

  const updatedConfig = structuredClone(streamConfig)

  // Find the element's instance to customize
  const element = updatedConfig.elements.find(
    (e) => e.instanceId === elementInstanceId,
  )

  if (element == null)
    return { status: 'error', message: 'element is not defined' }
  if (element.config == null)
    return { status: 'error', message: 'element.config is not defined' }

  const newElementConfig: StreamElement['config'] = {
    ...element.config,
    [propertyName]: newValue,
  }

  element.config = newElementConfig
  streamConfigUpdateFn(updatedConfig)

  return { status: 'success' }
}
