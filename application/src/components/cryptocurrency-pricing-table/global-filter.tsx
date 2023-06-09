import { SearchIcon } from '@/components/icons/search';

export default function GlobalFilter({
  // @ts-ignore
  filter,
  // @ts-ignore
  setFilter,
}) {
  return (
    <div className="max-w-[230px] flex-1 text-right ltr:ml-auto rtl:mr-auto">
      <label className="relative hidden w-full items-center md:flex">
        <input
          value={filter || ''}
          onChange={(e) => setFilter(e.target.value)}
          className="h-10 w-full appearance-none rounded-lg bg-gray-100 py-1 text-sm font-medium tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pl-10 rtl:pr-10 dark:border-gray-600 dark:bg-[#1E293B] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500"
          placeholder="Search"
        />
        <span className="pointer-events-none absolute flex h-full cursor-pointer items-center justify-center px-4 text-gray-600 hover:text-gray-900 dark:text-white">
          <SearchIcon className="h-4 w-4" />
        </span>
      </label>
    </div>
  );
}
