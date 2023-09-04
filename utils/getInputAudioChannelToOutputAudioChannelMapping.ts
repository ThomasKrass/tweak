import { StreamConfig } from 'types/element'
import getStreamElementAttribute from 'utils/getStreamElementAttribute'

/**
 * Computes a mapping of channels from the incoming audio stream to the
 *  outgoing audio.
 * If an element only uses audio from one channel, equally distribute the
 *  output to the left and right audio output channel.
 * If an element uses two channels, assign the first channel to the left
 *  output and the second channel to the right output.
 *
 * @param streamConfig the config to get the audio channel assignments from
 *
 * @returns a mapping of input audio channels to output audio channels
 */
export default function getInputAudioChannelToOutputAudioChannelMapping(
  streamConfig: StreamConfig,
): Record<number, number[] | null> {
  const mapping: Record<number, number[] | null> = {
    0: null,
    1: null,
  }

  const audioChannelsForEachElement = streamConfig.elements
    .map((element) => {
      const audioSource = getStreamElementAttribute(element, 'audio_source')
      if (audioSource == null) return null

      return audioSource.resources.audioStream?.channels ?? null
    })
    .filter(Boolean) as number[][]

  for (const inputChannel of [0, 1]) {
    const configurationsContainingThisChannel =
      audioChannelsForEachElement.filter((v) => v.includes(inputChannel))

    if (configurationsContainingThisChannel.length < 1) {
      mapping[inputChannel] = null
      continue
    }

    const isChannelUsedAsPartialStereoTrack =
      configurationsContainingThisChannel.some((v) => v.length > 1)

    if (isChannelUsedAsPartialStereoTrack) {
      mapping[inputChannel] = [inputChannel]
    } else {
      mapping[inputChannel] = [0, 1]
    }
  }

  return mapping
}
