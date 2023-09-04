import LocalForage from 'localforage'

import { StreamConfig } from 'types/element'

export default async function storeViewerConfigurationInLocalStorage(
  sceneKey: string,
  viewerConfiguration: StreamConfig | null,
): Promise<StreamConfig | null> {
  try {
    return await LocalForage.setItem(sceneKey, viewerConfiguration)
  } catch {
    return null
  }
}
