// src/components/LocationFilter.tsx

import { Location } from '@/types';
import { Fragment,
  //  useState
   } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

const locations: Location[] = [
  'ALL',
  'Guwahati',
  'Tezpur',
  'Jorhat',
  'Dibrugarh',
  'Tinsukia',
  'Silchar'
];

interface LocationFilterProps {
  selectedLocation: Location;
  onChange: (location: Location) => void;
}

export default function LocationFilter({ selectedLocation, onChange }: LocationFilterProps) {
  return (
    <Listbox value={selectedLocation} onChange={onChange}>
      <div className="relative mt-1">
        <Listbox.Button className="relative w-full cursor-default rounded-lg text-gray-900 bg-white py-2 pl-3 pr-10 text-left border focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          <span className="block truncate text-gray-900">{selectedLocation}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
            {locations.map((location) => (
              <Listbox.Option
                key={location}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'
                  }`
                }
                value={location}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate text-gray-900 ${
                        selected ? 'font-medium' : 'font-normal'
                      }`}
                    >
                      {location}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}