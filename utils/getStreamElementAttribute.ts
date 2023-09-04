import {
  StreamElement,
  StreamElementAttribute,
  StreamElementAttributeIdentifier,
} from 'types/element'

export default function getStreamElementAttribute(
  elementData: StreamElement,
  attributeIdentifier: StreamElementAttributeIdentifier,
): StreamElementAttribute | null {
  if (elementData == null) return null
  if (elementData.attributes?.length < 1) return null

  const attribute = elementData.attributes.find(
    (v) => v.identifier === attributeIdentifier,
  )

  if (attribute == null) return null
  return attribute
}
