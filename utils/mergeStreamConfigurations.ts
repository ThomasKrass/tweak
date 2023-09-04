import { StreamConfig } from 'types/element'

/**
 * Merges the streamer and viewer configuration according to the specified behavior.
 * - `overwrite`: Overwrites the streamer's configuration with the entire configuration of the viewer
 * - `merge`: Applies the viewers' `config` of each element to each respective element inside
 *              the streamer's configuration
 *
 * @param streamerConfiguration the streamer's configuration
 * @param viewerConfiguration the viewer's configuration
 * @param behavior controls how the configurations are merged
 *
 * @returns a merged `StreamConfig`
 */
export default function mergeStreamConfigurations(
  streamerConfiguration: StreamConfig | null,
  viewerConfiguration: StreamConfig | null,
  behavior: 'overwrite' | 'merge' = 'merge',
): StreamConfig | null {
  if (streamerConfiguration == null) return viewerConfiguration
  if (viewerConfiguration == null) return streamerConfiguration

  switch (behavior) {
    case 'overwrite': {
      return viewerConfiguration
    }
    case 'merge': {
      const mergedConfiguration = structuredClone(streamerConfiguration)

      for (const elementInViewerConfig of viewerConfiguration.elements) {
        const elementInMergedConfigToAdjust = mergedConfiguration.elements.find(
          (e) => e.instanceId === elementInViewerConfig.instanceId,
        )

        if (elementInMergedConfigToAdjust == null) continue

        elementInMergedConfigToAdjust.config = structuredClone(
          elementInViewerConfig.config,
        )
      }

      return mergedConfiguration
    }
  }
}
