import { StreamElementConfig } from 'types/element'

const propertyNameMapping: Record<keyof StreamElementConfig, string> = {
  isEnabled: 'Is Visible',
  isVolumeMuted: 'Is Volume Muted',
  layer: 'Order',
  location: 'Location',
  volume: 'Volume',
  opacity: 'Opacity',
  fontSize: 'Text Size',
  manifestation: 'Show Element',
  interval: 'Every',
  duration: 'For',
}

export default function nameForProperty(
  property: keyof StreamElementConfig,
): string | null {
  if (!Object.keys(propertyNameMapping).includes(property)) return null

  return propertyNameMapping[property]
}
