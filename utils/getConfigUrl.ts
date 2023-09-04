const CONFIG_SERVER_URL = process.env.NEXT_PUBLIC_CONFIG_SERVER_URL

/**
 * Returns the streamer's configuration from the config server for the specified scene.
 *
 * @param sceneName the scene to get the respective streamer config for
 * @returns the URL to the config file
 */
export default function getStreamerConfigUrl(sceneName: string): string | null {
  if (CONFIG_SERVER_URL == null) return null

  return `${CONFIG_SERVER_URL}/${sceneName}.json`
}
