import { Listbox as HeadlessUIListbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Dispatch, Fragment, SetStateAction } from 'react'

export interface ListboxProps<T> {
  values: T[]
  selectedValue: T
  setSelectedValue: Dispatch<SetStateAction<T>> | ((newValue: T) => void)
  valueToString: (value: T) => string
}

export default function Listbox<T>({
  values,
  selectedValue,
  setSelectedValue,
  valueToString,
}: ListboxProps<T>) {
  return (
    <HeadlessUIListbox value={selectedValue} onChange={setSelectedValue}>
      <div className="relative mt-1">
        <HeadlessUIListbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-pointer focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          <span className="block truncate">{valueToString(selectedValue)}</span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronUpDownIcon
              className="w-5 h-5 text-black/30"
              aria-hidden="true"
            />
          </span>
        </HeadlessUIListbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <HeadlessUIListbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {values.map((value, index) => (
              <HeadlessUIListbox.Option
                key={index}
                className={({ active }) =>
                  `relative select-none py-2 pl-10 pr-4 cursor-pointer ${
                    active ? 'bg-editing text-white' : 'text-black'
                  }`
                }
                value={value}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? 'font-medium' : 'font-normal'
                      }`}
                    >
                      {valueToString(values[index])}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-editing">
                        <CheckIcon className="w-5 h-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </HeadlessUIListbox.Option>
            ))}
          </HeadlessUIListbox.Options>
        </Transition>
      </div>
    </HeadlessUIListbox>
  )
}
