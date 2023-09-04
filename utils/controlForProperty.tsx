import ManifestationControl from 'components/customization-options/controls/manifestation-control'
import OpacityControl from 'components/customization-options/controls/opacity-control'
import TextSizeControl from 'components/customization-options/controls/text-size-control'
import VolumeControl from 'components/customization-options/controls/volume-control'
import { StreamElement, StreamElementConfig } from 'types/element'

export default function controlForPropertyOfElementInstanceId(
  elementInstanceId: StreamElement['instanceId'],
  property: keyof StreamElementConfig,
): JSX.Element | null {
  const propertyControlMapping: Record<keyof StreamElementConfig, JSX.Element> =
    {
      isEnabled: <div className="text-error">This control is not required</div>,
      isVolumeMuted: (
        <div className="text-error">This control is not required</div>
      ),
      layer: <div className="text-error">This control is not required</div>,
      location: <div className="text-error">This control is not required</div>,
      interval: <div className="text-error">This control is not required</div>,
      duration: <div className="text-error">This control is not required</div>,
      volume: (
        <VolumeControl
          elementInstanceId={elementInstanceId}
          key={elementInstanceId + property}
        />
      ),
      opacity: (
        <OpacityControl
          elementInstanceId={elementInstanceId}
          key={elementInstanceId + property}
        />
      ),
      fontSize: (
        <TextSizeControl
          elementInstanceId={elementInstanceId}
          key={elementInstanceId + property}
        />
      ),
      manifestation: (
        <ManifestationControl
          elementInstanceId={elementInstanceId}
          key={elementInstanceId + property}
        />
      ),
    }

  if (!Object.keys(propertyControlMapping).includes(property)) return null

  return propertyControlMapping[property]
}
