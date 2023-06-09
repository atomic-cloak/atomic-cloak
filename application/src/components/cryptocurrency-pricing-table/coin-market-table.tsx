import React from 'react';
import {
  useFlexLayout,
  usePagination,
  useResizeColumns,
  useSortBy,
  useTable,
} from 'react-table';
import { ChevronDown } from '@/components/icons/chevron-down';
import Scrollbar from '@/components/ui/scrollbar';

function CoinMarketTable({
  // @ts-ignore
  data,
  // @ts-ignore
  columns,
}) {
  const {
    getTableProps,
    getTableBodyProps,
    state,
    headerGroups,
    page,
    prepareRow,
  } = useTable(
    {
      // @ts-ignore
      columns,
      data,
    },
    useSortBy,
    useResizeColumns,
    useFlexLayout,
    usePagination
  );

  const { pageIndex } = state;
  return (
    <div>
      <Scrollbar style={{ width: '100%' }} autoHide="never">
        <div className="px-0.5">
          <table
            {...getTableProps()}
            className="transaction-table w-full border-separate border-0"
          >
            <thead className="text-sm text-gray-500 dark:text-gray-300">
              {headerGroups.map((headerGroup, idx) => (
                <tr
                  {...headerGroup.getHeaderGroupProps()}
                  key={idx}
                  className="-mb-3 border-b border-gray-200 dark:border-gray-700"
                >
                  {headerGroup.headers.map((column, idx) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      key={idx}
                      className="group px-2 py-5 font-normal dark:text-gray-400"
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
              className="text-xs font-medium text-gray-900 dark:text-white 3xl:text-sm"
            >
              {page.map((row, idx) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    key={idx}
                    className="items-center border-b border-gray-200 uppercase dark:border-gray-700"
                  >
                    {row.cells.map((cell, idx) => {
                      return (
                        <td
                          {...cell.getCellProps()}
                          key={idx}
                          className="px-2 py-4 tracking-[1px]"
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
  );
}

export default CoinMarketTable;
