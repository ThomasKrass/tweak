import HLS from 'hls.js'
import JSQR from 'jsqr'
import { ForwardedRef, forwardRef, useEffect, useState } from 'react'

import useCustomizablePlayerContext from 'hooks/useCustomizablePlayerContext'
import areObjectsEqual from 'utils/areObjectsEqual'
import getStreamerConfigUrl from 'utils/getConfigUrl'
import getInputAudioChannelToOutputAudioChannelMapping from 'utils/getInputAudioChannelToOutputAudioChannelMapping'
import { isMutableRefObjectHtmlVideoElement } from 'utils/isMutableRefObjectHtmlVideoElement'

/**
 * The player for retrieving the combined HLS stream.
 * Elements can access the required visual parts of the combined video stream using the `VideoSource` attribute.
 */
const HLSPlayer = forwardRef(function HLSPlayer(
  _props: unknown,
  ref: ForwardedRef<HTMLVideoElement>,
) {
  const {
    isPlaying,
    setIsBuffering,
    masterVolume,
    isMasterVolumeMuted,
    streamConfigFromStreamerUrl,
    setStreamConfigFromStreamerUrl,
    streamConfig,
  } = useCustomizablePlayerContext()

  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)

  const [sourceNode, setSourceNode] =
    useState<MediaElementAudioSourceNode | null>(null)

  // Input Gain Nodes (0: left channel, 1: right channel)
  const [gainInputNodes, setGainInputNodes] = useState<GainNode[] | null>(null)

  // Output Gain Nodes (0: left channel, 1: right channel)
  const [gainOutputNodes, setGainOutputNodes] = useState<GainNode[] | null>(
    null,
  )

  const [inputOutputMapping, setInputOutputMapping] = useState<Record<
    number,
    number[] | null
  > | null>(null)

  // If this option is enabled, a prerecorded stream is used instead of letting the user
  //  stream via HLS to the application.
  const isUsingPrerecordedStream =
    process.env.NEXT_PUBLIC_USE_PRERECORDED_STREAM === 'true'

  const hlsSource = process.env.NEXT_PUBLIC_HLS_SOURCE_URL || ''

  useEffect(() => {
    if (isUsingPrerecordedStream) return

    if (!isMutableRefObjectHtmlVideoElement(ref)) return

    // make sure Hls is supported
    if (HLS.isSupported()) {
      const hls = new HLS()
      hls.loadSource(hlsSource)
      hls.attachMedia(ref.current)
    }
    // hls.js is not supported on platforms that do not have Media Source Extensions (MSE) enabled.
    // When the browser has built-in HLS support (check using `canPlayType`), we can provide the HLS manifest to the video src directly
    else if (ref.current.canPlayType('application/vnd.apple.mpegurl')) {
      ref.current.src = hlsSource
    }
  }, [hlsSource, isUsingPrerecordedStream, ref])

  // Starts and stops the video and audio playback.
  useEffect(() => {
    if (!isMutableRefObjectHtmlVideoElement(ref)) return
    if (ref == null) return
    if (ref.current == null) return
    if (audioContext == null) return

    if (!isPlaying) {
      try {
        ref.current.pause()
        audioContext.suspend()
      } catch {
        /* empty */
      }
    } else {
      if (!isUsingPrerecordedStream) ref.current.currentTime = 1e101

      try {
        ref.current.play()
        audioContext.resume()
      } catch {
        /* empty */
      }
    }
  }, [audioContext, isPlaying, isUsingPrerecordedStream, ref])

  // Checks if the stream is buffering or playing normally.
  useEffect(() => {
    if (!isMutableRefObjectHtmlVideoElement(ref)) return
    if (ref.current == null) return
    if (setIsBuffering == null) return

    const current = ref.current

    const handleWaiting = () => {
      setIsBuffering(true)
    }

    const handlePlaying = () => {
      setIsBuffering(false)
    }

    current.addEventListener('waiting', handleWaiting)
    current.addEventListener('playing', handlePlaying)

    return () => {
      if (current) {
        current.removeEventListener('waiting', handleWaiting)
        current.removeEventListener('playing', handlePlaying)
      }
    }
  }, [ref, setIsBuffering])

  useEffect(() => {
    let localAudioContext: AudioContext | null = null

    const handleLoadedData = () => {
      if (localAudioContext) {
        localAudioContext.close()
      }

      localAudioContext = new AudioContext()
      setAudioContext(localAudioContext)
    }

    if (!isMutableRefObjectHtmlVideoElement(ref) || !ref.current) return

    const currentRef = ref.current

    currentRef.addEventListener('loadeddata', handleLoadedData)

    if (isUsingPrerecordedStream) {
      handleLoadedData()
    }

    return () => {
      currentRef.removeEventListener('loadeddata', handleLoadedData)

      if (localAudioContext) {
        localAudioContext.close()
      }
    }
  }, [isUsingPrerecordedStream, ref])

  // Recompute the inputOuputMapping for audio sources whenever the config changes.
  useEffect(() => {
    if (streamConfig == null) return

    const previousMapping = inputOutputMapping
    const computedMapping =
      getInputAudioChannelToOutputAudioChannelMapping(streamConfig)

    if (areObjectsEqual(previousMapping, computedMapping)) return

    setInputOutputMapping(computedMapping)
  }, [inputOutputMapping, streamConfig])

  // Splitting of different audio sources that are located in separate channels
  //  of the same audio track.
  useEffect(() => {
    if (audioContext == null) return
    if (inputOutputMapping == null) return

    if (!isMutableRefObjectHtmlVideoElement(ref) || !ref.current) return

    const currentRef = ref.current

    // Create media element source using the video element
    if (sourceNode == null) {
      setSourceNode(audioContext.createMediaElementSource(currentRef))
    }

    if (sourceNode == null) return

    // Create channel splitter
    const splitter = audioContext.createChannelSplitter(2)

    // Connect source to splitter
    sourceNode.connect(splitter)

    // Create gain nodes for individual input channels.
    // In our case, only stereo is currently supported, such that there are
    //  2 input channels.
    const gainNodeInputs = [
      audioContext.createGain(),
      audioContext.createGain(),
    ]
    // INFO: Gain nodes for additional channels (e.g., in 7.1 audio instead of stereo)
    // INFO:  can be added here. In the case of such an extension, they must be connected
    // INFO:  to the output nodes as well.

    // Connect splitter output to gain nodes
    gainNodeInputs.forEach((_, index) => {
      splitter.connect(gainNodeInputs[index], index)
    })

    // Create gain nodes for each output channel.
    // In our case, only stereo output is currently supported, such that there are
    //  2 output channels.
    const gainNodeOutputs = [
      audioContext.createGain(),
      audioContext.createGain(),
    ]

    // Connect the input gain nodes to the correct output gain nodes
    // If no audio sources are available, connect each input channel
    //  to the output channel with the same index to not break the audio graph
    if (Object.values(inputOutputMapping).every((v) => v == null)) {
      // No audio sources are available
      gainNodeInputs.forEach((gainNodeInput, index) => {
        gainNodeInput.connect(gainNodeOutputs[index])
      })
    } else {
      // Connect input to output nodes based on mapping (at least one audio source is available)
      for (const [inputChannel, outputChannels] of Object.entries(
        inputOutputMapping,
      )) {
        if (outputChannels == null) continue

        const inputNodeIndex = Number(inputChannel)

        for (const outputChannel of outputChannels) {
          gainNodeInputs[inputNodeIndex].connect(gainNodeOutputs[outputChannel])
        }
      }
    }

    // Connect output gain nodes to audio context destination
    for (const gainNodeOutput of gainNodeOutputs) {
      gainNodeOutput.connect(audioContext.destination)
    }

    setGainInputNodes(gainNodeInputs)
    setGainOutputNodes(gainNodeOutputs)

    // Disconnect nodes to avoid memory leaks
    return () => {
      for (const gainNodeInput of gainNodeInputs) {
        gainNodeInput.disconnect()
      }

      for (const gainNodeOutput of gainNodeOutputs) {
        gainNodeOutput.disconnect()
      }

      splitter.disconnect()
      sourceNode.disconnect()

      setGainInputNodes(null)
      setGainOutputNodes(null)
    }
  }, [audioContext, ref, inputOutputMapping, sourceNode])

  // Master Volume
  useEffect(() => {
    if (masterVolume == null) return
    if (isMasterVolumeMuted == null) return
    if (audioContext == null) return
    if (gainOutputNodes == null) return

    const volume = isMasterVolumeMuted ? 0 : masterVolume

    gainOutputNodes.forEach((gainOutputNode) => {
      gainOutputNode.gain.setValueAtTime(volume, audioContext.currentTime)
    })
  }, [audioContext, gainOutputNodes, isMasterVolumeMuted, masterVolume])

  // Audio Mixer
  useEffect(() => {
    if (streamConfig == null) return
    if (audioContext == null) return
    if (gainInputNodes == null) return

    const inputNodeVolumeMapping: Record<number, number | null> = {
      0: null,
      1: null,
    }

    const elementsWithSound = streamConfig.elements.filter(
      (element) =>
        element.attributes.find(
          (attribute) => attribute.identifier === 'audio_source',
        ) != null,
    )

    for (const elementWithSound of elementsWithSound) {
      const audioStreamAttribute = elementWithSound.attributes.find(
        (attribute) => attribute.identifier === 'audio_source',
      )

      if (audioStreamAttribute == null) continue

      const channels = audioStreamAttribute.resources.audioStream?.channels

      if (channels == null) continue

      const volume = elementWithSound.config.isVolumeMuted
        ? 0
        : elementWithSound.config.volume

      for (const channel of channels) {
        inputNodeVolumeMapping[channel] = volume
      }
    }

    for (const [inputNodeIndex, volume] of Object.entries(
      inputNodeVolumeMapping,
    )) {
      if (volume == null) continue

      gainInputNodes[Number(inputNodeIndex)].gain.setValueAtTime(
        volume,
        audioContext.currentTime,
      )
    }
  }, [audioContext, gainInputNodes, streamConfig])

  // QR code detection for retrieving the stream configuration.
  useEffect(() => {
    if (!isMutableRefObjectHtmlVideoElement(ref) || !ref.current) return

    const video = ref.current
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d', { willReadFrequently: true })

    const qrCodeDetectionInterval = setInterval(() => {
      if (video == null || video.readyState !== video.HAVE_ENOUGH_DATA) return
      if (context == null) return
      if (setStreamConfigFromStreamerUrl == null) return

      // Define size of the region to capture from video for QR code detection
      const regionSize = Math.max(
        Number(process.env.NEXT_PUBLIC_QR_CODE_DETECTION_WIDTH_AND_HEIGHT),
        500,
      )

      // Adjust the canvas width and height to match the region size
      canvas.width = regionSize
      canvas.height = regionSize

      // Calculate the top left corner of the region in the video
      const regionStartX = Math.max(0, video.videoWidth - regionSize)
      const regionStartY = Math.max(0, video.videoHeight - regionSize)

      // Draw only the region of interest from the video to the canvas
      context.drawImage(
        video,
        regionStartX,
        regionStartY,
        regionSize,
        regionSize,
        0,
        0,
        regionSize,
        regionSize,
      )

      // Get image data from the region on the canvas
      const imageData = context.getImageData(0, 0, regionSize, regionSize)
      const qrCode = JSQR(imageData.data, regionSize, regionSize)

      if (qrCode == null) return

      const qrCodeData = qrCode.data
      const urlForStreamerConfigWithInformationFromQRCode =
        getStreamerConfigUrl(qrCodeData)
      if (
        urlForStreamerConfigWithInformationFromQRCode ===
        streamConfigFromStreamerUrl
      )
        return

      setStreamConfigFromStreamerUrl(
        urlForStreamerConfigWithInformationFromQRCode,
      )
      return
    }, Math.max(Number(process.env.NEXT_PUBLIC_QR_CODE_DETECTION_INTERVAL), 500))

    return () => {
      clearInterval(qrCodeDetectionInterval)
    }
  }, [ref, setStreamConfigFromStreamerUrl, streamConfigFromStreamerUrl])

  return isUsingPrerecordedStream ? (
    <video ref={ref} preload="auto" className="hidden">
      <source
        src={process.env.NEXT_PUBLIC_PRERECORDED_STREAM_URL}
        type="video/mp4"
      />
    </video>
  ) : (
    <video ref={ref} preload="auto" className="hidden" />
  )
})

export default HLSPlayer
