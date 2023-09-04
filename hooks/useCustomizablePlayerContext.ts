import { useContext } from 'react'

import { CustomizablePlayerContext } from 'contexts/customizablePlayerContext'

export default function useCustomizablePlayerContext() {
  return useContext(CustomizablePlayerContext)
}
