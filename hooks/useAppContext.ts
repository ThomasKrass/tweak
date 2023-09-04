import { useContext } from 'react'

import { AppContext } from 'contexts/appContext'

export default function useAppContext() {
  return useContext(AppContext)
}
