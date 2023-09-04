import classNames from 'classnames'

interface ProfileIconPlaceholderProps {
  darker?: boolean
}

export default function ProfileIconPlaceholder({
  darker,
}: ProfileIconPlaceholderProps) {
  return (
    <div
      className={classNames('bg-gray-200 w-[30px] h-[30px] rounded-full', {
        ['bg-gray-300']: darker,
      })}
    />
  )
}
