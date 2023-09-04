import classNames from 'classnames'

export interface TextInputPlaceholderProps {
  className?: string
}

export default function TextInputPlaceholder({
  className,
}: TextInputPlaceholderProps) {
  return (
    <div
      className={classNames(
        'bg-gray-200 h-[2em] rounded flex-shrink-0',
        className,
      )}
    />
  )
}
