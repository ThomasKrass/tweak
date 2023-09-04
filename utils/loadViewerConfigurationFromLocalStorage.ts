import LocalForage from 'localforage'

import { StreamConfig } from 'types/element'

export default async function loadViewerConfigurationFromLocalStorage(
  sceneKey: string,
): Promise<StreamConfig | null> {
  try {
    return await LocalForage.getItem(sceneKey)
  } catch {
    return null
  }
}
