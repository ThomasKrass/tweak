import { Triangle } from 'react-loader-spinner'

export default function LoadingSpinner() {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none bg-black/50">
      <Triangle color="white" />
    </div>
  )
}
