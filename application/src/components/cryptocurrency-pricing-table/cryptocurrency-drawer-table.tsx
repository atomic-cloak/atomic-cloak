import React, { useState } from 'react';
import { ChevronDown } from '@/components/icons/chevron-down';
import { LongArrowRight } from '@/components/icons/long-arrow-right';
import Button from '@/components/ui/button';
import Scrollbar from '@/components/ui/scrollbar';
import GlobalFilter from '@/components/cryptocurrency-pricing-table/global-filter';
import {
  useTable,
  useResizeColumns,
  useFlexLayout,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from 'react-table';
import { LongArrowLeft } from '@/components/icons/long-arrow-left';
import CryptocurrencyRetroDrawer from '@/components/cryptocurrency-pricing-table/cryptocurrency-retro-drawer';

function CryptocurrencyDrawerTable({
  // @ts-ignore
  columns,
  // @ts-ignore
  data,
}) {
  const {
    getTableProps,
    getTableBodyProps,
    canPreviousPage,
    canNextPage,
    pageOptions,
    state,
    setGlobalFilter,
    headerGroups,
    page,
    nextPage,
    previousPage,
    prepareRow,
  } = useTable(
    {
      // @ts-ignore
      columns,
      // @ts-ignore
      data,
      initialState: { pageSize: 17 },
    },
    useGlobalFilter,
    useSortBy,
    useResizeColumns,
    useFlexLayout,
    usePagination
  );
  const { pageIndex } = state;
  const { globalFilter } = state;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="mt-11">
        <div className="w-full xl:w-auto">
          <div className="-mx-0.5 shadow-card dark:[&_.os-scrollbar_.os-scrollbar-track_.os-scrollbar-handle:before]:!bg-white/50">
            <div className="rounded-tl-lg rounded-tr-lg bg-white pt-6 dark:bg-light-dark md:px-6 md:pt-8">
              <div
                className={`flex items-center justify-between rounded-tl-lg border-b border-dashed border-gray-200 pb-5 dark:border-gray-700 ${
                  !isOpen ? 'rounded-tr-lg' : ''
                }`}
              >
                <h2 className="shrink-0 pl-[10px] text-lg font-medium uppercase text-black dark:text-white sm:text-xl md:pl-0 2xl:text-xl 3xl:text-2xl">
                  Cryptocurrency Prices
                </h2>
                <GlobalFilter
                  filter={globalFilter}
                  setFilter={setGlobalFilter}
                />
              </div>
            </div>
            <Scrollbar style={{ width: '100%' }} autoHide="never" className="">
              <div>
                <table
                  {...getTableProps()}
                  className="-mt-[2px] w-full border-separate border-0"
                >
                  <thead className="pricing-table-head block bg-white text-sm text-gray-500 dark:bg-light-dark dark:text-gray-300 md:!px-6">
                    {headerGroups.map((headerGroup, idx) => (
                      <tr
                        {...headerGroup.getHeaderGroupProps()}
                        key={idx}
                        className="border-b border-dashed border-gray-200 dark:border-gray-700"
                      >
                        {headerGroup.headers.map((column, idx) => (
                          <th
                            {...column.getHeaderProps(
                              column.getSortByToggleProps()
                            )}
                            key={idx}
                            className="group px-3 py-5 font-normal first:!w-7"
                          >
                            <div className="flex items-center">
                              {column.render('Header')}
                              {column.canResize && (
                                <div
                                  {...column.getResizerProps()}
                                  className={`resizer ${
                                    column.isResizing ? 'isResizing' : ''
                                  }`}
                                />
                              )}
                              <span className="ltr:ml-1 rtl:mr-1">
                                {column.isSorted ? (
                                  column.isSortedDesc ? (
                                    <ChevronDown />
                                  ) : (
                                    <ChevronDown className="rotate-180" />
                                  )
                                ) : (
                                  <ChevronDown className="rotate-180 opacity-0 transition group-hover:opacity-50" />
                                )}
                              </span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody
                    {...getTableBodyProps()}
                    className="pricing-table-body grid bg-white text-xs font-medium text-gray-900  dark:bg-light-dark dark:text-white md:px-6 3xl:text-sm"
                  >
                    {page.map((row, idx) => {
                      prepareRow(row);
                      return (
                        <tr
                          {...row.getRowProps()}
                          key={idx + 1}
                          className="h-[50px] max-h-[50px] cursor-pointer items-center rounded uppercase transition-all last:mb-0 hover:bg-[#F3F4F6] dark:bg-light-dark"
                          onClick={() => setIsOpen(true)}
                        >
                          {row.cells.map((cell, idx) => {
                            return (
                              <td
                                {...cell.getCellProps()}
                                key={idx}
                                className="flex h-[50px] items-center px-3 tracking-[1px]"
                              >
                                {cell.render('Cell')}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Scrollbar>
          </div>
          <div
            className={`-mt-[2px] flex items-center justify-center rounded-bl-lg bg-white px-5 py-4 text-sm shadow-card dark:bg-light-dark lg:py-6 ${
              !isOpen ? 'rounded-br-lg' : ''
            }`}
          >
            <div className="flex items-center gap-5">
              <Button
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
                title="Previous"
                shape="circle"
                variant="transparent"
                size="small"
                className="text-gray-700 disabled:text-gray-400 dark:text-white disabled:dark:text-gray-400"
              >
                <LongArrowLeft className="h-auto w-4 rtl:rotate-180" />
              </Button>
              <div>
                Page{' '}
                <strong className="font-semibold">
                  {pageIndex + 1} of {pageOptions.length}
                </strong>{' '}
              </div>
              <Button
                onClick={() => nextPage()}
                disabled={!canNextPage}
                title="Next"
                shape="circle"
                variant="transparent"
                size="small"
                className="text-gray-700 disabled:text-gray-400 dark:text-white disabled:dark:text-gray-400"
              >
                <LongArrowRight className="h-auto w-4 rtl:rotate-180" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <CryptocurrencyRetroDrawer isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}

export default CryptocurrencyDrawerTable;
