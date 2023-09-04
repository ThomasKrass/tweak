import { CustomizeResult } from 'types/customize-result'
import { StreamConfig, StreamElementConfig, StreamElement } from 'types/element'

/**
 * Update multiple customizable properties inside the given config with the new values
 *  using the given update function.
 *
 * @param streamConfig the config to update
 * @param streamConfigUpdateFn the function for updating the config
 * @param elementInstanceIds the elements to customize
 * @param propertyNames the names of the properties to customize
 * @param newValues the new values for the given properties
 *
 * @returns status information about the batch customization
 */
export default function batchCustomizeSpecifiedConfigWithUpdateFn(
  streamConfig: StreamConfig | null,
  streamConfigUpdateFn: ((newConfig: StreamConfig | null) => void) | null,
  elementInstanceIds: string[],
  propertyNames: (keyof StreamElementConfig)[],
  newValues: unknown[],
): CustomizeResult {
  if (elementInstanceIds.length < 1)
    return {
      status: 'error',
      message:
        'At least one instanceID of an element to customize must be specified.',
    }
  if (propertyNames.length < 1)
    return {
      status: 'error',
      message: 'At least one propertyName to customize must be specified.',
    }
  if (newValues.length < 1)
    return {
      status: 'error',
      message:
        'At least one new value resulting from the customization must be specified.',
    }
  if (
    ![elementInstanceIds.length, propertyNames.length, newValues.length].every(
      (v, _, array) => v === array[0],
    )
  )
    return {
      status: 'error',
      message:
        'A newValue must be specified for exactly one element to customize. The same is true for the propertyNames.',
    }
  if (streamConfig == null)
    return { status: 'error', message: 'currentConfig is not defined.' }
  if (streamConfig.elements == null)
    return {
      status: 'error',
      message: 'currentConfig.elements is not defined.',
    }
  if (streamConfigUpdateFn == null)
    return { status: 'error', message: 'stateUpdateFn is not defined.' }

  const updatedConfig = structuredClone(streamConfig)

  // Find all instances of the given elements to customize
  const elements = elementInstanceIds.map((instanceId) =>
    updatedConfig.elements.find((e) => e.instanceId === instanceId),
  )

  if (elements == null) return { status: 'error', message: 'elements is null.' }

  if (elements.includes(undefined))
    return {
      status: 'error',
      message: 'At least one element to customize could not be found.',
    }

  elements.forEach((element, index) => {
    if (element == null)
      return {
        status: 'error',
        message: 'element is not defined.',
      }

    if (element.config == null)
      return { status: 'error', message: 'element.config is not defined.' }

    const propertyName = propertyNames[index]
    const newValue = newValues[index]

    const newElementConfig: StreamElement['config'] = {
      ...element.config,
      [propertyName]: newValue,
    }

    element.config = newElementConfig
  })

  streamConfigUpdateFn(updatedConfig)

  return { status: 'success' }
}
