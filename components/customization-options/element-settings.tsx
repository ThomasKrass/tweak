import { XMarkIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'

import IconButton from 'components/core/icon-button'
import useCustomizablePlayerContext from 'hooks/useCustomizablePlayerContext'
import { StreamElement, StreamElementConfig } from 'types/element'
import controlForPropertyOfElementInstanceId from 'utils/controlForProperty'
import elementIconFor from 'utils/elementIconFor'
import nameForProperty from 'utils/nameForProperty'

/**
 * All properties in this list are not shown in an element's settings menu.
 *
 * Usually, they have already been covered in other ways, e.g., the "location"
 *  can be changed via drag and drop, and the layer can be changed by sorting
 *  the list of sources via drag and drop.
 *
 * Only the remaining properties from all customizable properties
 *  (`customizableProperties` in an element's config) are provided in the settings
 *  menu instead.
 */
const IGNORED_PROPERTIES_IN_SETTINGS_MENU: (keyof StreamElementConfig)[] = [
  'isEnabled',
  'isVolumeMuted',
  'location',
  'layer',
  'volume',
  'duration',
  'interval',
]

interface PropertyControlItemProps {
  elementInstanceId: StreamElement['instanceId']
  property: keyof StreamElementConfig
}

function PropertyControlItem({
  elementInstanceId,
  property,
}: PropertyControlItemProps) {
  // Check if the customization option is enabled by the platform vendor.
  // If not, the user cannot access a control for changing the respective property.
  const isEnabledByPlatformVendor = (() => {
    if (property === 'opacity') {
      const isChangeTransparencyEnabled =
        process.env
          .NEXT_PUBLIC_CUSTOMIZATION_OPTION_CHANGE_TRANSPARENCY_ENABLED ===
        'true'

      return isChangeTransparencyEnabled
    }

    if (property === 'fontSize') {
      const isChangeTextSizeEnabled =
        process.env
          .NEXT_PUBLIC_CUSTOMIZATION_OPTION_CHANGE_TEXT_SIZE_ENABLED === 'true'

      return isChangeTextSizeEnabled
    }

    if (property === 'manifestation') {
      const isChangeManifestationEnabled =
        process.env
          .NEXT_PUBLIC_CUSTOMIZATION_OPTION_CHANGE_MANIFESTATION_ENABLED ===
        'true'

      return isChangeManifestationEnabled
    }

    return false
  })()

  if (!isEnabledByPlatformVendor) return null

  const propertyName = nameForProperty(property)

  return (
    <div className="flex flex-col flex-nowrap">
      <small>{propertyName}</small>
      {controlForPropertyOfElementInstanceId(elementInstanceId, property)}
    </div>
  )
}

export interface ElementSettingsProps {
  className: string
}

export default function ElementSettings({ className }: ElementSettingsProps) {
  const {
    instanceIDOfSelectedElement,
    getElementData,
    setIsShowingElementSettingsMenu,
    setInstanceIDOfHighlightedElement,
  } = useCustomizablePlayerContext()

  if (instanceIDOfSelectedElement == null) return null
  if (getElementData == null) return null

  const elementData = getElementData(instanceIDOfSelectedElement)

  if (elementData == null) return null

  const { title, identifier } = elementData

  const handleClick = () => {
    if (setIsShowingElementSettingsMenu == null) return
    if (setInstanceIDOfHighlightedElement == null) return

    setIsShowingElementSettingsMenu(false)
    setInstanceIDOfHighlightedElement(null)
  }

  const handleMouseOver = () => {
    if (setInstanceIDOfHighlightedElement == null) return

    setInstanceIDOfHighlightedElement(instanceIDOfSelectedElement)
  }

  const handleMouseOut = () => {
    if (setInstanceIDOfHighlightedElement == null) return

    setInstanceIDOfHighlightedElement(null)
  }

  const customizablePropertiesThatShouldBeAvailableInSettingsMenu = (() => {
    const customizableProperties = elementData.customizableProperties

    return customizableProperties.filter(
      (property) => !IGNORED_PROPERTIES_IN_SETTINGS_MENU.includes(property),
    )
  })()

  return (
    <div
      className={classNames(
        'relative z-0 p-4 rounded-md shadow-md bg-black/5',
        className,
      )}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <div className="flex flex-row justify-between flex-nowrap">
        <h4 className="flex flex-col font-bold text-md flex-nowrap">
          Element Settings
          <span className="flex flex-row items-center font-normal flex-nowrap">
            <em>of</em> <div className="mx-1">{elementIconFor(identifier)}</div>{' '}
            {title}
          </span>
        </h4>
        <div className="-m-2">
          <IconButton
            icon={<XMarkIcon />}
            tooltip="Close Settings"
            onClick={handleClick}
          />
        </div>
      </div>
      <div className="flex flex-col gap-3 mt-4 flex-nowrap">
        {customizablePropertiesThatShouldBeAvailableInSettingsMenu.map(
          (customizableProperty) => (
            <PropertyControlItem
              elementInstanceId={instanceIDOfSelectedElement}
              key={customizableProperty}
              property={customizableProperty}
            />
          ),
        )}
      </div>
    </div>
  )
}
