import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { ChevronDown } from '@/components/icons/chevron-down';
import ActiveLink from '@/components/ui/links/active-link';

interface ExplorersProps {
  title: string;
  url: string;
}

export default function Explorers({ menu }: { menu: ExplorersProps[] }) {
  return (
    <div>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex w-full items-center justify-center rounded-lg bg-gray-100 px-3 pb-1 pt-[6px] text-sm font-medium text-gray-900 dark:bg-gray-700 dark:text-white">
            Options
            <ChevronDown
              className="h-3 w-3 text-gray-900 ltr:ml-2 rtl:mr-2 dark:text-white"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-20 mt-2 w-full min-w-[220px] origin-top-right rounded-lg bg-white p-3 px-1.5 shadow-large shadow-gray-400/10 dark:bg-[rgba(0,0,0,0.5)] dark:shadow-gray-900 dark:backdrop-blur">
            <div className="px-1 py-1 ">
              {menu.map((item) => (
                <Menu.Item key={item.title}>
                  {({ active }) => (
                    <ActiveLink
                      href={item.url}
                      target="_blank"
                      className={`${
                        active
                          ? 'bg-gray-100 dark:bg-gray-700'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-900 dark:text-white`}
                    >
                      {item.title}
                    </ActiveLink>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
