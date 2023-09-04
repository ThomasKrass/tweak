import { Dispatch, SetStateAction, createContext } from 'react'

import { CustomizeResult } from 'types/customize-result'
import { StreamConfig, StreamElement, StreamElementConfig } from 'types/element'

type CustomizablePlayerContextValue = {
  isPlaying: boolean | null
  setIsPlaying: Dispatch<SetStateAction<boolean>> | null
  isBuffering: boolean | null
  setIsBuffering: Dispatch<SetStateAction<boolean>> | null
  isUsingCustomization: boolean | null
  setIsUsingCustomization: Dispatch<SetStateAction<boolean>> | null
  areCustomizationOptionsEnabled: boolean | null
  setAreCustomizationOptionsEnabled: Dispatch<SetStateAction<boolean>> | null
  playerContainerHtmlElement: HTMLElement | null
  elementsContainerHtmlElement: HTMLElement | null
  hlsPlayerHtmlElement: HTMLVideoElement | null
  masterVolume: number | null
  setMasterVolume: Dispatch<SetStateAction<number>> | null
  isMasterVolumeMuted: boolean | null
  setIsMasterVolumeMuted: Dispatch<SetStateAction<boolean>> | null
  streamConfigFromStreamerUrl: string | null
  setStreamConfigFromStreamerUrl: Dispatch<SetStateAction<string | null>> | null
  streamConfig: StreamConfig | null
  customize:
    | ((
        elementInstanceId: StreamElement['instanceId'],
        propertyName: keyof StreamElementConfig,
        newValue: unknown,
      ) => CustomizeResult)
    | null
  batchCustomize:
    | ((
        elementInstanceIds: StreamElement['instanceId'][],
        propertyNames: (keyof StreamElementConfig)[],
        newValues: unknown[],
      ) => CustomizeResult)
    | null
  resetElementConfig:
    | ((elementInstanceId: StreamElement['instanceId']) => CustomizeResult)
    | null
  getElementData:
    | ((elementInstanceId: StreamElement['instanceId']) => StreamElement | null)
    | null
  hasElementBeenCustomized:
    | ((elementInstanceId: StreamElement['instanceId']) => boolean | null)
    | null
  instanceIDOfHighlightedElement: StreamElement['instanceId'] | null
  setInstanceIDOfHighlightedElement: Dispatch<
    SetStateAction<StreamElement['instanceId'] | null>
  > | null
  instanceIDOfSelectedElement: StreamElement['instanceId'] | null
  setInstanceIDOfSelectedElement: Dispatch<
    SetStateAction<StreamElement['instanceId'] | null>
  > | null
  isShowingElementSettingsMenu: boolean | null
  setIsShowingElementSettingsMenu: Dispatch<SetStateAction<boolean>> | null
  isResizingElement: boolean | null
  setIsResizingElement: Dispatch<SetStateAction<boolean>> | null
  isRepositioningElement: boolean | null
  setIsRepositioningElement: Dispatch<SetStateAction<boolean>> | null
}

const defaultValue: CustomizablePlayerContextValue = {
  isPlaying: null,
  setIsPlaying: null,
  isBuffering: null,
  setIsBuffering: null,
  isUsingCustomization: null,
  setIsUsingCustomization: null,
  areCustomizationOptionsEnabled: null,
  setAreCustomizationOptionsEnabled: null,
  playerContainerHtmlElement: null,
  elementsContainerHtmlElement: null,
  hlsPlayerHtmlElement: null,
  masterVolume: null,
  setMasterVolume: null,
  isMasterVolumeMuted: null,
  setIsMasterVolumeMuted: null,
  streamConfigFromStreamerUrl: null,
  setStreamConfigFromStreamerUrl: null,
  streamConfig: null,
  customize: null,
  batchCustomize: null,
  resetElementConfig: null,
  getElementData: null,
  hasElementBeenCustomized: null,
  instanceIDOfHighlightedElement: null,
  setInstanceIDOfHighlightedElement: null,
  instanceIDOfSelectedElement: null,
  setInstanceIDOfSelectedElement: null,
  isShowingElementSettingsMenu: null,
  setIsShowingElementSettingsMenu: null,
  isResizingElement: null,
  setIsResizingElement: null,
  isRepositioningElement: null,
  setIsRepositioningElement: null,
}

export const CustomizablePlayerContext =
  createContext<CustomizablePlayerContextValue>(defaultValue)
