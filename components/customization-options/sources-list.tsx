import {
  ArrowUturnLeftIcon,
  Cog8ToothIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { ReactSortable } from 'react-sortablejs'

import IconButton from 'components/core/icon-button'
import ElementSettings from 'components/customization-options/element-settings'
import useCustomizablePlayerContext from 'hooks/useCustomizablePlayerContext'
import {
  INVISIBLE_ELEMENTS,
  StreamElement,
  StreamElementIdentifier,
} from 'types/element'
import elementIconFor from 'utils/elementIconFor'
import { stringToUniqueNumber } from 'utils/stringToUniqueNumber'

interface ListItem {
  id: number
  element: StreamElement
}

interface SourcesListItemProps {
  listItem: ListItem
}

function SourcesListItem({ listItem }: SourcesListItemProps) {
  const { element } = listItem

  const {
    customize,
    resetElementConfig,
    setInstanceIDOfHighlightedElement,
    hasElementBeenCustomized,
    instanceIDOfSelectedElement,
    setInstanceIDOfSelectedElement,
    isShowingElementSettingsMenu,
    setIsShowingElementSettingsMenu,
  } = useCustomizablePlayerContext()

  const isEnabled = element.config.isEnabled
  const hasElementBeenCustomizedByViewer =
    hasElementBeenCustomized?.(element.instanceId) ?? false

  const handleToggleVisibilityClick = () => {
    if (customize == null) return

    customize(element.instanceId, 'isEnabled', !isEnabled)
  }

  const handleResetElementConfigClick = () => {
    if (resetElementConfig == null) return

    resetElementConfig(element.instanceId)
  }

  const handleOpenElementSettings = () => {
    if (setIsShowingElementSettingsMenu == null) return
    if (setInstanceIDOfSelectedElement == null) return

    // Hide settings menu instead if it is already open and the currently selected
    //  element is the same as the element this settings button is belonging to.
    if (
      isShowingElementSettingsMenu &&
      instanceIDOfSelectedElement === element.instanceId
    ) {
      setIsShowingElementSettingsMenu(false)
      return
    }

    setIsShowingElementSettingsMenu(true)
    setInstanceIDOfSelectedElement(element.instanceId)
  }

  const handleMouseOver = () => {
    if (setInstanceIDOfHighlightedElement == null) return

    setInstanceIDOfHighlightedElement(element.instanceId)
  }

  const handleMouseOut = () => {
    if (setInstanceIDOfHighlightedElement == null) return

    setInstanceIDOfHighlightedElement(null)
  }

  const handleDoubleClick = () => {
    if (setInstanceIDOfSelectedElement == null) return
    if (setIsShowingElementSettingsMenu == null) return

    // Hide settings menu if it is already open and the currently selected
    //  element is the same as the element this settings button is belonging to.
    if (
      isShowingElementSettingsMenu &&
      instanceIDOfSelectedElement === element.instanceId
    ) {
      setIsShowingElementSettingsMenu(false)
      return
    }

    setInstanceIDOfSelectedElement(element.instanceId)

    if (!isShowingElementSettingsMenu) {
      setIsShowingElementSettingsMenu(true)
      return
    }
  }

  const isCustomizationOptionRemoveExistingElementEnabledByPlatformVendor =
    process.env
      .NEXT_PUBLIC_CUSTOMIZATION_OPTION_REMOVE_EXISTING_ELEMENT_ENABLED ===
    'true'

  return (
    <div
      className="flex flex-row items-center justify-between px-2 my-2 transition-colors duration-200 ease-in-out rounded-md cursor-move hover:shadow-md hover:bg-black/5"
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      onDoubleClick={handleDoubleClick}
    >
      <div className="flex flex-row items-center space-x-2">
        {elementIconFor(element.identifier)}
        <span>{element.title}</span>
      </div>
      <div className="flex flex-row items-center">
        {hasElementBeenCustomizedByViewer && (
          <IconButton
            icon={<ArrowUturnLeftIcon />}
            tooltip={'Reset Element'}
            onClick={handleResetElementConfigClick}
          />
        )}
        {isCustomizationOptionRemoveExistingElementEnabledByPlatformVendor && (
          <IconButton
            icon={isEnabled ? <EyeIcon /> : <EyeSlashIcon />}
            tooltip={isEnabled ? 'Hide Element' : 'Show Element'}
            onClick={handleToggleVisibilityClick}
          />
        )}
        <IconButton
          icon={<Cog8ToothIcon />}
          tooltip={'Settings'}
          onClick={handleOpenElementSettings}
        />
      </div>
    </div>
  )
}

export default function SourcesList() {
  const [list, setList] = useState<ListItem[] | null>(null)
  const [shouldUpdate, setShouldUpdate] = useState(false)

  const {
    streamConfig,
    isShowingElementSettingsMenu,
    batchCustomize,
    getElementData,
  } = useCustomizablePlayerContext()

  useEffect(() => {
    if (streamConfig == null) return

    const { elements } = streamConfig
    if (elements == null) return

    const visibleElements = elements.filter(
      (e) =>
        !([...INVISIBLE_ELEMENTS] as StreamElementIdentifier[]).includes(
          e.identifier,
        ),
    )

    const listItems: ListItem[] = visibleElements
      .sort((a, b) => b.config.layer - a.config.layer)
      .map((element) => ({
        id: stringToUniqueNumber(element.instanceId),
        element,
      }))

    setList(listItems)
  }, [streamConfig])

  useEffect(() => {
    if (!shouldUpdate) return

    if (list == null) return
    if (batchCustomize == null) return
    if (getElementData == null) return

    const elementInstanceIds = list.map((item) => item.element.instanceId)
    const propertyNames = Array(list.length).fill('layer')
    const newValues = Array(list.length)
      .fill(0)
      .map((_, index) => list.length - 1 - index)

    batchCustomize(elementInstanceIds, propertyNames, newValues)

    setShouldUpdate(false)
  }, [batchCustomize, getElementData, list, shouldUpdate])

  const setListWithConfigUpdate = (newState: ListItem[]) => {
    setList(newState)
  }

  const handleListUpdate = () => {
    setShouldUpdate(true)
  }

  if (streamConfig == null) return null
  if (list == null) return null
  if (setList == null) return null

  return (
    <div className="flex flex-col">
      <h4 className="mx-2 font-bold text-md">Sources</h4>
      <div
        className={classNames('flex flex-col gap-1 overflow-y-auto', {
          ['max-h-[30vh]']: isShowingElementSettingsMenu,
        })}
      >
        <ReactSortable
          list={list}
          setList={setListWithConfigUpdate}
          onUpdate={handleListUpdate}
        >
          {list.map((item) => (
            <SourcesListItem listItem={item} key={item.id} />
          ))}
        </ReactSortable>
      </div>
      {isShowingElementSettingsMenu && (
        <ElementSettings className="max-h-[40vh]" />
      )}
    </div>
  )
}
