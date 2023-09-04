import axios from 'axios'
import { useEffect, useMemo, useRef, useState } from 'react'

import LoadingSpinner from 'components/core/loading-spinner'
import Controls from 'components/customizable-stream-player/controls'
import ElementsContainer from 'components/customizable-stream-player/elements'
import Sidebar from 'components/customizable-stream-player/sidebar'
import HLSPlayer from 'components/hls-player'
import { CustomizablePlayerContext } from 'contexts/customizablePlayerContext'
import useAppContext from 'hooks/useAppContext'
import useStreamEvent from 'hooks/useStreamEvent'
import { CustomizeResult } from 'types/customize-result'
import { StreamConfig, StreamElement, StreamElementConfig } from 'types/element'
import batchCustomizeSpecifiedConfigWithUpdateFn from 'utils/batchCustomizeSpecifiedConfigWithUpdateFn'
import customizeSpecifiedConfigWithUpdateFn from 'utils/customizeSpecifiedConfigWithUpdateFn'
import getElementFromSpecifiedStreamConfig from 'utils/getElementFromSpecifiedStreamConfig'
import hasElementBeenCustomizedInSpecifiedConfig from 'utils/hasElementBeenCustomizedInSpecifiedConfig'
import loadViewerConfigurationFromLocalStorage from 'utils/loadViewerConfigurationFromLocalStorage'
import maintainAspectRatio from 'utils/maintainAspectRatio'
import mergeStreamConfigurations from 'utils/mergeStreamConfigurations'
import resetElementCustomizationInSpecifiedConfig from 'utils/resetElementCustomizationInSpecifiedConfig'
import storeViewerConfigurationInLocalStorage from 'utils/storeViewerConfigurationInLocalStorage'

