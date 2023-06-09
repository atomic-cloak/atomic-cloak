import { LAYOUT_OPTIONS } from '@/lib/constants';
import { useLayout } from '@/lib/hooks/use-layout';
import { format } from 'date-fns';
import React from 'react';
import { CalendarIcon } from '@/components/icons/calendar-icon';

function CalendarTimeline() {
  const today = format(new Date(), 'MMMM dd, yyyy');
  const { layout } = useLayout();
  return (
    <div
      className={`flex w-full flex-col gap-3 rounded-lg bg-white p-4 shadow-card dark:bg-light-dark md:p-8 ${
        layout === LAYOUT_OPTIONS.RETRO
          ? '2xl:w-2/5 3xl:max-w-[358px]'
          : 'lg:w-2/5 xl:max-w-[358px]'
      }`}
    >
      <h2 className="text-xl font-medium uppercase text-black dark:text-white">
        On This Day
      </h2>
      <span className="text-gray-500 dark:text-gray-400">{today}</span>

      <div className="mt-5 flex flex-col gap-9">
        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <CalendarIcon />
            <span className="text-gray-700 dark:text-gray-400">Today</span>
          </div>
          <span className="text-base font-medium text-black dark:text-white">
            $218
          </span>
        </div>
        <div className="relative z-10 flex items-center justify-between gap-3">
          <span className="absolute bottom-8 left-2 -z-[1] h-5 w-[1px] bg-slate-200"></span>
          <div className="flex items-center gap-3">
            <CalendarIcon />
            <span className="text-gray-700 dark:text-gray-400">1 year ago</span>
          </div>
          <span className="text-base font-medium text-black dark:text-white">
            $303
          </span>
        </div>
        <div className="relative z-10 flex items-center justify-between gap-3">
          <span className="absolute bottom-8 left-2 -z-[1] h-5 w-[1px] bg-slate-200"></span>
          <div className="flex items-center gap-3">
            <CalendarIcon />
            <span className="text-gray-700 dark:text-gray-400">2 year ago</span>
          </div>
          <span className="text-base font-medium text-black dark:text-white">
            $15
          </span>
        </div>
        <div className="relative z-10 flex items-center justify-between gap-3">
          <span className="absolute bottom-8 left-2 -z-[1] h-5 w-[1px] bg-slate-200"></span>
          <div className="flex items-center gap-3">
            <CalendarIcon />
            <span className="text-gray-700 dark:text-gray-400">3 year ago</span>
          </div>
          <span className="text-base font-medium text-black dark:text-white">
            $32
          </span>
        </div>
        <div className="relative z-10 flex items-center justify-between gap-3">
          <span className="absolute bottom-8 left-2 -z-[1] h-5 w-[1px] bg-slate-200"></span>
          <div className="flex items-center gap-3">
            <CalendarIcon />
            <span className="text-gray-700 dark:text-gray-400">4 year ago</span>
          </div>
          <span className="text-base font-medium text-black dark:text-white">
            $15
          </span>
        </div>
      </div>
    </div>
  );
}

export default CalendarTimeline;
