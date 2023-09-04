import { MusicalNoteIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { useEffect, useState } from 'react'

import StreamElementWrapper from 'components/elements/element'
import useCustomizablePlayerContext from 'hooks/useCustomizablePlayerContext'
import { StreamElementProps } from 'types/element'
import getAbsoluteFontSizeInPixels from 'utils/getAbsoluteFontSizeInPixels'
import getAbsoluteTimeBasedOnRange from 'utils/getAbsoluteTimeBasedOnRange'
import getRelativeFontSizeInPixels from 'utils/getRelativeFontSizeInPixels'
import getStreamElementAttribute from 'utils/getStreamElementAttribute'
import getStreamElementManifestations from 'utils/getStreamElementManifestations'

export default function CurrentlyPlayingMusic({
  elementInstanceId,
}: StreamElementProps) {
  const { getElementData, elementsContainerHtmlElement, streamConfig } =
    useCustomizablePlayerContext()

  const [isShownBasedOnManifestation, setIsShownBasedOnManifestation] =
    useState(true)
  const [componentInstantiationDate, setComponentInstantiationDate] =
    useState<Date | null>(null)
  const [timeSinceConfigChangeDate, setTimeSinceConfigChangeDate] =
    useState<Date | null>(null)
  const [previousSongTitle, setPreviousSongTitle] = useState<string | null>(
    null,
  )

  useEffect(() => {
    setComponentInstantiationDate(new Date())
  }, [])

  useEffect(() => {
    setTimeSinceConfigChangeDate(new Date())
  }, [streamConfig])

  useEffect(() => {
    if (componentInstantiationDate == null) return

    if (getElementData == null) return
    const elementData = getElementData(elementInstanceId)
    if (elementData == null) return

    const manifestation = elementData.config.manifestation

    if (manifestation === 'continuous') {
      setIsShownBasedOnManifestation(true)
    }

    let interval: NodeJS.Timer | null = null

    const manifestationData = getStreamElementManifestations(elementData)
    if (manifestationData == null) return

    const onIntervalIntervalRange = manifestationData.onInterval?.intervalRange
    if (onIntervalIntervalRange == null) return
    const onIntervalDurationRange = manifestationData.onInterval?.durationRange
    if (onIntervalDurationRange == null) return

    const onIntervalIntervalInSeconds = getAbsoluteTimeBasedOnRange(
      onIntervalIntervalRange,
      elementData.config.interval,
    )
    const onIntervalDurationInSeconds = getAbsoluteTimeBasedOnRange(
      onIntervalDurationRange,
      elementData.config.duration,
    )

    if (manifestation === 'onInterval') {
      interval = setInterval(() => {
        const currentTime = Date.now()
        const elapsedTime =
          (currentTime - componentInstantiationDate.getTime()) / 1000

        const displayTime = onIntervalDurationInSeconds
        const cycleTime = onIntervalIntervalInSeconds + displayTime

        const timeInCurrentCycle = elapsedTime % cycleTime
        const shouldDisplay = timeInCurrentCycle < displayTime

        setIsShownBasedOnManifestation(shouldDisplay)
      }, 1000)
    }

    const onEventDurationRange = manifestationData.onEvent?.durationRange
    if (onEventDurationRange == null) return

    const onEventDurationInSeconds = getAbsoluteTimeBasedOnRange(
      onEventDurationRange,
      elementData.config.duration,
    )

    if (manifestation === 'onEvent') {
      const textAttribute = getStreamElementAttribute(
        elementData,
        'text_source',
      )
      if (textAttribute == null) return

      const currentSongTitle = textAttribute.resources.text
      if (currentSongTitle == null) return

      if (currentSongTitle === previousSongTitle) {
        setIsShownBasedOnManifestation(false)
      }

      if (currentSongTitle !== previousSongTitle) {
        if (timeSinceConfigChangeDate == null) return

        interval = setInterval(() => {
          const currentTime = Date.now()
          const elapsedTimeInSeconds =
            (currentTime - timeSinceConfigChangeDate.getTime()) / 1000

          const displayTime = onEventDurationInSeconds

          const shouldDisplay = elapsedTimeInSeconds < displayTime

          setIsShownBasedOnManifestation(shouldDisplay)

          if (!shouldDisplay) setPreviousSongTitle(currentSongTitle)
        }, 1000)
      }
    }

    return () => {
      if (interval != null) clearInterval(interval)
    }
  }, [
    componentInstantiationDate,
    elementInstanceId,
    getElementData,
    previousSongTitle,
    timeSinceConfigChangeDate,
  ])

  if (getElementData == null) return null
  const elementData = getElementData(elementInstanceId)
  if (elementData == null) return null

  const textAttribute = getStreamElementAttribute(elementData, 'text_source')
  if (textAttribute == null) return null

  if (elementsContainerHtmlElement == null) return null

  const fontSizeRange = textAttribute.resources.fontSizeRange
  if (fontSizeRange == null) return null

  const currentSongTitle = textAttribute.resources.text
  if (currentSongTitle == null) return null

  const fontSize =
    getAbsoluteFontSizeInPixels(
      getRelativeFontSizeInPixels(fontSizeRange, elementData.config.fontSize),
      elementsContainerHtmlElement,
    ) + 'px'

  return (
    <StreamElementWrapper elementInstanceId={elementInstanceId}>
      <div
        className={classNames(
          'flex flex-row items-center w-full h-full gap-2 opacity-0 transition-opacity duration-500',
          { ['opacity-100']: isShownBasedOnManifestation },
        )}
      >
        <MusicalNoteIcon className="w-6 h-6 text-white" />
        <strong className="text-white drop-shadow-md" style={{ fontSize }}>
          {currentSongTitle}
        </strong>
      </div>
    </StreamElementWrapper>
  )
}