export default function CustomizableStreamPlayer() {
  const { socket } = useAppContext()

  const [playerContainerHtmlElement, setPlayerContainerHtmlElement] =
    useState<HTMLElement | null>(null)
  const [elementsContainerHtmlElement, setElementsContainerHtmlElement] =
    useState<HTMLElement | null>(null)
  const [hlsPlayerHtmlElement, setHlsPlayerHtmlElement] =
    useState<HTMLVideoElement | null>(null)

  const playerContainerRef = useRef<HTMLDivElement>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const hlsPlayerRef = useRef<HTMLVideoElement>(null)
  const elementsContainerRef = useRef<HTMLDivElement>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isBuffering, setIsBuffering] = useState(false)
  const [isUsingCustomization, setIsUsingCustomization] = useState(true)
  const [areCustomizationOptionsEnabled, setAreCustomizationOptionsEnabled] =
    useState(true)
  const [masterVolume, setMasterVolume] = useState(1)
  const [isMasterVolumeMuted, setIsMasterVolumeMuted] = useState(false)
  const [streamConfigFromStreamerUrl, setStreamConfigFromStreamerUrl] =
    useState<string | null>(null)
  const [streamConfigFromViewer, setStreamConfigFromViewer] =
    useState<StreamConfig | null>(null)
  const [streamConfigFromStreamer, setStreamConfigFromStreamer] =
    useState<StreamConfig | null>(null)
  const [instanceIDOfHighlightedElement, setInstanceIDOfHighlightedElement] =
    useState<StreamElement['instanceId'] | null>(null)
  const [instanceIDOfSelectedElement, setInstanceIDOfSelectedElement] =
    useState<StreamElement['instanceId'] | null>(null)
  const [isShowingElementSettingsMenu, setIsShowingElementSettingsMenu] =
    useState(false)
  const [isResizingElement, setIsResizingElement] = useState(false)
  const [isRepositioningElement, setIsRepositioningElement] = useState(false)

  useStreamEvent(socket, 'updatedStreamerConfig', () => {
    if (streamConfigFromStreamerUrl == null) return

    try {
      axios.get<StreamConfig>(streamConfigFromStreamerUrl).then((response) => {
        const config = response.data
        setStreamConfigFromStreamer(config)
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        'Could not fetch streamer config from url',
        streamConfigFromStreamerUrl,
        error,
      )
    }
  })

  // Populate the context after the DOM nodes have been rendered.
  useEffect(() => {
    if (playerContainerRef.current)
      setPlayerContainerHtmlElement(playerContainerRef.current)

    if (hlsPlayerRef.current) setHlsPlayerHtmlElement(hlsPlayerRef.current)

    if (elementsContainerRef.current)
      setElementsContainerHtmlElement(elementsContainerRef.current)
  }, [])

  // Get the StreamConfig from the streamer's side.
  useEffect(() => {
    if (streamConfigFromStreamerUrl == null) return

    try {
      axios.get<StreamConfig>(streamConfigFromStreamerUrl).then((response) => {
        const config = response.data
        setStreamConfigFromStreamer(config)
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        'Could not fetch streamer config from url',
        streamConfigFromStreamerUrl,
        error,
      )
    }
  }, [streamConfigFromStreamerUrl])

  // Disable all customization options if customization is not used.
  useEffect(() => {
    if (isUsingCustomization) return

    setAreCustomizationOptionsEnabled(false)
  }, [isUsingCustomization])

  // Maintain a 16:9 aspect ratio for the video player.
  useEffect(() => {
    if (elementsContainerHtmlElement == null) return

    const videoContainerHtmlElement = videoContainerRef.current
    if (videoContainerHtmlElement == null) return

    const maintainAspectRatioOfVideoPlayer = () =>
      maintainAspectRatio(
        videoContainerHtmlElement,
        elementsContainerHtmlElement,
      )

    maintainAspectRatioOfVideoPlayer()

    window.addEventListener('resize', maintainAspectRatioOfVideoPlayer)

    return () => {
      window.removeEventListener('resize', maintainAspectRatioOfVideoPlayer)
    }
  }, [elementsContainerHtmlElement])

  /**
   * A method for manipulating the StreamConfig for the viewer's side.
   *
   * @param newConfig The updated configuration
   */
  const updateViewerConfig = (newConfig: StreamConfig | null) => {
    const sceneKey = streamConfigFromStreamerUrl

    if (sceneKey == null) return

    storeViewerConfigurationInLocalStorage(sceneKey, newConfig)
    setStreamConfigFromViewer(newConfig)
  }

  // Load the viewer configuration for the currently used scene.
  useEffect(() => {
    const sceneKey = streamConfigFromStreamerUrl

    if (sceneKey == null) return

    loadViewerConfigurationFromLocalStorage(sceneKey).then((viewerConfig) =>
      setStreamConfigFromViewer(viewerConfig),
    )
  }, [streamConfigFromStreamerUrl])

  // Compute the StreamConfig to use based on the streamer's and the viewer's
  //  configuration.
  const streamConfig = useMemo(() => {
    if (!isUsingCustomization) return streamConfigFromStreamer

    return mergeStreamConfigurations(
      streamConfigFromStreamer,
      streamConfigFromViewer,
    )
  }, [isUsingCustomization, streamConfigFromStreamer, streamConfigFromViewer])

  /**
   * Function used for customizing properties inside the current StreamConfig.
   *
   * @param elementInstanceId the element instance to customize
   * @param propertyName the property of the specified element to customize
   * @param newValue the new value for the specified property to set
   *
   * @returns an object with status information about the applied customization
   */
  const customize = (
    elementInstanceId: StreamElement['instanceId'],
    propertyName: keyof StreamElementConfig,
    newValue: unknown,
  ): CustomizeResult => {
    return customizeSpecifiedConfigWithUpdateFn(
      streamConfig,
      updateViewerConfig,
      elementInstanceId,
      propertyName,
      newValue,
    )
  }

  /**
   * Function used for customizing multiple properties inside the current StreamConfig
   *  at once.
   *
   * @param elementInstanceIds the element instances to customize
   * @param propertyNames the properties of the specified elements to customize
   * @param newValues the new values for the specified properties to set
   *
   * @returns an object with status information about the applied customization
   */
  const batchCustomize = (
    elementInstanceIds: StreamElement['instanceId'][],
    propertyNames: (keyof StreamElementConfig)[],
    newValues: unknown[],
  ): CustomizeResult => {
    return batchCustomizeSpecifiedConfigWithUpdateFn(
      streamConfig,
      updateViewerConfig,
      elementInstanceIds,
      propertyNames,
      newValues,
    )
  }

  /**
   * Function used for resetting an element's configuration to the streamer's state.
   *
   * @param elementInstanceId the element instance to reset
   *
   * @returns an object with status information about the applied reset
   */
  const resetElementConfig = (
    elementInstanceId: StreamElement['instanceId'],
  ): CustomizeResult => {
    return resetElementCustomizationInSpecifiedConfig(
      streamConfig,
      updateViewerConfig,
      streamConfigFromStreamer,
      elementInstanceId,
    )
  }

  /**
   * Function used for returning a clone of the specified element's data.
   *
   * @param elementInstanceId the element to retrieve the data from
   *
   * @returns an object with the elements data, or null if it does not exist
   */
  const getElementData = (
    elementInstanceId: StreamElement['instanceId'],
  ): StreamElement | null => {
    return getElementFromSpecifiedStreamConfig(streamConfig, elementInstanceId)
  }

  /**
   * Function used for checking if an element has been customized.
   *
   * @param elementInstanceId the element to check
   *
   * @returns `true`, if the element has been customized, `false` if not; `null`, if an error occurred
   */
  const hasElementBeenCustomized = (
    elementInstanceId: StreamElement['instanceId'],
  ): boolean | null => {
    return hasElementBeenCustomizedInSpecifiedConfig(
      streamConfig,
      streamConfigFromStreamer,
      elementInstanceId,
    )
  }

  const value = {
    isPlaying,
    setIsPlaying,
    isBuffering,
    setIsBuffering,
    playerContainerHtmlElement,
    elementsContainerHtmlElement,
    hlsPlayerHtmlElement,
    isUsingCustomization,
    setIsUsingCustomization,
    areCustomizationOptionsEnabled,
    setAreCustomizationOptionsEnabled,
    masterVolume,
    setMasterVolume,
    isMasterVolumeMuted,
    setIsMasterVolumeMuted,
    streamConfigFromStreamerUrl,
    setStreamConfigFromStreamerUrl,
    streamConfig,
    updateViewerConfig,
    customize,
    batchCustomize,
    resetElementConfig,
    getElementData,
    hasElementBeenCustomized,
    instanceIDOfHighlightedElement,
    setInstanceIDOfHighlightedElement,
    instanceIDOfSelectedElement,
    setInstanceIDOfSelectedElement,
    isShowingElementSettingsMenu,
    setIsShowingElementSettingsMenu,
    isResizingElement,
    setIsResizingElement,
    isRepositioningElement,
    setIsRepositioningElement,
  }

  return (
    <CustomizablePlayerContext.Provider value={value}>
      <div className="relative grid grid-cols-playerWithSidebar [&>*]:h-[calc(100vh-14rem)]">
        <div
          ref={playerContainerRef}
          className="flex flex-col items-center justify-between bg-black"
        >
          <div
            className="relative z-0 flex items-center justify-center w-full h-full"
            ref={videoContainerRef}
          >
            {isBuffering && <LoadingSpinner />}
            <ElementsContainer ref={elementsContainerRef} />
          </div>
          <Controls />
        </div>
        <Sidebar />
      </div>
      <HLSPlayer ref={hlsPlayerRef} />
    </CustomizablePlayerContext.Provider>
  )
}
