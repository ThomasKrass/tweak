/**
 * (x0, y0) ----------- *
 *    |                 |
 *    * ------------ (x1, y1)
 *
 * The location of the element.
 * Ranges from 0 to 1 relative to the video.
 */
export type StreamElementLocation = {
  x0: number
  y0: number
  x1: number
  y1: number
}

export type StreamElementManifestation = 'continuous' | 'onEvent' | 'onInterval'

export type StreamElementManifestationsData = {
  onEvent?: {
    durationRange: {
      from: number
      to: number
    }
  }
  onInterval?: {
    intervalRange: {
      from: number
      to: number
    }
    durationRange: {
      from: number
      to: number
    }
  }
}

export type StreamElementConfig = {
  location: StreamElementLocation
  layer: StreamElementLayer
  isEnabled: boolean
  volume: number
  isVolumeMuted: boolean
  opacity: number
  fontSize: number
  manifestation: StreamElementManifestation
  interval: number
  duration: number
}

export interface StreamElementProps {
  elementInstanceId: StreamElement['instanceId']
}

export interface StreamElementAttributeProps {
  attribute: StreamElementAttribute
}

export type StreamElementIdentifier =
  | 'digital_captured_content'
  | 'streamer_representation'
  | 'chat_overlay'
  | 'information_about_the_streamed_content'
  | 'currently_playing_music'
  | 'background_music'
  | 'the_streamers_voice'

export const INVISIBLE_ELEMENTS = [
  'background_music',
  'the_streamers_voice',
] as const

export type StreamElementAttributeIdentifier =
  | 'video_source'
  | 'audio_source'
  | 'text_source'

export type StreamElementAttributeResources = {
  /**
   * (x0, y0) ----------- *
   *    |                 |
   *    * ------------ (x1, y1)
   *
   * The area of the source video for this element.
   * Ranges from 0 to 1 relative to the source video.
   */
  videoStream?: StreamElementLocation
  audioStream?: {
    channels: number[] // Channels are specified from left to right (or mono, if only one is available)
  }
  fontSizeRange?: {
    from: number
    to: number
  }
  text?: string
}

export type StreamElementAttribute = {
  identifier: StreamElementAttributeIdentifier
  instanceNumber: number // Increments by 1 for each attribute of the same type in attributes[]
  resources: StreamElementAttributeResources
}

export type StreamElement = {
  identifier: StreamElementIdentifier
  title: string
  instanceId: string
  config: StreamElementConfig
  customizableProperties: (keyof StreamElementConfig)[]
  attributes: StreamElementAttribute[]
  manifestations?: StreamElementManifestationsData
}

export type StreamElementLayer = number

/**
 * The overall configuration of the stream.
 * All other configurations are included in this one.
 */
export type StreamConfig = {
  elements: StreamElement[]
}
