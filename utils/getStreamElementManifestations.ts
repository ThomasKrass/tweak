import { StreamElement, StreamElementManifestationsData } from 'types/element'

export default function getStreamElementManifestations(
  elementData: StreamElement,
): StreamElementManifestationsData | null {
  if (elementData == null) return null

  const manifestations = elementData.manifestations
  if (manifestations == null) return null

  return manifestations
}
